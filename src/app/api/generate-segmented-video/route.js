// Global progress tracking (in a real app, use Redis or database)
const progressStore = new Map()

export async function POST(request) {
  console.log('🎬 Starting segmented video generation...')
  
  try {
    const { videoScript, voiceSettings = {} } = await request.json()
    
    if (!videoScript) {
      console.log('❌ No video script provided')
      return Response.json({ error: 'No video script provided' }, { status: 400 })
    }

    console.log(`📝 Processing video script (${videoScript.length} characters)...`)
    
    // Create a unique session ID for progress tracking
    const sessionId = generateSessionId()
    
    // Initialize progress tracking
    const segments = breakIntoSegments(videoScript)
    progressStore.set(sessionId, {
      totalSegments: segments.length,
      completedSegments: 0,
      failedSegments: 0,
      currentSegment: 0,
      segmentStatus: new Array(segments.length).fill(null),
      status: 'processing',
      error: null
    })
    
    // Start processing in background
    generateSegmentedVideoWithProgress(videoScript, voiceSettings, sessionId)
    
    return Response.json({ 
      success: true, 
      sessionId,
      totalSegments: segments.length
    })

  } catch (error) {
    console.error('💥 Segmented video generation error:', error)
    return Response.json({ error: 'Segmented video generation failed' }, { status: 500 })
  }
}

async function generateSegmentedVideoWithProgress(videoScript, voiceSettings, sessionId) {
  try {
    console.log(`🔑 Checking OpenAI API key...`)
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is not set')
    }
    
    // Step 1: Break content into logical segments
    const segments = breakIntoSegments(videoScript)
    console.log(`📊 Created ${segments.length} segments`)
    
    // Step 2: Generate audio and video for each segment
    const segmentResults = []
    const failedSegments = []
    
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i]
      console.log(`🎬 Processing segment ${i + 1}/${segments.length}: ${segment.title}`)
      
      // Update progress - start processing
      updateProgress(sessionId, i, 'processing')
      
      try {
        // Generate audio for this segment
        console.log(`🎵 Generating audio for segment ${i + 1}...`)
        const audioData = await generateSegmentAudio(segment.content, voiceSettings, i)
        console.log(`✅ Audio generated for segment ${i + 1}: ${audioData.duration.toFixed(1)}s`)
        
        // Generate video for this segment
        console.log(`🎬 Generating video for segment ${i + 1}...`)
        const videoData = await generateSegmentVideo(segment.content, audioData.duration, i)
        console.log(`✅ Video generated for segment ${i + 1}`)
        
        // Combine audio and video for this segment
        console.log(`🔗 Combining audio and video for segment ${i + 1}...`)
        const combinedSegment = await combineSegment(audioData, videoData, i)
        console.log(`✅ Combined segment ${i + 1} created`)
        
        segmentResults.push({
          ...segment,
          audioData,
          videoData,
          combinedSegment
        })
        
        // Update progress - completed successfully
        updateProgress(sessionId, i, 'completed')
        console.log(`📊 Segment ${i + 1} completed successfully`)
        
      } catch (error) {
        console.error(`❌ Error processing segment ${i + 1}:`, error)
        failedSegments.push({
          index: i,
          title: segment.title,
          error: error.message
        })
        
        // Update progress - failed
        updateProgress(sessionId, i, 'failed', error.message)
        
        // Create a fallback segment with just audio
        console.log(`🔄 Creating fallback segment ${i + 1} with audio only...`)
        try {
          const audioData = await generateSegmentAudio(segment.content, voiceSettings, i)
          
          // Create a simple fallback video
          const fallbackVideoData = await createFallbackVideo(segment.content, audioData.duration, i)
          
          const combinedSegment = await combineSegment(audioData, fallbackVideoData, i)
          
          segmentResults.push({
            ...segment,
            audioData,
            videoData: fallbackVideoData,
            combinedSegment,
            isFallback: true
          })
          
          // Update progress - fallback completed
          updateProgress(sessionId, i, 'completed', null, true)
          console.log(`✅ Fallback segment ${i + 1} created successfully`)
        } catch (fallbackError) {
          console.error(`❌ Fallback segment ${i + 1} also failed:`, fallbackError)
          updateProgress(sessionId, i, 'failed', fallbackError.message)
        }
      }
    }
    
    if (segmentResults.length === 0) {
      throw new Error('No segments were successfully processed')
    }
    
    console.log(`📊 Successfully processed ${segmentResults.length}/${segments.length} segments`)
    if (failedSegments.length > 0) {
      console.log(`⚠️ Failed segments:`, failedSegments.map(f => `${f.index + 1}: ${f.title}`).join(', '))
    }
    
    // Step 3: Concatenate all successful segments into final video
    console.log(`🎬 Concatenating ${segmentResults.length} segments into final video...`)
    const finalVideo = await concatenateSegments(segmentResults)
    console.log(`✅ Final video created successfully`)
    
    // Update final progress
    const finalResult = {
      ...finalVideo,
      totalSegments: segments.length,
      successfulSegments: segmentResults.length,
      failedSegments: failedSegments.length,
      failedSegmentDetails: failedSegments
    }
    
    updateProgress(sessionId, null, 'completed', null, false, finalResult)
    
  } catch (error) {
    console.error('💥 Segmented video generation error:', error)
    updateProgress(sessionId, null, 'failed', error.message)
  }
}

function updateProgress(sessionId, segmentIndex, status, error = null, isFallback = false, finalResult = null) {
  const progress = progressStore.get(sessionId)
  if (!progress) return
  
  if (segmentIndex !== null) {
    progress.segmentStatus[segmentIndex] = { 
      status, 
      error, 
      isFallback,
      timestamp: new Date().toISOString()
    }
    
    if (status === 'completed') {
      progress.completedSegments++
    } else if (status === 'failed') {
      progress.failedSegments++
    }
    
    progress.currentSegment = segmentIndex + 1
  } else {
    progress.status = status
    progress.error = error
    if (finalResult) {
      progress.finalResult = finalResult
    }
  }
  
  progressStore.set(sessionId, progress)
  console.log(`📊 Progress updated for session ${sessionId}: ${status}${segmentIndex !== null ? ` (segment ${segmentIndex + 1})` : ''}`)
}

// Add a GET endpoint to check progress
export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('sessionId')
  
  if (!sessionId) {
    return Response.json({ error: 'Session ID required' }, { status: 400 })
  }
  
  const progress = progressStore.get(sessionId)
  if (!progress) {
    return Response.json({ error: 'Session not found' }, { status: 404 })
  }
  
  return Response.json(progress)
}

async function createFallbackVideo(content, audioDuration, segmentIndex) {
  // Create a simple fallback video with text and basic shapes
  const fallbackCode = `from manim import *

class FallbackScene(Scene):
    def construct(self):
        # Title
        title = Text("Educational Content", font_size=36, color=BLUE)
        title.to_edge(UP)
        
        # Simple content representation
        content_text = Text("Content Loading...", font_size=24, color=WHITE)
        content_text.move_to(ORIGIN)
        
        # Decorative elements
        circle = Circle(radius=0.5, color=RED)
        circle.move_to(LEFT * 2)
        
        square = Square(side_length=1, color=GREEN)
        square.move_to(RIGHT * 2)
        
        # Animation sequence
        self.play(Write(title))
        self.wait(0.5)
        self.play(Create(circle))
        self.wait(0.5)
        self.play(Create(square))
        self.wait(0.5)
        self.play(Write(content_text))
        self.wait(${Math.max(1, audioDuration - 2)})
        
        # Fade out
        self.play(FadeOut(title), FadeOut(circle), FadeOut(square), FadeOut(content_text))
        self.wait(0.5)`
  
  // Use the same rendering logic as the main function
  const { writeFile, mkdir, access, copyFile } = await import('fs/promises')
  const { join } = await import('path')
  const { spawn } = await import('child_process')
  
  const sessionId = generateSessionId()
  const segmentDir = join(process.cwd(), 'segmented-sessions', sessionId, 'videos')
  await mkdir(segmentDir, { recursive: true })
  
  const manimFile = join(segmentDir, `fallback_${segmentIndex}.py`)
  await writeFile(manimFile, fallbackCode)
  
  return new Promise((resolve, reject) => {
    console.log(`🎬 Rendering fallback video for segment ${segmentIndex}...`)
    
    const manim = spawn('manim', [
      '-pql',
      manimFile,
      'FallbackScene'
    ])
    
    let stderr = ''
    
    manim.stderr.on('data', (data) => {
      stderr += data.toString()
    })
    
    manim.on('close', async (code) => {
      if (code === 0) {
        const globalMediaDir = join(process.cwd(), 'media', 'videos')
        
        try {
          await access(globalMediaDir)
          const { readdir } = require('fs/promises')
          const files = await readdir(globalMediaDir, { recursive: true })
          const mp4Files = files.filter(file => 
            typeof file === 'string' && file.endsWith('.mp4')
          )
          
          if (mp4Files.length > 0) {
            const videoFile = mp4Files[mp4Files.length - 1]
            const videoPath = join(globalMediaDir, videoFile)
            const sessionVideoPath = join(segmentDir, `fallback_${segmentIndex}.mp4`)
            await copyFile(videoPath, sessionVideoPath)
            
            resolve({
              videoPath: sessionVideoPath,
              sessionId
            })
          } else {
            reject(new Error('No fallback video file generated'))
          }
        } catch (error) {
          reject(new Error(`Error accessing media directory: ${error.message}`))
        }
      } else {
        reject(new Error(`Fallback Manim failed: ${stderr}`))
      }
    })
    
    manim.on('error', reject)
  })
}

function breakIntoSegments(content) {
  // Split content into logical segments
  const segments = []
  const lines = content.split('\n')
  let currentSegment = { title: '', content: '' }
  
  for (const line of lines) {
    const trimmedLine = line.trim()
    
    if (trimmedLine.startsWith('* **') && trimmedLine.includes('**')) {
      // Save previous segment if it has content
      if (currentSegment.content.trim()) {
        segments.push(currentSegment)
      }
      
      // Start new segment
      const title = trimmedLine.replace('* **', '').replace('**', '').replace(':', '')
      currentSegment = { title, content: '' }
    } else if (trimmedLine && !trimmedLine.startsWith('* **Key Concepts:') && !trimmedLine.startsWith('* **Animation Ideas:')) {
      // Only add content that's not metadata
      if (currentSegment.content) {
        currentSegment.content += '\n' + trimmedLine
      } else {
        currentSegment.content = trimmedLine
      }
    }
  }
  
  // Add the last segment
  if (currentSegment.content.trim()) {
    segments.push(currentSegment)
  }
  
  return segments
}

async function generateSegmentAudio(content, voiceSettings, segmentIndex) {
  // Clean the script for TTS - only include the educational content
  const cleanScript = cleanScriptForTTS(content)
  
  console.log(`🎵 Generating audio for segment ${segmentIndex + 1}`)
  console.log(`📝 Clean script (${cleanScript.length} chars):`, cleanScript.substring(0, 200) + '...')

  const response = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'tts-1',
      input: cleanScript,
      voice: voiceSettings.voice || 'alloy',
      speed: voiceSettings.speed || 1.0
    })
  })

  if (!response.ok) {
    const errorData = await response.text()
    console.error(`❌ TTS API error: ${response.status}`, errorData)
    throw new Error(`TTS generation failed: ${response.status}`)
  }

  const audioBuffer = await response.arrayBuffer()
  
  // Save audio file
  const { writeFile, mkdir } = await import('fs/promises')
  const { join } = await import('path')
  
  const sessionId = generateSessionId()
  const audioDir = join(process.cwd(), 'segmented-sessions', sessionId, 'audio')
  await mkdir(audioDir, { recursive: true })
  
  const audioPath = join(audioDir, `segment_${segmentIndex}.mp3`)
  await writeFile(audioPath, Buffer.from(audioBuffer))
  
  // Get audio duration using ffprobe
  const { spawn } = await import('child_process')
  const duration = await new Promise((resolve, reject) => {
    const ffprobe = spawn('ffprobe', [
      '-v', 'quiet',
      '-show_entries', 'format=duration',
      '-of', 'csv=p=0',
      audioPath
    ])
    
    let output = ''
    ffprobe.stdout.on('data', (data) => {
      output += data.toString()
    })
    
    ffprobe.on('close', (code) => {
      if (code === 0) {
        const duration = parseFloat(output.trim())
        resolve(duration)
      } else {
        reject(new Error('Failed to get audio duration'))
      }
    })
  })
  
  console.log(`✅ Audio generated: ${duration.toFixed(1)}s`)
  
  return {
    path: audioPath,
    duration: duration,
    url: `/api/audio/${sessionId}/segment_${segmentIndex}.mp3`
  }
}

async function generateSegmentVideo(content, audioDuration, segmentIndex) {
  // Generate Manim code for this segment
  const manimCode = await generateSegmentManimCode(content, audioDuration, segmentIndex)
  
  // Render the Manim code
  const videoData = await renderSegmentVideo(manimCode, segmentIndex)
  
  return videoData
}

async function generateSegmentManimCode(content, audioDuration, segmentIndex) {
  // Extract animation ideas from the original content
  const animationIdeasMatch = content.match(/\* \*\*Animation Ideas:\*\*([\s\S]*?)(?=\* \*\*|$)/)
  const animationIdeas = animationIdeasMatch ? animationIdeasMatch[1].trim() : ''
  
  // Clean the content for the prompt
  const cleanContent = content.replace(/\* \*\*Key Concepts:\*\*[\s\S]*?(?=\* \*\*|$)/g, '')
                             .replace(/\* \*\*Animation Ideas:\*\*[\s\S]*?(?=\* \*\*|$)/g, '')
                             .replace(/\* /g, '')
                             .replace(/\*\*/g, '')
                             .trim()

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [{
        role: 'system',
        content: `You are an expert at creating Manim animations in the style of 3Blue1Brown. Create engaging, educational animations that teach mathematical and scientific concepts clearly and beautifully.

IMPORTANT RULES:
1. Create a SINGLE Scene class that inherits from Scene
2. The animation should be EXACTLY ${audioDuration.toFixed(1)} seconds long
3. Clear the frame frequently using self.clear() to prevent overlap
4. Use proper positioning - avoid overlapping shapes and text unless absolutely necessary
5. Create smooth, engaging animations that tell a story
6. Use colors that are visually appealing and have good contrast
7. Include mathematical notation when appropriate
8. Make the animation flow naturally with the narration

ANIMATION STYLE:
- Use the signature 3Blue1Brown style: clean, elegant, and educational
- Start with simple concepts and build up complexity
- Use smooth transitions and transformations
- Include visual metaphors and analogies
- Make abstract concepts concrete and visual
- Use consistent color schemes and typography

TECHNICAL REQUIREMENTS:
- Import all necessary Manim classes at the top
- Use proper Manim syntax and methods
- Include proper cleanup with self.clear() between major sections
- Use self.wait() for timing synchronization
- Ensure all objects are properly positioned and scaled
- Use descriptive variable names

EXAMPLE STRUCTURE:
from manim import *

class EducationalScene(Scene):
    def construct(self):
        # Clear any previous content
        self.clear()
        
        # Introduction
        title = Text("Concept Title", font_size=48, color=BLUE)
        self.play(Write(title))
        self.wait(1)
        self.clear()
        
        # Main content with proper spacing
        # ... animation content ...
        
        # Clear between sections
        self.clear()
        
        # Conclusion
        # ... final content ...
        
        self.wait(1)`
      }, {
        role: 'user',
        content: `Create a Manim animation for this educational content:

CONTENT: ${cleanContent}

ANIMATION IDEAS: ${animationIdeas}

REQUIREMENTS:
- Duration: ${audioDuration.toFixed(1)} seconds
- Style: 3Blue1Brown educational animation
- Clear frames frequently to prevent overlap
- Avoid overlapping shapes and text unless necessary
- Create a cohesive, engaging story
- Use proper mathematical notation and visual metaphors

Generate ONLY the Python code, no explanations or markdown formatting.`
      }],
      temperature: 0.7,
      max_tokens: 2000
    })
  })

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`)
  }

  const data = await response.json()
  let manimCode = data.choices[0].message.content.trim()

  // Clean the code
  manimCode = cleanManimCode(manimCode)
  
  return manimCode
}

async function renderSegmentVideo(manimCode, segmentIndex) {
  // Create a temporary file for this segment
  const { writeFile, mkdir, access, copyFile } = await import('fs/promises')
  const { join } = await import('path')
  const { spawn } = await import('child_process')
  
  const sessionId = generateSessionId()
  const segmentDir = join(process.cwd(), 'segmented-sessions', sessionId, 'videos')
  await mkdir(segmentDir, { recursive: true })
  
  // Clean the Manim code before writing to file
  let cleanCode = manimCode.trim()
  
  // Remove markdown code blocks
  if (cleanCode.startsWith('```python')) {
    cleanCode = cleanCode.replace(/^```python\n?/, '')
  }
  if (cleanCode.startsWith('```')) {
    cleanCode = cleanCode.replace(/^```\n?/, '')
  }
  if (cleanCode.endsWith('```')) {
    cleanCode = cleanCode.replace(/\n?```$/, '')
  }
  
  // Remove markdown formatting
  cleanCode = cleanCode
    .replace(/^\s*[-*]\s*.*$/gm, '') // Remove bullet points
    .replace(/^\s*#+\s*.*$/gm, '') // Remove headers
    .replace(/^\s*CRITICAL:.*$/gm, '') // Remove critical sections
    .replace(/^\s*IMPORTANT:.*$/gm, '') // Remove important sections
  
  // Remove non-Python lines
  const lines = cleanCode.split('\n')
  const pythonLines = lines.filter(line => {
    const trimmed = line.trim()
    return trimmed === '' || 
           trimmed.startsWith('#') || 
           trimmed.startsWith('from ') || 
           trimmed.startsWith('import ') || 
           trimmed.startsWith('class ') || 
           trimmed.startsWith('def ') || 
           trimmed.startsWith('if ') || 
           trimmed.startsWith('for ') || 
           trimmed.startsWith('while ') || 
           trimmed.startsWith('try:') || 
           trimmed.startsWith('except') || 
           trimmed.startsWith('finally:') || 
           trimmed.startsWith('with ') || 
           trimmed.startsWith('return ') || 
           trimmed.startsWith('self.') || 
           trimmed.startsWith('    ') || 
           trimmed.startsWith('\t') || 
           /^[a-zA-Z_][a-zA-Z0-9_]*\s*=/.test(trimmed) || 
           /^[a-zA-Z_][a-zA-Z0-9_]*\s*\(/.test(trimmed) || 
           /^[a-zA-Z_][a-zA-Z0-9_]*\s*\./.test(trimmed) || 
           /^[a-zA-Z_][a-zA-Z0-9_]*\s*[+\-*/=<>!&|]/.test(trimmed) || 
           /^[0-9]/.test(trimmed) || 
           /^["'`]/.test(trimmed) || 
           /^[\(\[\{]\)/.test(trimmed) || 
           /^[\)\]\}]$/.test(trimmed) || 
           /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(trimmed)
  })
  
  cleanCode = pythonLines.join('\n').trim()
  
  // Fix malformed variable assignments (the main issue)
  cleanCode = cleanCode.replace(/([a-zA-Z_][a-zA-Z0-9_]*)\s*,\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.+)/g, '$1 = $3')
  cleanCode = cleanCode.replace(/([a-zA-Z_][a-zA-Z0-9_]*)\s*,\s*m\s*=\s*(.+)/g, '$1 = $2')
  cleanCode = cleanCode.replace(/([a-zA-Z_][a-zA-Z0-9_]*)\s*,\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.+)/g, '$1 = $3')
  
  // Fix incomplete lines
  cleanCode = cleanCode.replace(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*,\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*$/gm, '')
  cleanCode = cleanCode.replace(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*,\s*m\s*=\s*$/gm, '')
  
  // Fix lines that end with incomplete assignments
  cleanCode = cleanCode.replace(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*,\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*([^=]+)$/gm, '$1 = $3')
  
  // Ensure basic imports
  if (!cleanCode.includes('from manim import')) {
    cleanCode = 'from manim import *\n' + cleanCode;
  }
  
  // Ensure proper class structure
  if (!cleanCode.includes('class') && !cleanCode.includes('def construct')) {
    cleanCode = `from manim import *

class Animation(Scene):
    def construct(self):
        # Title
        title = Text("Educational Video")
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))
        
        # Main content
        circle = Circle(radius=0.5)
        self.play(Create(circle))
        self.wait(1)
        
        # End
        self.wait(1)`
  }
  
  // Fix empty self.play() calls
  cleanCode = cleanCode.replace(/self\.play\(\s*\)/g, 'self.wait(1)');
  cleanCode = cleanCode.replace(/self\.play\(\s*\n\s*\)/g, 'self.wait(1)');
  
  // Replace any SVG or external file references
  cleanCode = cleanCode.replace(/SVGMobject\([^)]*\.svg[^)]*\)/g, 'Circle(radius=0.5)');
  cleanCode = cleanCode.replace(/ImageMobject\([^)]*\.svg[^)]*\)/g, 'Circle(radius=0.5)');
  cleanCode = cleanCode.replace(/ImageMobject\([^)]*\.png[^)]*\)/g, 'Circle(radius=0.5)');
  cleanCode = cleanCode.replace(/ImageMobject\([^)]*\.jpg[^)]*\)/g, 'Circle(radius=0.5)');
  cleanCode = cleanCode.replace(/ImageMobject\([^)]*\.jpeg[^)]*\)/g, 'Circle(radius=0.5)');
  cleanCode = cleanCode.replace(/ImageMobject\([^)]*\.gif[^)]*\)/g, 'Circle(radius=0.5)');
  cleanCode = cleanCode.replace(/ImageMobject\([^)]*\.ico[^)]*\)/g, 'Circle(radius=0.5)');
  
  // Fix undefined variables and objects
  cleanCode = cleanCode.replace(/\bSymbol\b/g, 'MathTex');
  cleanCode = cleanCode.replace(/\bImageMobject\b/g, 'Circle');
  cleanCode = cleanCode.replace(/\bSVGMobject\b/g, 'Circle');
  
  // Fix empty constructors
  cleanCode = cleanCode.replace(/Circle\(\s*\)/g, 'Circle(radius=0.5)');
  cleanCode = cleanCode.replace(/Square\(\s*\)/g, 'Square(side_length=1)');
  cleanCode = cleanCode.replace(/Rectangle\(\s*\)/g, 'Rectangle(width=2, height=1)');
  cleanCode = cleanCode.replace(/Triangle\(\s*\)/g, 'Triangle()');
  cleanCode = cleanCode.replace(/Dot\(\s*\)/g, 'Dot(point=ORIGIN)');
  cleanCode = cleanCode.replace(/Line\(\s*\)/g, 'Line(start=LEFT, end=RIGHT)');
  cleanCode = cleanCode.replace(/Arrow\(\s*\)/g, 'Arrow(start=LEFT, end=RIGHT)');
  cleanCode = cleanCode.replace(/Text\(\s*\)/g, 'Text("")');
  cleanCode = cleanCode.replace(/MathTex\(\s*\)/g, 'MathTex("x")');
  
  // Fix undefined animations
  cleanCode = cleanCode.replace(/FadeIn\(\s*\)/g, 'FadeIn(Circle(radius=0.5))');
  cleanCode = cleanCode.replace(/FadeOut\(\s*\)/g, 'FadeOut(Circle(radius=0.5))');
  cleanCode = cleanCode.replace(/Create\(\s*\)/g, 'Create(Circle(radius=0.5))');
  cleanCode = cleanCode.replace(/Write\(\s*\)/g, 'Write(Text(""))');
  cleanCode = cleanCode.replace(/Transform\(\s*\)/g, 'Transform(Circle(radius=0.5), Circle(radius=0.5))');
  
  // Fix complex MathTex expressions
  cleanCode = cleanCode.replace(/MathTex\([^)]*\\[a-zA-Z]+[^)]*\)/g, 'MathTex("x")');
  cleanCode = cleanCode.replace(/MathTex\([^)]*\\text{[^}]*}[^)]*\)/g, 'MathTex("x")');
  
  // Fix undefined variables
  cleanCode = cleanCode.replace(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*([^=]+)\s*\n\s*self\.play\([^)]*\1[^)]*\)/g, 'circle = Circle(radius=0.5)\n        self.play(Create(circle))');
  
  // Fix malformed function calls
  cleanCode = cleanCode.replace(/(\w+)\s*=\s*([^,)]+)\s*(\w+)\s*=\s*([^,)]+)\s*\)/g, '$1=$2, $3=$4)');
  cleanCode = cleanCode.replace(/(\w+)\s*=\s*\{([^}]*)\}\s*(\w+)\s*=\s*([^,)]+)\s*\)/g, '$1={"$2"}, $3=$4)');
  
  // Fix missing commas in function calls
  cleanCode = cleanCode.replace(/(\w+)\s*=\s*([^,]+)\s*(\w+)\s*=\s*([^,)]+)/g, '$1=$2, $3=$4');
  
  // Fix trailing commas
  cleanCode = cleanCode.replace(/,\s*\)/g, ')');
  
  // Fix empty parentheses
  cleanCode = cleanCode.replace(/\(\s*\)/g, '()');
  
  // Fix undefined imports
  if (!cleanCode.includes('from manim import')) {
    cleanCode = 'from manim import *\n' + cleanCode;
  }
  
  // Remove any problematic import lines
  cleanCode = cleanCode.split('\n').filter(line => {
    const trimmed = line.trim();
    if (trimmed.startsWith('from sympy import') && trimmed.includes('MathTex')) {
      return false;
    }
    if (trimmed.startsWith('import ') && !trimmed.includes('numpy')) {
      return false;
    }
    return true;
  }).join('\n');
  
  // Additional safety: if the code still has syntax issues, use a fallback
  if (cleanCode.includes(',') && cleanCode.includes('=') && !cleanCode.includes('(')) {
    // This might be a malformed assignment, replace with safe code
    cleanCode = `from manim import *

class Animation(Scene):
    def construct(self):
        # Title
        title = Text("Educational Content")
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))
        
        # Main content
        circle = Circle(radius=0.5)
        self.play(Create(circle))
        self.wait(1)
        
        # End
        self.wait(1)`
  }
  
  // Second pass: Send to OpenAI for syntax fixing
  try {
    console.log(` Sending segment ${segmentIndex} code to OpenAI for syntax fixing...`)
    const fixResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{
          role: 'system',
          content: 'You are a Python syntax expert. Fix all syntax errors in Manim code. Remove external file references. Use only basic geometric shapes. Ensure proper parentheses matching.'
        }, {
          role: 'user',
          content: `Fix all syntax errors in this Manim code:

CRITICAL REQUIREMENTS:
- Output ONLY the fixed Python code
- NO markdown formatting
- NO explanatory text
- Fix all syntax errors including unmatched parentheses
- Remove all external file references
- Use only Circle(radius=0.5), Square(side_length=1), etc.
- Ensure proper commas between parameters
- Fix all empty function calls
- Fix parameter name errors
- Fix variable name errors
- Fix all parentheses matching issues

Here's the code to fix:

${cleanCode}`
        }],
        temperature: 0.1,
        max_tokens: 2000
      })
    })
    
    if (fixResponse.ok) {
      const responseText = await fixResponse.text()
      console.log(`📨 Raw OpenAI response length: ${responseText.length} characters`)
      
      try {
        const fixData = JSON.parse(responseText)
        if (fixData.choices && fixData.choices[0] && fixData.choices[0].message) {
          const fixedCode = fixData.choices[0].message.content.trim()
          console.log(`✅ Fixed code length: ${fixedCode.length} characters`)
          
          // Remove markdown if present
          let finalCode = fixedCode
          if (finalCode.startsWith('```python')) {
            finalCode = finalCode.replace(/^```python\n?/, '')
          }
          if (finalCode.startsWith('```')) {
            finalCode = finalCode.replace(/^```\n?/, '')
          }
          if (finalCode.endsWith('```')) {
            finalCode = finalCode.replace(/\n?```$/, '')
          }
          
          // Ensure basic structure
          if (!finalCode.includes('from manim import')) {
            finalCode = 'from manim import *\n' + finalCode
          }
          if (!finalCode.includes('class') && !finalCode.includes('def construct')) {
            finalCode = `from manim import *

class Animation(Scene):
    def construct(self):
        # Title
        title = Text("Educational Video")
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))
        
        # Main content
        circle = Circle(radius=0.5)
        self.play(Create(circle))
        self.wait(1)
        
        # End
        self.wait(1)`
          }
          
          cleanCode = finalCode
          console.log(`✅ Segment ${segmentIndex} code fixed by OpenAI`)
        } else {
          console.log(`⚠️ Invalid OpenAI response structure for segment ${segmentIndex}:`, fixData)
        }
      } catch (parseError) {
        console.log(`⚠️ Failed to parse OpenAI response for segment ${segmentIndex}: ${parseError.message}`)
        console.log(`📄 Response preview: ${responseText.substring(0, 200)}...`)
      }
    } else {
      console.log(`⚠️ OpenAI API error for segment ${segmentIndex}: ${fixResponse.status} ${fixResponse.statusText}`)
      const errorText = await fixResponse.text()
      console.log(` Error response: ${errorText}`)
    }
  } catch (error) {
    console.log(`⚠️ OpenAI syntax fixing failed for segment ${segmentIndex}, using original code: ${error.message}`)
  }
  
  const manimFile = join(segmentDir, `segment_${segmentIndex}.py`)
  await writeFile(manimFile, cleanCode)
  
  // Render with Manim
  return new Promise((resolve, reject) => {
    console.log(`🎬 Rendering segment ${segmentIndex} with Manim...`)
    
    const manim = spawn('manim', [
      '-pql', // Preview, quality low
      manimFile,
      'Scene'
    ])
    
    let stdout = ''
    let stderr = ''
    
    manim.stdout.on('data', (data) => {
      const output = data.toString()
      stdout += output
      console.log(`📤 Manim stdout (segment ${segmentIndex}): ${output.trim()}`)
    })
    
    manim.stderr.on('data', (data) => {
      const output = data.toString()
      stderr += output
      console.log(`⚠️ Manim stderr (segment ${segmentIndex}): ${output.trim()}`)
    })
    
    manim.on('close', async (code) => {
      console.log(`🏁 Manim process for segment ${segmentIndex} exited with code ${code}`)
      
      if (code === 0) {
        // Manim creates videos in the global media directory, not session-specific
        const globalMediaDir = join(process.cwd(), 'media', 'videos')
        
        try {
          await access(globalMediaDir)
          console.log(`✅ Global media directory exists`)
          
          // Find the generated video file in the global media directory
          const { readdir } = require('fs/promises')
          const files = await readdir(globalMediaDir, { recursive: true })
          const videoFile = files.find(file => 
            typeof file === 'string' && 
            file.endsWith('.mp4') && 
            file.includes(`segment_${segmentIndex}`)
          )
          
          if (videoFile) {
            console.log(`✅ Found video file for segment ${segmentIndex}: ${videoFile}`)
            const videoPath = join(globalMediaDir, videoFile)
            
            // Copy the video to our session directory for organization
            const sessionVideoPath = join(segmentDir, `segment_${segmentIndex}.mp4`)
            const { copyFile } = await import('fs/promises')
            await copyFile(videoPath, sessionVideoPath)
            
            resolve({
              videoPath: sessionVideoPath,
              sessionId
            })
          } else {
            console.log(`❌ No video file found for segment ${segmentIndex} in global media directory`)
            reject(new Error(`No video file generated for segment ${segmentIndex}`))
          }
        } catch (error) {
          console.log(`❌ Error accessing global media directory: ${error.message}`)
          reject(new Error(`Error accessing media directory for segment ${segmentIndex}: ${error.message}`))
        }
      } else {
        console.log(`❌ Manim failed for segment ${segmentIndex} with code ${code}`)
        console.log(` Manim stderr: ${stderr}`)
        reject(new Error(`Manim failed for segment ${segmentIndex}: ${stderr}`))
      }
    })
    
    manim.on('error', (error) => {
      console.log(`❌ Manim process error for segment ${segmentIndex}: ${error.message}`)
      reject(new Error(`Manim process error for segment ${segmentIndex}: ${error.message}`))
    })
  })
}

async function combineSegment(audioData, videoData, segmentIndex) {
  const { spawn } = await import('child_process')
  const { join } = await import('path')
  const { mkdir } = await import('fs/promises')
  
  const sessionId = generateSessionId()
  const outputDir = join(process.cwd(), 'segmented-sessions', sessionId, 'combined')
  await mkdir(outputDir, { recursive: true })
  
  const outputPath = join(outputDir, `segment_${segmentIndex}_combined.mp4`)
  
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn('ffmpeg', [
      '-i', videoData.videoPath,
      '-i', audioData.path,
      '-c:v', 'copy',
      '-c:a', 'aac',
      '-b:a', '192k',
      '-shortest',
      '-y',
      outputPath
    ])
    
    ffmpeg.on('close', (code) => {
      if (code === 0) {
        resolve({
          combinedPath: outputPath,
          sessionId
        })
      } else {
        reject(new Error(`FFmpeg failed with code ${code}`))
      }
    })
    
    ffmpeg.on('error', reject)
  })
}

async function concatenateSegments(segmentResults) {
  const { spawn } = await import('child_process')
  const { join } = await import('path')
  const { writeFile, mkdir } = await import('fs/promises')
  
  const sessionId = generateSessionId()
  const outputDir = join(process.cwd(), 'segmented-sessions', sessionId, 'final')
  await mkdir(outputDir, { recursive: true })
  
  // Create a file list for FFmpeg concatenation
  const fileList = segmentResults.map((segment, index) => 
    `file '${segment.combinedSegment.combinedPath}'`
  ).join('\n')
  
  const fileListPath = join(outputDir, 'filelist.txt')
  await writeFile(fileListPath, fileList)
  
  const finalVideoPath = join(outputDir, 'final_video.mp4')
  
  return new Promise((resolve, reject) => {
    const ffmpeg = spawn('ffmpeg', [
      '-f', 'concat',
      '-safe', '0',
      '-i', fileListPath,
      '-c', 'copy',
      '-y',
      finalVideoPath
    ])
    
    ffmpeg.on('close', (code) => {
      if (code === 0) {
        resolve({
          videoUrl: `/api/segmented-video/${sessionId}`,
          duration: segmentResults.reduce((total, segment) => total + segment.audioData.duration, 0),
          sessionId,
          segments: segmentResults.length
        })
      } else {
        reject(new Error(`FFmpeg concatenation failed with code ${code}`))
      }
    })
    
    ffmpeg.on('error', reject)
  })
}

function cleanScriptForTTS(script) {
  // Remove metadata sections and clean up the script for voice over
  let cleaned = script
  
  // Remove Key Concepts section
  cleaned = cleaned.replace(/\* \*\*Key Concepts:\*\*[\s\S]*?(?=\* \*\*|$)/g, '')
  
  // Remove Animation Ideas section
  cleaned = cleaned.replace(/\* \*\*Animation Ideas:\*\*[\s\S]*?(?=\* \*\*|$)/g, '')
  
  // Remove bullet points and clean up formatting
  cleaned = cleaned.replace(/\* /g, '')
  cleaned = cleaned.replace(/\*\*/g, '')
  
  // Remove extra whitespace and normalize
  cleaned = cleaned.replace(/\n\s*\n/g, '\n')
  cleaned = cleaned.trim()
  
  // Limit length to prevent TTS issues
  if (cleaned.length > 1000) {
    cleaned = cleaned.substring(0, 1000) + '...'
  }
  
  return cleaned
}

function generateSessionId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
} 

function cleanManimCode(code) {
  // Remove markdown code block formatting
  code = code.replace(/```python\s*/g, '')
  code = code.replace(/```\s*$/g, '')
  
  // Remove any leading/trailing whitespace
  code = code.trim()
  
  // Ensure proper imports
  if (!code.includes('from manim import')) {
    code = 'from manim import *\n\n' + code
  }
  
  // Fix common syntax issues
  code = code.replace(/,\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*([a-zA-Z_][a-zA-Z0-9_]*)/g, (match, var1, var2) => {
    return `${var1} = ${var2}`
  })
  
  // Ensure proper class definition
  if (!code.includes('class') && !code.includes('def construct')) {
    code = `class EducationalScene(Scene):
    def construct(self):
        ${code}`
  }
  
  return code
} 
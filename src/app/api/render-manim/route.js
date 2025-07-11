import { writeFile, mkdir, readdir, rm } from 'fs/promises'
import { join } from 'path'
import { spawn } from 'child_process'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request) {
  console.log('🎬 Starting Manim rendering...')
  
  try {
    const { manimCode } = await request.json()
    
    if (!manimCode) {
      console.log('❌ No Manim code provided')
      return Response.json({ error: 'No Manim code provided' }, { status: 400 })
    }

    console.log(`📝 Processing Manim code (${manimCode.length} characters)...`)
    
    // Clean up old sessions first
    console.log(`🧹 Cleaning up old manim sessions...`)
    await cleanupOldSessions()
    
    // Create unique session ID
    const sessionId = uuidv4()
    console.log(`🆔 Session ID: ${sessionId}`)
    
    // Create directories
    const projectDir = join(process.cwd(), 'manim-sessions', sessionId)
    const mediaDir = join(projectDir, 'media')
    
    console.log(`📁 Creating project directory: ${projectDir}`)
    await mkdir(projectDir, { recursive: true })
    await mkdir(mediaDir, { recursive: true })
    
    // Save Manim code to file (clean markdown formatting and trim whitespace)
    const pythonFile = join(projectDir, 'animation.py')
    console.log(`💾 Saving Manim code to: ${pythonFile}`)
    
    // Simple code cleaning - just remove markdown and ensure basic structure
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
    cleanCode = cleanCode.replace(/Dot\(\s*\)/g, 'Dot(ORIGIN)');
    cleanCode = cleanCode.replace(/Line\(\s*\)/g, 'Line(ORIGIN, UP)');
    cleanCode = cleanCode.replace(/Arrow\(\s*\)/g, 'Arrow(ORIGIN, UP)');
    cleanCode = cleanCode.replace(/Text\(\s*\)/g, 'Text("")');
    cleanCode = cleanCode.replace(/MathTex\(\s*\)/g, 'MathTex("x")');
    cleanCode = cleanCode.replace(/VGroup\(\s*\)/g, 'VGroup(Circle(radius=0.5))');
    cleanCode = cleanCode.replace(/Group\(\s*\)/g, 'VGroup(Circle(radius=0.5))');
    cleanCode = cleanCode.replace(/Axes\(\s*\)/g, 'Axes(x_range=[-3, 3], y_range=[-3, 3])');
    cleanCode = cleanCode.replace(/NumberPlane\(\s*\)/g, 'NumberPlane(x_range=[-3, 3], y_range=[-3, 3])');
    cleanCode = cleanCode.replace(/ParametricFunction\(\s*\)/g, 'ParametricFunction(lambda t: [t, t**2, 0], t_range=[-2, 2])');
    cleanCode = cleanCode.replace(/VDict\(\s*\)/g, 'VDict({"key": Circle(radius=0.5)})');
    cleanCode = cleanCode.replace(/MathTable\(\s*\)/g, 'MathTable([["0", "1"], ["1", "2"]])');
    cleanCode = cleanCode.replace(/Table\(\s*\)/g, 'Table([["A", "B"], ["1", "2"]])');
    
    // Fix undefined colors
    cleanCode = cleanCode.replace(/\.set_color\([^)]*\)/g, '.set_color(WHITE)');
    cleanCode = cleanCode.replace(/\.set_color\(\s*\)/g, '.set_color(WHITE)');
    
    // Fix undefined directions
    cleanCode = cleanCode.replace(/\.to_edge\(\s*\)/g, '.to_edge(UP)');
    cleanCode = cleanCode.replace(/\.move_to\(\s*\)/g, '.move_to(ORIGIN)');
    cleanCode = cleanCode.replace(/\.shift\(\s*\)/g, '.shift(UP)');
    
    // Fix undefined scales
    cleanCode = cleanCode.replace(/\.scale\(\s*\)/g, '.scale(1)');
    
    // Fix undefined waits
    cleanCode = cleanCode.replace(/self\.wait\(\s*\)/g, 'self.wait(1)');
    
    // Fix undefined adds
    cleanCode = cleanCode.replace(/self\.add\(\s*\)/g, 'self.wait(1)');
    
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
    
    console.log(`📝 Cleaned code length: ${cleanCode.length} characters`)
    
    // Second pass: Send to OpenAI for syntax fixing
    try {
      console.log(`🔧 Sending code to OpenAI for syntax fixing...`)
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
            content: 'You are a Python syntax expert. Fix all syntax errors in Manim code. Remove external file references. Use only basic geometric shapes.'
          }, {
            role: 'user',
            content: `Fix the Python syntax errors in this Manim code. Remove any ImageMobject, SVGMobject, or external file references. Ensure all parentheses, brackets, and braces are properly matched. Use only basic Manim objects: Circle, Square, Rectangle, Triangle, Text, MathTex.

CRITICAL REQUIREMENTS:
- Output ONLY the fixed Python code
- NO markdown formatting
- NO explanatory text
- Fix all syntax errors
- Remove all external file references
- Use only Circle(radius=0.5), Square(side_length=1), etc.
- Ensure proper commas between parameters
- Fix all empty function calls
- Fix parameter name errors (x_rang → x_range, axis_confi → axis_config)
- Fix variable name errors (point_, a= → point_a=)
- Fix Dot parameter errors (point_a= → point=)
- Fix get_graph color errors (get_graph(..., color=BLUE) → get_graph(...).set_color(BLUE))
- Fix animation positioning errors (Create(object).to_edge() → object.to_edge(); Create(object))
- Fix all parameter name mistakes

COMMON MANIM ERRORS TO FIX:
- get_graph(lambda x: x**2, color=BLUE) → get_graph(lambda x: x**2).set_color(BLUE)
- Dot(point_a=...) → Dot(point=...)
- Axes(x_rang=...) → Axes(x_range=...)
- Circle(color=RED) → Circle().set_color(RED) (if color parameter fails)
- Create(circle).to_edge(DOWN) → circle.to_edge(DOWN); Create(circle)
- Create(square).move_to(ORIGIN) → square.move_to(ORIGIN); Create(square)
- Write(text).to_edge(UP) → text.to_edge(UP); Write(text)

CORRECT ANIMATION PATTERN:
# WRONG:
self.play(Create(circle).to_edge(DOWN))

# CORRECT:
circle = Circle(radius=0.5)
circle.to_edge(DOWN)
self.play(Create(circle))

# WRONG:
self.play(Write(text).move_to(ORIGIN))

# CORRECT:
text = Text("Hello")
text.move_to(ORIGIN)
self.play(Write(text))

Here's the code to fix:

${cleanCode}`
          }],
          temperature: 0.1,
          max_tokens: 4000
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
            console.log(`✅ Code fixed by OpenAI`)
          } else {
            console.log(`⚠️ Invalid OpenAI response structure:`, fixData)
          }
        } catch (parseError) {
          console.log(`⚠️ Failed to parse OpenAI response: ${parseError.message}`)
          console.log(`📄 Response preview: ${responseText.substring(0, 200)}...`)
        }
      } else {
        console.log(`⚠️ OpenAI API error: ${fixResponse.status} ${fixResponse.statusText}`)
        const errorText = await fixResponse.text()
        console.log(`📄 Error response: ${errorText}`)
      }
    } catch (error) {
      console.log(`⚠️ OpenAI syntax fixing failed, using original code: ${error.message}`)
    }
    
    await writeFile(pythonFile, cleanCode)
    
    // Run Manim rendering
    console.log(`🚀 Starting Manim rendering process...`)
    const renderResult = await runManim(pythonFile, projectDir)
    
    if (renderResult.success) {
      console.log(`✅ Manim rendering completed successfully`)
      console.log(`📹 Video file: ${renderResult.videoPath}`)
      
      return Response.json({ 
        success: true, 
        videoPath: renderResult.videoPath,
        sessionId: sessionId
      })
    } else {
      console.log(`❌ Manim rendering failed: ${renderResult.error}`)
      return Response.json({ error: renderResult.error }, { status: 500 })
    }

  } catch (error) {
    console.error('💥 Manim rendering error:', error)
    return Response.json({ error: 'Manim rendering failed' }, { status: 500 })
  }
}

async function runManim(pythonFile, projectDir) {
  return new Promise((resolve) => {
    console.log(`🐍 Running Manim with Python...`)
    
    // Check if virtual environment exists and use it
    const venvPath = join(process.cwd(), 'venv')
    const pythonPath = join(venvPath, 'bin', 'python')
    const pythonExecutable = process.platform === 'win32' ? 
      join(venvPath, 'Scripts', 'python.exe') : 
      pythonPath
    
    console.log(`🔍 Using Python: ${pythonExecutable}`)
    
    // Run manim command
    const manimProcess = spawn(pythonExecutable, [
      '-m', 'manim',
      '-pql',  // Preview, quality low, last scene
      pythonFile
    ], {
      cwd: projectDir,
      stdio: ['pipe', 'pipe', 'pipe']
    })
    
    let stdout = ''
    let stderr = ''
    
    manimProcess.stdout.on('data', (data) => {
      const output = data.toString()
      stdout += output
      console.log(`📤 Manim output: ${output.trim()}`)
    })
    
    manimProcess.stderr.on('data', (data) => {
      const output = data.toString()
      stderr += output
      console.log(`⚠️ Manim stderr: ${output.trim()}`)
    })
    
    manimProcess.on('close', async (code) => {
      console.log(`🏁 Manim process exited with code: ${code}`)
      
      if (code === 0) {
        // Look for the generated video file
        try {
          const mediaDir = join(projectDir, 'media')
          const files = await readdir(mediaDir, { recursive: true })
          
          // Find the MP4 file
          const videoFile = files.find(file => 
            typeof file === 'string' && file.endsWith('.mp4')
          )
          
          if (videoFile) {
            const videoPath = join(mediaDir, videoFile)
            console.log(`🎥 Found video file: ${videoPath}`)
            resolve({ success: true, videoPath })
          } else {
            console.log(`❌ No video file found in media directory`)
            resolve({ success: false, error: 'No video file generated' })
          }
        } catch (error) {
          console.error(`💥 Error finding video file: ${error}`)
          resolve({ success: false, error: 'Error finding generated video' })
        }
      } else {
        console.log(`❌ Manim process failed with code: ${code}`)
        console.log(`📄 Full stdout: ${stdout}`)
        console.log(`📄 Full stderr: ${stderr}`)
        resolve({ success: false, error: `Manim failed with code ${code}: ${stderr}` })
      }
    })
    
    manimProcess.on('error', (error) => {
      console.error(`💥 Manim process error: ${error}`)
      resolve({ success: false, error: `Process error: ${error.message}` })
    })
  })
}

async function cleanupOldSessions() {
  try {
    const sessionsDir = join(process.cwd(), 'manim-sessions')
    
    // Check if sessions directory exists
    try {
      await readdir(sessionsDir)
    } catch (error) {
      // Directory doesn't exist, nothing to clean
      console.log(`📁 No existing sessions directory found`)
      return
    }
    
    // Get all session directories
    const sessions = await readdir(sessionsDir)
    console.log(`📁 Found ${sessions.length} existing sessions`)
    
    if (sessions.length === 0) {
      console.log(`✨ No old sessions to clean up`)
      return
    }
    
    // Keep only the 3 most recent sessions (in case of concurrent processing)
    const sessionsToKeep = 3
    const sessionsToDelete = sessions.slice(0, Math.max(0, sessions.length - sessionsToKeep))
    
    if (sessionsToDelete.length === 0) {
      console.log(`✨ No old sessions to clean up (keeping ${sessions.length} recent sessions)`)
      return
    }
    
    console.log(`🗑️ Deleting ${sessionsToDelete.length} old sessions...`)
    
    // Delete old session directories
    for (const session of sessionsToDelete) {
      const sessionPath = join(sessionsDir, session)
      try {
        await rm(sessionPath, { recursive: true, force: true })
        console.log(`🗑️ Deleted session: ${session}`)
      } catch (error) {
        console.log(`⚠️ Failed to delete session ${session}: ${error.message}`)
      }
    }
    
    console.log(`✅ Cleanup completed. Kept ${sessions.length - sessionsToDelete.length} recent sessions`)
    
  } catch (error) {
    console.error(`💥 Error during cleanup: ${error}`)
    // Don't fail the entire process if cleanup fails
  }
} 
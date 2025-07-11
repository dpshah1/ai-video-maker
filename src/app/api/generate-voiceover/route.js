export async function POST(request) {
  console.log('🎤 Starting voice over generation...')
  
  try {
    const { videoScript, voiceSettings = {} } = await request.json()
    
    if (!videoScript) {
      console.log('❌ No video script provided')
      return Response.json({ error: 'No video script provided' }, { status: 400 })
    }

    console.log(`📝 Processing video script (${videoScript.length} characters)...`)
    
    const voiceOverData = await generateVoiceOver(videoScript, voiceSettings)
    
    console.log(`✅ Generated voice over (${voiceOverData.audioUrl ? 'success' : 'failed'})`)
    
    return Response.json({ 
      success: true, 
      audioUrl: voiceOverData.audioUrl,
      duration: voiceOverData.duration,
      wordCount: voiceOverData.wordCount
    })

  } catch (error) {
    console.error('💥 Voice over generation error:', error)
    return Response.json({ error: 'Voice over generation failed' }, { status: 500 })
  }
}

async function generateVoiceOver(videoScript, voiceSettings = {}) {
  try {
    console.log(`🔑 Checking OpenAI API key...`)
    if (!process.env.OPENAI_API_KEY) {
      throw new Error('OPENAI_API_KEY environment variable is not set')
    }
    
    // Test the API key with a simple request
    console.log(`🔑 Testing OpenAI API key...`)
    const testResponse = await fetch('https://api.openai.com/v1/models', {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      }
    })
    
    if (!testResponse.ok) {
      throw new Error(`OpenAI API key test failed: ${testResponse.status} ${testResponse.statusText}`)
    }
    
    console.log(`✅ OpenAI API key is valid`)
    
    console.log(`🤖 Sending request to OpenAI TTS API...`)
    
    // Clean and prepare the script for TTS
    let cleanedScript = cleanScriptForTTS(videoScript)
    
    // If script is still too long, create a summary
    if (cleanedScript.length > 3000) {
      console.log(`📝 Script too long (${cleanedScript.length} chars), creating summary...`)
      cleanedScript = createSummaryForTTS(cleanedScript)
    }
    
    console.log(`📝 Cleaned script length: ${cleanedScript.length} characters`)
    console.log(`📝 First 200 characters: ${cleanedScript.substring(0, 200)}...`)
    
    const requestBody = {
      model: 'tts-1',
      input: cleanedScript,
      voice: voiceSettings.voice || 'alloy', // alloy, echo, fable, onyx, nova, shimmer
      response_format: 'mp3',
      speed: voiceSettings.speed || 1.0 // 0.25 to 4.0
    }
    
    console.log(`🔧 Request body:`, JSON.stringify(requestBody, null, 2))
    
    const response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify(requestBody)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`❌ OpenAI TTS API error response:`, errorText)
      throw new Error(`OpenAI TTS API error: ${response.status} ${response.statusText} - ${errorText}`)
    }

    // Get the audio buffer
    const audioBuffer = await response.arrayBuffer()
    
    // Generate a unique filename
    const sessionId = generateSessionId()
    const audioFileName = `voiceover_${sessionId}.mp3`
    
    // Save the audio file
    const { writeFile, mkdir } = await import('fs/promises')
    const { join } = await import('path')
    
    const audioDir = join(process.cwd(), 'voiceover-sessions', sessionId)
    await mkdir(audioDir, { recursive: true })
    
    const audioPath = join(audioDir, audioFileName)
    await writeFile(audioPath, Buffer.from(audioBuffer))
    
    console.log(`💾 Saved voice over to: ${audioPath}`)
    
    // Calculate approximate duration and word count
    const wordCount = cleanedScript.split(' ').length
    const estimatedDuration = wordCount * 0.4 // Rough estimate: 0.4 seconds per word
    
    return {
      audioUrl: `/api/voiceover/${sessionId}`,
      duration: estimatedDuration,
      wordCount: wordCount,
      sessionId: sessionId
    }

  } catch (error) {
    console.error('💥 OpenAI TTS API error:', error)
    
    // Try fallback with a simple message
    console.log(`🔄 Trying fallback voice over...`)
    try {
      const fallbackScript = "This is an educational video about the uploaded content. The video contains important information and visual demonstrations to help you understand the concepts."
      
      const fallbackResponse = await fetch('https://api.openai.com/v1/audio/speech', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'tts-1',
          input: fallbackScript,
          voice: voiceSettings.voice || 'alloy',
          response_format: 'mp3',
          speed: voiceSettings.speed || 1.0
        })
      })

      if (fallbackResponse.ok) {
        const fallbackBuffer = await fallbackResponse.arrayBuffer()
        const sessionId = generateSessionId()
        const audioFileName = `voiceover_${sessionId}.mp3`
        
        const { writeFile, mkdir } = await import('fs/promises')
        const { join } = await import('path')
        
        const audioDir = join(process.cwd(), 'voiceover-sessions', sessionId)
        await mkdir(audioDir, { recursive: true })
        
        const audioPath = join(audioDir, audioFileName)
        await writeFile(audioPath, Buffer.from(fallbackBuffer))
        
        console.log(`💾 Saved fallback voice over to: ${audioPath}`)
        
        return {
          audioUrl: `/api/voiceover/${sessionId}`,
          duration: 5.0, // Approximate duration for fallback
          wordCount: fallbackScript.split(' ').length,
          sessionId: sessionId
        }
      }
    } catch (fallbackError) {
      console.error('💥 Fallback voice over also failed:', fallbackError)
    }
    
    throw error
  }
}

function cleanScriptForTTS(script) {
  // Remove markdown formatting and clean up the script for TTS
  let cleaned = script
    .replace(/```python[\s\S]*?```/g, '') // Remove code blocks
    .replace(/```[\s\S]*?```/g, '') // Remove any remaining code blocks
    .replace(/`/g, '') // Remove backticks
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold formatting
    .replace(/\*(.*?)\*/g, '$1') // Remove italic formatting
    .replace(/#{1,6}\s/g, '') // Remove headers
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove markdown links
    .replace(/\n{3,}/g, '\n\n') // Reduce multiple newlines
    .replace(/\s+/g, ' ') // Normalize whitespace
    .replace(/[^\w\s.,!?;:()\-'"]/g, '') // Remove special characters that might cause issues
    .trim()
  
  // Remove generic phrases that don't add value
  cleaned = cleaned
    .replace(/This is the plan for a 3blue1brown video/gi, '')
    .replace(/This is an educational video about/gi, '')
    .replace(/Let me explain/gi, '')
    .replace(/In this video/gi, '')
    .replace(/Today we will/gi, '')
    .replace(/We will explore/gi, '')
    .trim()
  
  // Limit to OpenAI TTS character limit (4096 characters)
  if (cleaned.length > 4000) {
    cleaned = cleaned.substring(0, 4000) + '...'
  }
  
  // Ensure we have some content
  if (cleaned.length < 10) {
    cleaned = 'This educational content covers important concepts and principles.'
  }
  
  return cleaned
}

function createSummaryForTTS(script) {
  // Create a concise summary suitable for TTS
  const sentences = script.split(/[.!?]+/).filter(s => s.trim().length > 10)
  
  if (sentences.length <= 3) {
    return script.substring(0, 2500) + '...'
  }
  
  // Take first few sentences and last few sentences
  const firstSentences = sentences.slice(0, 2).join('. ')
  const lastSentences = sentences.slice(-2).join('. ')
  
  const summary = `${firstSentences}. This educational content covers important concepts and principles. ${lastSentences}.`
  
  return summary.length > 2500 ? summary.substring(0, 2500) + '...' : summary
}

function generateSessionId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
} 
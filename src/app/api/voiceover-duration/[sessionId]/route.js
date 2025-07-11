import { spawn } from 'child_process'
import { join } from 'path'
import { existsSync } from 'fs'

export async function GET(request, { params }) {
  const { sessionId } = params
  
  try {
    console.log(`⏱️ Getting voice over duration for session: ${sessionId}`)
    
    // Construct the path to the voice over file
    const projectDir = join(process.cwd(), 'voiceover-sessions', sessionId)
    
    // Look for the MP3 file in the session directory
    const { readdir } = await import('fs/promises')
    const files = await readdir(projectDir, { recursive: true })
    
    const audioFile = files.find(file => 
      typeof file === 'string' && file.endsWith('.mp3')
    )
    
    if (!audioFile) {
      console.log(`❌ No audio file found for session: ${sessionId}`)
      return Response.json({ error: 'Voice over not found' }, { status: 404 })
    }
    
    const audioPath = join(projectDir, audioFile)
    
    if (!existsSync(audioPath)) {
      console.log(`❌ Audio file does not exist: ${audioPath}`)
      return Response.json({ error: 'Audio file not found' }, { status: 404 })
    }
    
    console.log(`🎵 Getting duration for: ${audioPath}`)
    
    // Get duration using ffprobe
    const duration = await getAudioDuration(audioPath)
    
    console.log(`⏱️ Voice over duration: ${duration}s`)
    
    return Response.json({ 
      success: true, 
      duration: duration,
      sessionId: sessionId
    })
    
  } catch (error) {
    console.error(`💥 Error getting voice over duration for session ${sessionId}:`, error)
    return Response.json({ error: 'Failed to get voice over duration' }, { status: 500 })
  }
}

async function getAudioDuration(audioPath) {
  return new Promise((resolve, reject) => {
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
        resolve(0) // Default duration if ffprobe fails
      }
    })
    
    ffprobe.on('error', () => {
      resolve(0) // Default duration if ffprobe fails
    })
  })
} 
import { readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function GET(request, { params }) {
  const { sessionId } = params
  
  try {
    console.log(`🎤 Serving voice over for session: ${sessionId}`)
    
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
    
    console.log(`🎵 Serving audio file: ${audioPath}`)
    
    // Read the audio file
    const audioBuffer = await readFile(audioPath)
    
    // Return the audio with proper headers
    return new Response(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.length.toString(),
        'Cache-Control': 'public, max-age=3600'
      }
    })
    
  } catch (error) {
    console.error(`💥 Error serving voice over for session ${sessionId}:`, error)
    return Response.json({ error: 'Failed to serve voice over' }, { status: 500 })
  }
} 
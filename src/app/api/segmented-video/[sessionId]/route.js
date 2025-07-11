import { readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function GET(request, { params }) {
  const { sessionId } = params
  
  try {
    console.log(`🎬 Serving segmented video for session: ${sessionId}`)
    
    // Construct the path to the final video file
    const projectDir = join(process.cwd(), 'segmented-sessions', sessionId, 'final')
    
    // Look for the MP4 file in the final directory
    const { readdir } = await import('fs/promises')
    const files = await readdir(projectDir, { recursive: true })
    
    const videoFile = files.find(file => 
      typeof file === 'string' && file.endsWith('.mp4')
    )
    
    if (!videoFile) {
      console.log(`❌ No segmented video file found for session: ${sessionId}`)
      return Response.json({ error: 'Segmented video not found' }, { status: 404 })
    }
    
    const videoPath = join(projectDir, videoFile)
    
    if (!existsSync(videoPath)) {
      console.log(`❌ Segmented video file does not exist: ${videoPath}`)
      return Response.json({ error: 'Segmented video file not found' }, { status: 404 })
    }
    
    console.log(`📹 Serving segmented video file: ${videoPath}`)
    
    // Read the video file
    const videoBuffer = await readFile(videoPath)
    
    // Return the video with proper headers
    return new Response(videoBuffer, {
      headers: {
        'Content-Type': 'video/mp4',
        'Content-Length': videoBuffer.length.toString(),
        'Cache-Control': 'public, max-age=3600'
      }
    })
    
  } catch (error) {
    console.error(`💥 Error serving segmented video for session ${sessionId}:`, error)
    return Response.json({ error: 'Failed to serve segmented video' }, { status: 500 })
  }
} 
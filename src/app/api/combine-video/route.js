import { spawn } from 'child_process'
import { join } from 'path'
import { existsSync } from 'fs'
import { writeFile, mkdir } from 'fs/promises'

export async function POST(request) {
  console.log('🎬 Starting video and audio combination...')
  
  try {
    const { videoSessionId, audioSessionId, outputSettings = {} } = await request.json()
    
    if (!videoSessionId || !audioSessionId) {
      console.log('❌ Missing video or audio session ID')
      return Response.json({ error: 'Missing video or audio session ID' }, { status: 400 })
    }

    // Check if FFmpeg is available
    const ffmpegAvailable = await checkFFmpeg()
    if (!ffmpegAvailable) {
      console.log('❌ FFmpeg is not available')
      return Response.json({ error: 'FFmpeg is not installed. Please run ./setup-ffmpeg.sh' }, { status: 500 })
    }

    console.log(`📹 Combining video (${videoSessionId}) with audio (${audioSessionId})...`)
    
    const combinedVideoData = await combineVideoAndAudio(videoSessionId, audioSessionId, outputSettings)
    
    console.log(`✅ Combined video created successfully`)
    
    return Response.json({ 
      success: true, 
      videoUrl: combinedVideoData.videoUrl,
      duration: combinedVideoData.duration,
      sessionId: combinedVideoData.sessionId
    })

  } catch (error) {
    console.error('💥 Video combination error:', error)
    return Response.json({ error: 'Video combination failed' }, { status: 500 })
  }
}

async function combineVideoAndAudio(videoSessionId, audioSessionId, outputSettings = {}) {
  return new Promise(async (resolve, reject) => {
    try {
      // Construct paths
      const projectDir = process.cwd()
      const videoDir = join(projectDir, 'manim-sessions', videoSessionId, 'media')
      const audioDir = join(projectDir, 'voiceover-sessions', audioSessionId)
      
      // Find video and audio files
      const { readdir } = await import('fs/promises')
      
      const videoFiles = await readdir(videoDir, { recursive: true })
      const audioFiles = await readdir(audioDir, { recursive: true })
      
      const videoFile = videoFiles.find(file => 
        typeof file === 'string' && file.endsWith('.mp4')
      )
      const audioFile = audioFiles.find(file => 
        typeof file === 'string' && file.endsWith('.mp3')
      )
      
      if (!videoFile || !audioFile) {
        throw new Error('Video or audio file not found')
      }
      
      const videoPath = join(videoDir, videoFile)
      const audioPath = join(audioDir, audioFile)
      
      if (!existsSync(videoPath) || !existsSync(audioPath)) {
        throw new Error('Video or audio file does not exist')
      }
      
      // Create output directory
      const outputSessionId = generateSessionId()
      const outputDir = join(projectDir, 'combined-videos', outputSessionId)
      await mkdir(outputDir, { recursive: true })
      
      const outputPath = join(outputDir, 'final_video.mp4')
      
      console.log(`🎬 Combining ${videoPath} with ${audioPath}`)
      console.log(`📤 Output: ${outputPath}`)
      
      // Get durations of both files for debugging
      const videoDuration = await getVideoDuration(videoPath)
      const audioDuration = await getAudioDuration(audioPath)
      console.log(`📊 Video duration: ${videoDuration}s, Audio duration: ${audioDuration}s`)
      
      // Determine the best approach based on durations
      let ffmpegArgs
      
      if (Math.abs(videoDuration - audioDuration) < 1) {
        // Durations are close, use simple combination
        console.log(`📊 Durations are similar, using simple combination`)
        ffmpegArgs = [
          '-i', videoPath,
          '-i', audioPath,
          '-c:v', 'copy', // Copy video codec
          '-c:a', 'aac', // Use AAC for audio
          '-b:a', '192k', // Set audio bitrate for better quality
          '-ar', '44100', // Set audio sample rate
          '-strict', 'experimental',
          '-map', '0:v:0', // Map video from first input
          '-map', '1:a:0', // Map audio from second input
          '-shortest', // End when shortest input ends
          '-avoid_negative_ts', 'make_zero', // Ensure proper timestamp handling
          '-fflags', '+genpts', // Generate presentation timestamps
          '-async', '1', // Audio sync method
          '-y', // Overwrite output file
          outputPath
        ]
      } else if (audioDuration > videoDuration) {
        // Audio is longer, loop video or extend it
        console.log(`📊 Audio is longer, extending video to match audio`)
        ffmpegArgs = [
          '-stream_loop', '-1', // Loop video input
          '-i', videoPath,
          '-i', audioPath,
          '-c:v', 'copy', // Copy video codec
          '-c:a', 'aac', // Use AAC for audio
          '-b:a', '192k', // Set audio bitrate for better quality
          '-ar', '44100', // Set audio sample rate
          '-strict', 'experimental',
          '-map', '0:v:0', // Map video from first input
          '-map', '1:a:0', // Map audio from second input
          '-shortest', // End when shortest input ends
          '-avoid_negative_ts', 'make_zero', // Ensure proper timestamp handling
          '-fflags', '+genpts', // Generate presentation timestamps
          '-async', '1', // Audio sync method
          '-y', // Overwrite output file
          outputPath
        ]
      } else {
        // Video is longer, trim it to match audio
        console.log(`📊 Video is longer, trimming video to match audio`)
        ffmpegArgs = [
          '-i', videoPath,
          '-i', audioPath,
          '-c:v', 'copy', // Copy video codec
          '-c:a', 'aac', // Use AAC for audio
          '-b:a', '192k', // Set audio bitrate for better quality
          '-ar', '44100', // Set audio sample rate
          '-strict', 'experimental',
          '-map', '0:v:0', // Map video from first input
          '-map', '1:a:0', // Map audio from second input
          '-shortest', // End when shortest input ends
          '-avoid_negative_ts', 'make_zero', // Ensure proper timestamp handling
          '-fflags', '+genpts', // Generate presentation timestamps
          '-async', '1', // Audio sync method
          '-y', // Overwrite output file
          outputPath
        ]
      }
      
      console.log(`🔧 Running FFmpeg: ffmpeg ${ffmpegArgs.join(' ')}`)
      
      const ffmpeg = spawn('ffmpeg', ffmpegArgs)
      
      let stderr = ''
      let timeoutId
      
      // Set a timeout of 5 minutes
      timeoutId = setTimeout(() => {
        console.error('⏰ FFmpeg process timed out after 5 minutes')
        ffmpeg.kill('SIGTERM')
        reject(new Error('Video processing timed out'))
      }, 5 * 60 * 1000)
      
      ffmpeg.stderr.on('data', (data) => {
        stderr += data.toString()
        const lines = data.toString().split('\n')
        lines.forEach(line => {
          if (line.trim() && !line.includes('frame=') && !line.includes('fps=')) {
            console.log(`FFmpeg: ${line.trim()}`)
          }
        })
      })
      
      ffmpeg.on('close', (code) => {
        clearTimeout(timeoutId) // Clear the timeout
        
        if (code === 0) {
          console.log(`✅ FFmpeg completed successfully`)
          
          // Verify the output file exists and has content
          if (!existsSync(outputPath)) {
            reject(new Error('Output video file was not created'))
            return
          }
          
          const { statSync } = require('fs')
          const fileSize = statSync(outputPath).size
          if (fileSize === 0) {
            reject(new Error('Output video file is empty'))
            return
          }
          
          console.log(`📊 Output file size: ${(fileSize / 1024 / 1024).toFixed(2)} MB`)
          
          // Get video duration using ffprobe
          getVideoDuration(outputPath).then(duration => {
            console.log(`📊 Final video duration: ${duration}s`)
            resolve({
              videoUrl: `/api/combined-video/${outputSessionId}`,
              duration: duration,
              sessionId: outputSessionId
            })
          }).catch(reject)
          
        } else {
          console.error(`❌ FFmpeg failed with code ${code}`)
          console.error(`FFmpeg stderr: ${stderr}`)
          
          // Provide more specific error messages
          let errorMessage = `FFmpeg failed with code ${code}`
          if (stderr.includes('No such file or directory')) {
            errorMessage = 'Input video or audio file not found'
          } else if (stderr.includes('Invalid data found')) {
            errorMessage = 'Invalid video or audio format'
          } else if (stderr.includes('Permission denied')) {
            errorMessage = 'Permission denied - check file permissions'
          }
          
          reject(new Error(errorMessage))
        }
      })
      
      ffmpeg.on('error', (error) => {
        clearTimeout(timeoutId) // Clear the timeout
        console.error(`💥 FFmpeg error: ${error.message}`)
        reject(error)
      })
      
    } catch (error) {
      reject(error)
    }
  })
}

async function getVideoDuration(videoPath) {
  return new Promise((resolve, reject) => {
    const ffprobe = spawn('ffprobe', [
      '-v', 'quiet',
      '-show_entries', 'format=duration',
      '-of', 'csv=p=0',
      videoPath
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

async function checkFFmpeg() {
  return new Promise((resolve) => {
    const ffmpeg = spawn('ffmpeg', ['-version'])
    
    ffmpeg.on('close', (code) => {
      resolve(code === 0)
    })
    
    ffmpeg.on('error', () => {
      resolve(false)
    })
  })
}

function generateSessionId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
} 
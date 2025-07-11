'use client'

import { useState, useRef } from 'react'

export default function Home() {
  const [files, setFiles] = useState([])
  const [processing, setProcessing] = useState(false)
  const [currentStep, setCurrentStep] = useState('')
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState([])
  const [segmentedVideoUrl, setSegmentedVideoUrl] = useState('')
  const [processingDetails, setProcessingDetails] = useState({
    totalSegments: 0,
    successfulSegments: 0,
    failedSegments: 0,
    failedSegmentDetails: []
  })
  const [segmentProgress, setSegmentProgress] = useState({
    currentSegment: 0,
    totalSegments: 0,
    segmentStatus: [] // Array of segment statuses
  })
  const [voiceSettings, setVoiceSettings] = useState({
    voice: 'alloy',
    speed: 1.0
  })
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  const handleFileSelect = (event) => {
    const selectedFiles = Array.from(event.target.files || [])
    const pdfFiles = selectedFiles.filter(file => file.type === 'application/pdf')
    setFiles(pdfFiles)
    setError('')
    setResults([])
    setSegmentedVideoUrl('')
    setCurrentStep('')
    setProgress(0)
    setProcessingDetails({
      totalSegments: 0,
      successfulSegments: 0,
      failedSegments: 0,
      failedSegmentDetails: []
    })
    setSegmentProgress({
      currentSegment: 0,
      totalSegments: 0,
      segmentStatus: []
    })
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const updateSegmentProgress = (segmentIndex, status, error = null) => {
    setSegmentProgress(prev => {
      const newStatus = [...prev.segmentStatus]
      newStatus[segmentIndex] = { status, error }
      
      const completedSegments = newStatus.filter(s => s && s.status === 'completed').length
      const failedSegments = newStatus.filter(s => s && s.status === 'failed').length
      const totalCompleted = completedSegments + failedSegments
      
      // Calculate overall progress: 30% for PDF processing, 70% for segments
      const segmentProgressPercent = (totalCompleted / prev.totalSegments) * 70
      const overallProgress = 30 + segmentProgressPercent
      
      setProgress(Math.round(overallProgress))
      
      return {
        ...prev,
        currentSegment: segmentIndex + 1,
        segmentStatus: newStatus
      }
    })
  }

  const handleCreateVideo = async () => {
    if (files.length === 0) return

    console.log('🚀 Starting complete video creation process...')
    setProcessing(true)
    setError('')
    setResults([])
    setSegmentedVideoUrl('')
    setCurrentStep('Processing PDFs...')
    setProgress(10)
    setProcessingDetails({
      totalSegments: 0,
      successfulSegments: 0,
      failedSegments: 0,
      failedSegmentDetails: []
    })

    const formData = new FormData()
    files.forEach(file => {
      console.log(`📋 Adding file to form data: ${file.name}`)
      formData.append('pdfs', file)
    })

    try {
      // Step 1: Process PDFs
      console.log('📤 Sending request to /api/process-pdf...')
      const response = await fetch('/api/process-pdf', {
        method: 'POST',
        body: formData
      })

      console.log(`📥 Received response: ${response.status} ${response.statusText}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'PDF processing failed')
      }

      console.log('✅ Processing successful, setting results:', data.results.length)
      setResults(data.results)
      setCurrentStep('Generating segmented video...')
      setProgress(30)

      // Step 2: Generate segmented video
      const videoScript = data.results[0].content
      console.log(`📝 Sending video script (${videoScript.length} characters) for segmented video generation...`)
      
      const segmentedResponse = await fetch('/api/generate-segmented-video', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          videoScript,
          voiceSettings
        })
      })

      console.log(`📥 Received segmented video response: ${segmentedResponse.status} ${segmentedResponse.statusText}`)
      const segmentedData = await segmentedResponse.json()

      if (!segmentedResponse.ok) {
        throw new Error(segmentedData.error || 'Segmented video generation failed')
      }

      console.log('✅ Segmented video generation started, session ID:', segmentedData.sessionId)
      
      // Set up progress tracking for segments
      setSegmentProgress({
        currentSegment: 0,
        totalSegments: segmentedData.totalSegments,
        segmentStatus: new Array(segmentedData.totalSegments).fill(null)
      })
      
      // Start polling for progress updates
      const sessionId = segmentedData.sessionId
      let pollCount = 0
      const maxPolls = 300 // 10 minutes max (300 * 2 seconds)
      
      const pollProgress = async () => {
        try {
          pollCount++
          console.log(`📊 Polling progress (attempt ${pollCount}/${maxPolls})...`)
          
          const progressResponse = await fetch(`/api/generate-segmented-video?sessionId=${sessionId}`)
          const progressData = await progressResponse.json()
          
          if (progressResponse.ok) {
            console.log('📊 Progress data received:', progressData)
            
            // Update segment progress
            setSegmentProgress(prev => ({
              currentSegment: progressData.currentSegment || 0,
              totalSegments: progressData.totalSegments || prev.totalSegments,
              segmentStatus: progressData.segmentStatus ? progressData.segmentStatus.map((status, index) => 
                status ? {
                  status: status.status,
                  error: status.error,
                  isFallback: status.isFallback
                } : null
              ) : prev.segmentStatus
            }))
            
            // Calculate overall progress
            const completedSegments = progressData.completedSegments || 0
            const failedSegments = progressData.failedSegments || 0
            const totalCompleted = completedSegments + failedSegments
            const totalSegments = progressData.totalSegments || 1
            const segmentProgressPercent = (totalCompleted / totalSegments) * 70
            const overallProgress = Math.min(30 + segmentProgressPercent, 99) // Cap at 99% until complete
            setProgress(Math.round(overallProgress))
            
            // Update current step with more detail
            if (progressData.currentSegment > 0) {
              setCurrentStep(`Processing segment ${progressData.currentSegment} of ${totalSegments}...`)
            }
            
            // Check if processing is complete
            if (progressData.status === 'completed' && progressData.finalResult) {
              console.log('✅ Segmented video generation completed successfully')
              console.log('🎬 Final result:', progressData.finalResult)
              
              setSegmentedVideoUrl(progressData.finalResult.videoUrl)
              setCurrentStep('Video creation complete!')
              setProgress(100)
              
              // Update processing details
              setProcessingDetails({
                totalSegments: progressData.finalResult.totalSegments,
                successfulSegments: progressData.finalResult.successfulSegments,
                failedSegments: progressData.finalResult.failedSegments,
                failedSegmentDetails: progressData.finalResult.failedSegmentDetails
              })
              
              setProcessing(false)
              return // Stop polling
            } else if (progressData.status === 'failed') {
              throw new Error(progressData.error || 'Segmented video generation failed')
            }
            
            // Check if we've exceeded max polls
            if (pollCount >= maxPolls) {
              throw new Error('Processing timeout - taking longer than expected')
            }
            
            // Continue polling
            setTimeout(pollProgress, 2000) // Poll every 2 seconds
          } else {
            console.error('❌ Progress response error:', progressData)
            throw new Error(progressData.error || 'Failed to get progress')
          }
        } catch (error) {
          console.error('💥 Progress polling error:', error)
          setError(error.message || 'Failed to track progress')
          setCurrentStep('Error occurred during processing')
          setProcessing(false)
        }
      }
      
      // Start polling
      pollProgress()

    } catch (error) {
      console.error('💥 Video creation error:', error)
      setError(error.message || 'Video creation failed. Please try again.')
      setCurrentStep('Error occurred')
      setProcessing(false)
    }
  }

  const formatContent = (content) => {
    // Convert plain text to formatted HTML with line breaks
    return content.split('\n').map((line, index) => {
      if (line.trim() === '') return <br key={index} />
      if (line.startsWith('#')) {
        return <h3 key={index} className="text-xl font-bold text-blue-600 mt-4 mb-2">{line.replace('#', '')}</h3>
      }
      if (line.startsWith('-')) {
        return <li key={index} className="ml-4 text-gray-700">{line.replace('-', '')}</li>
      }
      if (line.match(/^\d+\./)) {
        return <li key={index} className="ml-4 text-gray-700">{line}</li>
      }
      return <p key={index} className="text-gray-700 mb-2">{line}</p>
    })
  }

  const getSegmentStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return '✅'
      case 'failed':
        return '❌'
      case 'processing':
        return '🔄'
      default:
        return '⏳'
    }
  }

  const getSegmentStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-green-600'
      case 'failed':
        return 'text-red-600'
      case 'processing':
        return 'text-blue-600'
      default:
        return 'text-gray-400'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            PDF to Educational Video Generator
          </h1>
          <p className="text-lg text-gray-600">
            Transform your PDFs into engaging educational videos with AI-generated animations and voice over
          </p>
        </div>

        {/* File Upload */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="text-center">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-blue-400 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-colors text-lg font-semibold"
              >
                📁 Select PDF Files
              </button>
              <p className="text-gray-600 mt-2">Upload one or more PDF files to create educational videos</p>
            </div>
            
            {files.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Selected Files:</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="space-y-2">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-white rounded-lg p-3 shadow-sm">
                        <div className="flex items-center space-x-3">
                          <div className="text-blue-500">
                            📄
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{file.name}</p>
                            <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {file.type}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Total:</span> {files.length} file{files.length !== 1 ? 's' : ''} • {formatFileSize(files.reduce((total, file) => total + file.size, 0))}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Voice Settings */}
        {files.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Voice Over Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Voice</label>
                <select
                  value={voiceSettings.voice}
                  onChange={(e) => setVoiceSettings(prev => ({ ...prev, voice: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="alloy">Alloy (Neutral)</option>
                  <option value="echo">Echo (Male)</option>
                  <option value="fable">Fable (Male)</option>
                  <option value="onyx">Onyx (Male)</option>
                  <option value="nova">Nova (Female)</option>
                  <option value="shimmer">Shimmer (Female)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Speed</label>
                <input
                  type="range"
                  min="0.25"
                  max="4.0"
                  step="0.25"
                  value={voiceSettings.speed}
                  onChange={(e) => setVoiceSettings(prev => ({ ...prev, speed: parseFloat(e.target.value) }))}
                  className="w-full"
                />
                <div className="text-sm text-gray-600 mt-1">{voiceSettings.speed}x</div>
              </div>
            </div>
          </div>
        )}

        {/* Create Video Button */}
        {files.length > 0 && !processing && (
          <div className="text-center mb-8">
            <button
              onClick={handleCreateVideo}
              disabled={processing}
              className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-400 text-white px-8 py-4 rounded-lg transition-colors text-xl font-semibold"
            >
              🎬 Create Educational Video
            </button>
          </div>
        )}

        {/* Progress Indicator - Always show when processing */}
        {processing && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Progress</h3>
              <span className="text-sm text-gray-600">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
              <div 
                className="bg-emerald-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-gray-700 mb-4">{currentStep}</p>
            
            {/* Segment Progress */}
            {segmentProgress.totalSegments > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold text-gray-800 mb-3">Segment Progress</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 mb-4">
                  {Array.from({ length: segmentProgress.totalSegments }, (_, index) => {
                    const status = segmentProgress.segmentStatus[index]
                    return (
                      <div 
                        key={index} 
                        className={`p-2 rounded-lg text-center text-sm font-medium border ${
                          status ? getSegmentStatusColor(status.status) : 'text-gray-400 border-gray-200'
                        }`}
                      >
                        <div className="text-lg mb-1">
                          {status ? getSegmentStatusIcon(status.status) : '⏳'}
                        </div>
                        <div>Segment {index + 1}</div>
                        {status && status.isFallback && (
                          <div className="text-xs mt-1 text-orange-500">Fallback</div>
                        )}
                        {status && status.error && (
                          <div className="text-xs mt-1 text-red-500 truncate" title={status.error}>
                            Error
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>
                    Processing segment {segmentProgress.currentSegment} of {segmentProgress.totalSegments}
                  </span>
                  <span>
                    {segmentProgress.segmentStatus.filter(s => s && s.status === 'completed').length} completed, 
                    {segmentProgress.segmentStatus.filter(s => s && s.status === 'failed').length} failed
                  </span>
                </div>
              </div>
            )}
            
            {/* Processing Status */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-sm text-blue-700">
                  Processing in progress... Please wait while we generate your educational video.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Processing Results Summary */}
        {!processing && processingDetails.totalSegments > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Processing Results</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{processingDetails.successfulSegments}</div>
                <div className="text-sm text-green-700">Successful Segments</div>
              </div>
              <div className="bg-red-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{processingDetails.failedSegments}</div>
                <div className="text-sm text-red-700">Failed Segments</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{processingDetails.totalSegments}</div>
                <div className="text-sm text-blue-700">Total Segments</div>
              </div>
            </div>
            
            {processingDetails.failedSegmentDetails.length > 0 && (
              <div className="mt-4">
                <h4 className="font-semibold text-gray-800 mb-2">Failed Segments:</h4>
                <div className="space-y-2">
                  {processingDetails.failedSegmentDetails.map((failed, index) => (
                    <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm font-medium text-red-800">
                        Segment {failed.index + 1}: {failed.title}
                      </p>
                      <p className="text-xs text-red-600 mt-1">{failed.error}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-8">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {/* Generated Content */}
        {results.length > 0 && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">Generated Content</h2>
            </div>

            {results.map((result, index) => (
              <div key={index} className="bg-white rounded-lg shadow-lg p-8">
                <h3 className="text-xl font-bold text-blue-600 mb-4">
                  {result.fileName}
                </h3>
                <div className="prose max-w-none">
                  {formatContent(result.content)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Final Video */}
        {segmentedVideoUrl && (
          <div className="bg-white rounded-lg shadow-lg p-8 mt-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">🎬 Your Educational Video</h2>
            <div className="bg-black rounded-lg overflow-hidden">
              <video 
                controls 
                className="w-full h-auto"
                src={segmentedVideoUrl}
                onError={(e) => {
                  console.error('Video loading error:', e)
                  setError('Failed to load video. Please try downloading it instead.')
                }}
              >
                Your browser does not support the video tag.
              </video>
            </div>
            <div className="mt-4 flex gap-2">
              <a
                href={segmentedVideoUrl}
                download="educational_video.mp4"
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                📥 Download Video
              </a>
              <button
                onClick={() => {
                  const video = document.querySelector('video')
                  if (video) {
                    video.currentTime = 0
                    video.play()
                  }
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                🔄 Replay Video
              </button>
            </div>
            <div className="mt-4 p-4 bg-emerald-50 rounded-lg">
              <h4 className="font-semibold text-emerald-800 mb-2">✨ Perfect Synchronization</h4>
              <p className="text-emerald-700 text-sm">
                This video was created using the segmented approach: each section has its own audio and video that are perfectly synchronized, then combined into one seamless educational video.
              </p>
            </div>
            {processingDetails.totalSegments > 0 && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">📊 Video Statistics</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-bold text-blue-600">{processingDetails.totalSegments}</div>
                    <div className="text-blue-700">Total Segments</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-green-600">{processingDetails.successfulSegments}</div>
                    <div className="text-green-700">Successful</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-red-600">{processingDetails.failedSegments}</div>
                    <div className="text-red-700">Failed</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

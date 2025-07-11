import { GoogleGenerativeAI } from '@google/generative-ai'
import { writeFile } from 'fs/promises'
import { join } from 'path'
import { v4 as uuidv4 } from 'uuid'

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

export async function POST(request) {
  console.log('🚀 Starting PDF processing request...')
  
  try {
    console.log('📋 Parsing form data...')
    const formData = await request.formData()
    const files = formData.getAll('pdfs')
    
    console.log(`📁 Found ${files.length} files in request`)
    
    if (!files || files.length === 0) {
      console.log('❌ No files found in request')
      return Response.json({ error: 'No files uploaded' }, { status: 400 })
    }

    // Process all PDFs together for one combined video
    console.log(`\n🎬 Processing ${files.length} PDFs for one combined video...`)
    
    const pdfBuffers = []
    const fileNames = []
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      console.log(`\n📄 Processing file ${i + 1}/${files.length}: ${file.name}`)
      
      if (file.type !== 'application/pdf') {
        console.log(`⚠️ Skipping non-PDF file: ${file.name} (type: ${file.type})`)
        continue
      }

      console.log(`📖 Converting file to buffer...`)
      // Save file temporarily
      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)
      const fileName = `${uuidv4()}-${file.name}`
      const filePath = join(process.cwd(), 'uploads', fileName)
      
      console.log(`📁 Creating uploads directory if needed...`)
      // Ensure uploads directory exists
      const { mkdir } = await import('fs/promises')
      await mkdir(join(process.cwd(), 'uploads'), { recursive: true })
      
      console.log(`💾 Saving file to: ${filePath}`)
      await writeFile(filePath, buffer)
      
      console.log(`🔍 Processing PDF file...`)
      console.log(`📝 File size: ${buffer.length} bytes`)
      
      pdfBuffers.push(buffer)
      fileNames.push(file.name)
    }
    
    if (pdfBuffers.length === 0) {
      console.log('❌ No valid PDF files found')
      return Response.json({ error: 'No valid PDF files uploaded' }, { status: 400 })
    }
    
    console.log(`🤖 Processing ${pdfBuffers.length} PDFs with Gemini AI for combined video...`)
    // Process all PDFs together with Gemini
    const combinedResult = await processMultiplePDFsWithGemini(pdfBuffers, fileNames)
    
    console.log(`✅ Completed processing for combined video`)
    const results = [{
      fileName: 'Combined Video Script',
      content: combinedResult
    }]

    console.log(`🎉 Successfully processed ${results.length} files`)
    return Response.json({ 
      success: true, 
      results 
    })

  } catch (error) {
    console.error('💥 Processing error:', error)
    return Response.json({ error: 'Processing failed' }, { status: 500 })
  }
}

async function processWithGemini(pdfBuffer, fileName) {
  try {
    console.log(`🔑 Checking Gemini API key...`)
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY environment variable is not set')
    }
    
    console.log(`🤖 Initializing Gemini model...`)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

    console.log(`📝 Preparing multimodal prompt for ${fileName}...`)
    const prompt = `
    You are an expert educator who creates engaging educational content in the style of 3Blue1Brown.
    
    Analyze this PDF document and create an educational video script. This is a PDF file that you can read directly.
    
    Please create:
    1. A compelling video title
    2. 3-5 logical segments with:
       - Segment title
       - Engaging script (2-3 sentences for narration)
       - Key concepts to visualize
       - Animation ideas (what should be drawn/animated)
    3. A brief summary of the main educational value
    
    Format your response in a clear, structured way that's easy to read on a website.
    Make it engaging, visual, and educational. Focus on concepts that benefit from visual explanation.
    `

    console.log(`🚀 Sending PDF to Gemini API...`)
    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: pdfBuffer.toString('base64'),
          mimeType: 'application/pdf'
        }
      }
    ])
    console.log(`📨 Received response from Gemini API`)
    
    const response = await result.response
    const responseText = response.text()
    console.log(`📄 Generated ${responseText.length} characters of content`)
    
    return responseText

  } catch (error) {
    console.error('💥 Gemini API error:', error)
    return `Error processing ${fileName}: ${error.message}`
  }
}

async function processMultiplePDFsWithGemini(pdfBuffers, fileNames) {
  try {
    console.log(`🔑 Checking Gemini API key...`)
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY environment variable is not set')
    }
    
    console.log(`🤖 Initializing Gemini model...`)
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

    console.log(`📝 Preparing multimodal prompt for ${pdfBuffers.length} PDFs...`)
    const prompt = `
    You are an expert educator who creates engaging educational content in the style of 3Blue1Brown.
    
    Analyze these ${pdfBuffers.length} PDF documents and create ONE comprehensive educational video script that combines all the content into a cohesive narrative.
    
    PDF files: ${fileNames.join(', ')}
    
    Please create:
    1. A compelling video title that encompasses all topics
    2. 5-8 logical segments that flow naturally from one to the next, covering all the material:
       - Segment title
       - Engaging script (2-3 sentences for narration)
       - Key concepts to visualize
       - Animation ideas (what should be drawn/animated)
    3. A brief summary of the main educational value and how the topics connect
    
    Format your response in a clear, structured way that's easy to read on a website.
    Make it engaging, visual, and educational. Focus on concepts that benefit from visual explanation.
    Create a seamless flow between all the topics from the different PDFs.
    `

    console.log(`🚀 Sending ${pdfBuffers.length} PDFs to Gemini API...`)
    
    // Prepare the content parts for Gemini
    const contentParts = [prompt]
    
    // Add each PDF as a separate part
    for (let i = 0; i < pdfBuffers.length; i++) {
      contentParts.push({
        inlineData: {
          data: pdfBuffers[i].toString('base64'),
          mimeType: 'application/pdf'
        }
      })
    }
    
    const result = await model.generateContent(contentParts)
    console.log(`📨 Received response from Gemini API`)
    
    const response = await result.response
    const responseText = response.text()
    console.log(`📄 Generated ${responseText.length} characters of content`)
    
    return responseText

  } catch (error) {
    console.error('💥 Gemini API error:', error)
    return `Error processing multiple PDFs: ${error.message}`
  }
} 
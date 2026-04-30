import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { extractText } from 'unpdf';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    console.log('--- Starting Resume Analysis (unpdf) ---');
    console.log('File name:', file.name);

    // Convert file to Uint8Array for unpdf
    const bytes = await file.arrayBuffer();
    const uint8Array = new Uint8Array(bytes);

    // Extract text using unpdf
    console.log('Extracting text from PDF...');
    let extractedText = '';
    
    try {
      const { text } = await extractText(uint8Array);
      extractedText = Array.isArray(text) ? text.join('\n') : String(text || '');
    } catch (pdfError: any) {
      console.error('unpdf extraction failed:', pdfError);
      throw new Error(`PDF extraction failed: ${pdfError.message}`);
    }

    if (!extractedText || extractedText.trim().length === 0) {
       console.error('PDF Extraction failed: No text found');
       return NextResponse.json({ error: 'Could not extract text from PDF. Is the file empty or password protected?' }, { status: 400 });
    }
    console.log('Extracted text length:', extractedText.length);

    // Initialize OpenAI with NVIDIA NIM config
    const apiKey = process.env.NEXT_PUBLIC_NVIDIA_API_KEY || process.env.NVIDIA_API_KEY;
    if (!apiKey) {
      console.error('NVIDIA API Key is missing');
      return NextResponse.json({ error: 'NVIDIA API Key is not configured' }, { status: 500 });
    }

    const client = new OpenAI({
      apiKey: apiKey,
      baseURL: 'https://integrate.api.nvidia.com/v1',
    });

    console.log('Calling NVIDIA NIM (Llama 3.1 70B)...');
    const completion = await client.chat.completions.create({
      model: 'meta/llama-3.1-70b-instruct',
      messages: [
        {
          role: 'system',
          content: 'You are an expert resume analyzer. You must respond with valid JSON only.',
        },
        {
          role: 'user',
          content: `Analyze this resume. Provide a JSON response with the following structure:
          {
            "overallScore": number (0-100, be realistic),
            "targetRole": string (infer the role they are applying for or their current profession),
            "matches": number (number of good things/keywords matched),
            "issues": number (number of issues found),
            "keywordMatches": string[] (list of keywords found),
            "formattingIssues": string[] (list of formatting issues or areas of improvement),
            "suggestions": string[] (list of actionable suggestions to improve the resume)
          }

          Resume Text:
          ${extractedText}`,
        },
      ],
      temperature: 0.2,
      top_p: 0.7,
      max_tokens: 2048,
    });

    const resultText = completion.choices[0]?.message?.content;
    console.log('AI Response received');
    
    if (!resultText) {
      console.error('AI Response is empty');
      throw new Error('No response from AI');
    }

    // Clean up response in case of markdown formatting
    const jsonMatch = resultText.match(/\{[\s\S]*\}/);
    const cleanedJson = jsonMatch ? jsonMatch[0] : resultText;
    
    console.log('Parsing JSON result...');
    const analysisResult = JSON.parse(cleanedJson);
    console.log('Analysis complete!');

    return NextResponse.json(analysisResult);
  } catch (error: any) {
    console.error('--- Analysis error details ---');
    console.error('Message:', error.message);
    console.error('Stack:', error.stack);
    return NextResponse.json({ error: `Analysis failed: ${error.message}` }, { status: 500 });
  }
}

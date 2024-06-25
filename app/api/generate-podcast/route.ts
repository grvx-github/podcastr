import { NextRequest, NextResponse } from "next/server"
import textToSpeech from "@/lib/watson"

export async function POST(request: NextRequest) {
  try {
    const { text, voice } = await request.json()

    if (!text || !voice) {
      return NextResponse.json(
        { message: "Text and voice are required" },
        { status: 400 }
      )
    }

    // Synthesize speech using IBM Watson Text-to-Speech
    const response = await textToSpeech.synthesize({
      text,
      accept: "audio/mp3",
      voice,
    })

    // Check if response contains readable stream
    if (response && response.result) {
      const chunks: Buffer[] = [] // Explicitly type as Buffer[]

      // Iterate over the readable stream to collect chunks
      for await (const chunk of response.result) {
        // Ensure each chunk is a Buffer
        if (Buffer.isBuffer(chunk)) {
          chunks.push(chunk)
        } else {
          console.error("Unexpected chunk type:", typeof chunk)
          return NextResponse.json(
            { message: "Unexpected data type in audio stream" },
            { status: 500 }
          )
        }
      }

      const audioBuffer = Buffer.concat(chunks)

      // Convert buffer to base64 string to return in JSON response
      const audioBase64 = audioBuffer.toString("base64")
      return NextResponse.json({ audio: audioBase64 })
    }

    return NextResponse.json(
      { message: "No audio data received from the API" },
      { status: 500 }
    )
  } catch (error) {
    console.error("Error generating podcast:", error)
    return NextResponse.json(
      { message: "Failed to generate podcast" },
      { status: 500 }
    )
  }
}

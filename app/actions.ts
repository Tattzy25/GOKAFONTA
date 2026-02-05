"use server"

import Replicate from "replicate"

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
})

export async function generateImage(formData: FormData) {
  const prompt = formData.get("prompt") as string
  const image = formData.get("image") as string
  const mask = formData.get("mask") as string

  // Hardcoded internal settings based on provided payload and JSON schema
  const replicateModelId = "4e8f6c1dc77db77dabaf98318cde3679375a399b434ae2db0e698804ac84919c"
  
  const input: any = {
    prompt: `a beautiful TA-TTT-OO-ME tattoo image of ${prompt}`,
    model: "dev",
    aspect_ratio: "1:1",
    output_format: "webp",
    num_outputs: 1,
    megapixels: "1",
    output_quality: 80,
    guidance_scale: 3,
    num_inference_steps: 28,
    go_fast: false,
    disable_safety_checker: true,
    prompt_strength: 0.8,
    lora_scale: 1,
    extra_lora_scale: 1,
  }

  if (image) input.image = image
  if (mask) input.mask = mask

  try {
    const output = await replicate.run(
      replicateModelId as any,
      { input }
    )
    
    // Convert FileOutput objects to URL strings
    const serializedOutput = Array.isArray(output) 
      ? output.map((item: any) => item.url().toString())
      : (output as any).url().toString()

    return { success: true, output: serializedOutput }
  } catch (error) {
    console.error("Error generating image:", error)
    return { success: false, error: error instanceof Error ? error.message : String(error) }
  }
}

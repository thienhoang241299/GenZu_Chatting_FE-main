import { GoogleGenerativeAI, FunctionDeclarationSchemaType } from '@google/generative-ai'

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_API_KEY

const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY)

export async function answerSuggestion(question) {
  // Choose a model that's appropriate for your use case.
  // Using `responseSchema` requires one of the Gemini 1.5 Pro models
  const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro-001",
    // Set the `responseMimeType` to output JSON
    // Pass the schema object to the `responseSchema` field
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: FunctionDeclarationSchemaType.ARRAY,
        items: {
          type: FunctionDeclarationSchemaType.OBJECT,
          properties: {
            general: {
              type: FunctionDeclarationSchemaType.STRING,
            },
          },
        },
      },
    }
  })

  const prompt = `Suggest answer for ${question}`

  const result = await model.generateContent(prompt)
  const response = result.response
  const text = response.text()
  return text
}

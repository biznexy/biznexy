import googleImagen from "@/genkit/google/imagen"
import { z } from "genkit"
import { imageGenerateOutputSchema } from "./generate"
import { createDoc, docRef } from "@/firebase/server/firestore"

const createImageRecord = googleImagen.defineTool(
  {
    name: "createRecord",
    description: "Create a record in the database",
    inputSchema: imageGenerateOutputSchema,
    outputSchema: z.boolean().describe("Whether the record was created successfully"),
  },
  async (imageData) => {
    const imageRef = docRef("images", imageData.imageId)
    await createDoc(imageRef, imageData)
    return true
  }
)

export default createImageRecord

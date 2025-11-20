import GenerateImage from "@/components/generate-image";
import ImageGrid from "./image-grid";
import { firestore } from "@/firebase/server";
import { DocumentData } from "firebase/firestore";


export const dynamic = 'force-dynamic'

export default async function Page() {
  const images: DocumentData[] = []
  const query = firestore.collection("images").orderBy("createdAt", "desc").limit(10)

  const snapshot = await query.get()
  snapshot.docs.forEach((doc) => {
    const data = doc.data()
    data.id = doc.id
    data.url = `/admin/images/${data.id}.${data.extension}`
    images.push(data)
  })

  return (
    <div className="flex flex-col gap-4 grow">
      <GenerateImage />
      <ImageGrid images={JSON.parse(JSON.stringify(images))} />
    </div>
  )
}

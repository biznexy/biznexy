import { CollectionReference } from "firebase-admin/firestore"
import { firestore } from "."
import crypto from "crypto"

const collectionRef = (path: string) => firestore.collection(path)
const docRef = (collectionPath: string, docPath: string) => collectionRef(collectionPath).doc(docPath)
const getDoc = (collectionPath: string, docPath: string) => docRef(collectionPath, docPath).get()
const whereDoc = (collection: string, key: string, value: any) => {
  return collectionRef(collection).where(key, "==", value).get()
}
const findDoc = async (collection: string, key: string, value: any) => {
  const snapshot = await whereDoc(collection, key, value)
  if (snapshot.empty) {
    return null
  }
  return snapshot.docs.at(0)
}
const getData = async (collectionPath: string, docPath: string) => {
  const doc = await getDoc(collectionPath, docPath)
  return doc?.data()
}
const findData = async (collection: string, key: string, value: any) => {
  const doc = await findDoc(collection, key, value)
  return doc?.data()
}

const generateId = () => {
  return crypto.randomBytes(8).toString("base64url").slice(0, 11)
}

const createDoc = async (collectionRef: CollectionReference, data: FirebaseFirestore.WithFieldValue<FirebaseFirestore.DocumentData>) => {
  while (true) {
    const id = generateId()
    const ref = collectionRef.doc(id)

    try {
      await firestore.runTransaction(async (tx) => {
        tx.create(ref, data)
      })
      return id
    } catch (err) {
      // collision — ultra-rare
    }
  }
}

export {
  collectionRef,
  docRef,
  getDoc,
  whereDoc,
  findDoc,
  getData,
  findData,
  createDoc,
  generateId
}
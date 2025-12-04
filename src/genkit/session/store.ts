import { docRef } from "@/firebase/server/firestore";
import { DocumentData } from "firebase-admin/firestore";
import { SessionData, SessionStore } from "genkit";

class GenkitSessionStore<S = DocumentData> implements SessionStore<S> {
  collectionPath: string

  constructor(collectionPath?: string) {
    this.collectionPath = collectionPath || "genkitSessions"
  }

  async get(sessionId: string): Promise<SessionData<S> | undefined> {
    const sessionRef = docRef(this.collectionPath, sessionId)
    try {
      const sessionDoc = await sessionRef.get()
      return sessionDoc.data() as SessionData<S>
    } catch (err) {
      console.error(err)
      return undefined;
    }
  }

  async save(sessionId: string, sessionData: SessionData<S>): Promise<void> {
    const sessionRef = docRef(this.collectionPath, sessionId)
    await sessionRef.set(sessionData)
  }

  async delete(sessionId: string): Promise<void> {
    const sessionRef = docRef(this.collectionPath, sessionId)
    await sessionRef.delete()
  }
}

export default GenkitSessionStore
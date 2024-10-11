import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  DocumentReference,
  Timestamp,
  doc,
  onSnapshot,
} from "firebase/firestore";
import { firestore } from "@/config/firebase";
import { SearchResult } from "@/types/SearchResult";

export async function saveSearchResults(
  searchResults: Omit<SearchResult, "createdAt" | "updatedAt" | "createdBy">[],
  userId: string,
): Promise<void> {
  const searchResultsCollection = collection(firestore, "searchResults");

  for (const result of searchResults) {
    // Check if a document with the same URL already exists
    const q = query(searchResultsCollection, where("url", "==", result.url));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      // If no document with the same URL exists, add a new one
      const userRef: DocumentReference = doc(firestore, "users", userId);
      await addDoc(searchResultsCollection, {
        ...result,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        createdBy: userRef,
      });
    }
  }
}

export function subscribeToSearchResults(
  userId: string,
  callback: (results: SearchResult[]) => void,
): () => void {
  const userRef: DocumentReference = doc(firestore, "users", userId);
  const searchResultsCollection = collection(firestore, "searchResults");
  const q = query(searchResultsCollection, where("createdBy", "==", userRef));

  return onSnapshot(q, (querySnapshot) => {
    const results: SearchResult[] = querySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        summary: data.summary,
        text: data.text,
        url: data.url,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
        createdBy: data.createdBy,
      };
    });
    callback(results);
  });
}

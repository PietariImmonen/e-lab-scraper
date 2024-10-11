import { DocumentReference } from "firebase/firestore";

export interface SearchResult {
  id: string;
  summary: string;
  text: string;
  url: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: DocumentReference;
}

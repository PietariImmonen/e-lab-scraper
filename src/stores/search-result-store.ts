import { create } from "zustand";
import {
  collection,
  query,
  getDocs,
  DocumentData,
  where,
  doc,
} from "firebase/firestore";
import { firestore } from "@/config/firebase"; // Assuming you have a firebase config file
import { SearchResult } from "@/types/SearchResult";
import { subscribeToSearchResults } from "@/services/search-result-service";

interface SearchResultStore {
  searchResults: SearchResult[];
  isLoading: boolean;
  error: string | null;
  fetchSearchResults: (userId: string) => Promise<void>;
  subscribeToSearchResults: (userId: string) => () => void;
}

export const useSearchResultStore = create<SearchResultStore>((set) => ({
  searchResults: [],
  isLoading: false,
  error: null,
  fetchSearchResults: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const userRef = doc(firestore, "users", userId);
      const q = query(
        collection(firestore, "searchResults"),
        where("createdBy", "==", userRef),
      );
      const querySnapshot = await getDocs(q);
      const results: SearchResult[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as DocumentData;
        results.push({
          id: doc.id,
          summary: data.summary,
          text: data.text,
          url: data.url,
          createdAt: data.createdAt.toDate(),
          updatedAt: data.updatedAt.toDate(),
          createdBy: data.createdBy,
        });
      });
      set({ searchResults: results, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  subscribeToSearchResults: (userId: string) => {
    return subscribeToSearchResults(userId, (results) => {
      set({ searchResults: results });
    });
  },
}));

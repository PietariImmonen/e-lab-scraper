"use client";

import { useAuthContext } from "@/hooks/use-auth-context";
import SearchResults from "@/sections/search-result-table/search-result-table";
import SearchSection from "@/sections/search/search-section";
import { useSearchResultStore } from "@/stores/search-result-store";
import { useEffect } from "react";

const Page = () => {
  const { user } = useAuthContext();
  const {
    searchResults,
    isLoading,

    subscribeToSearchResults,
  } = useSearchResultStore();

  useEffect(() => {
    if (user) {
      const unsubscribe = subscribeToSearchResults(user.id);
      return () => unsubscribe();
    }
    return () => {};
  }, [subscribeToSearchResults, user]);

  return (
    <div className="flex flex-col gap-4">
      <SearchSection />
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <SearchResults results={searchResults} />
      )}
    </div>
  );
};
export default Page;

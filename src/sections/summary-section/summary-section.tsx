"use client";
import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useSearchResultStore } from "@/stores/search-result-store";
import Summary from "@/components/summary/summary";
import { useAuthContext } from "@/hooks/use-auth-context";

const SummarySection: React.FC = () => {
  const { id } = useParams();
  const { user } = useAuthContext();
  const { searchResults, fetchSearchResults } = useSearchResultStore();

  useEffect(() => {
    if (user) {
      fetchSearchResults(user.id);
    }
  }, [fetchSearchResults, user]);

  const searchResult = searchResults.find((result) => result.id === id);
  if (!searchResult) {
    return <div>No summary found for this ID.</div>;
  }

  return (
    <div className="my-4">
      <Summary summary={searchResult.summary} />
    </div>
  );
};

export default SummarySection;

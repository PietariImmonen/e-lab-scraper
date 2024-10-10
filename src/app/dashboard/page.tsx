"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

const Page = () => {
  const [loading, setLoading] = useState(false);
  const testScrape = async () => {
    setLoading(true);
    const response = await fetch("/api/scrape", {
      method: "POST",
      body: JSON.stringify({ searchWord: "AI in the customer service" }),
    });
    const data = await response.json();

    console.log(data);
    setLoading(false);
  };
  return (
    <div>
      <p>Dashboard</p>
      <Button onClick={testScrape}>Test Scrape</Button>
      {loading && <p>Loading...</p>}
    </div>
  );
};
export default Page;

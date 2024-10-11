import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { SearchResult } from "@/types/SearchResult";

export default function SearchResults({
  results = [],
}: {
  results?: SearchResult[];
}) {
  const [filter, setFilter] = useState("");
  const router = useRouter();

  const filteredResults =
    results?.filter(
      (result) =>
        result.summary.toLowerCase().includes(filter.toLowerCase()) ||
        result.text.toLowerCase().includes(filter.toLowerCase()) ||
        result.url.toLowerCase().includes(filter.toLowerCase()),
    ) || [];

  const truncateText = (text: string, wordCount: number) => {
    const words = text.split(" ");
    return (
      words.slice(0, wordCount).join(" ") +
      (words.length > wordCount ? "..." : "")
    );
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Filter results..."
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="max-w-sm"
      />
      {filteredResults.length > 0 ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Summary</TableHead>
              <TableHead>URL</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead>Updated At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredResults.map((result, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">
                  {truncateText(result.summary, 10)}
                </TableCell>
                <TableCell>{result.url}</TableCell>
                <TableCell>{result.createdAt.toLocaleString()}</TableCell>
                <TableCell>{result.updatedAt.toLocaleString()}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    onClick={() =>
                      router.push(`/dashboard/summary/${result.id}`)
                    }
                  >
                    View Details
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
}

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";

interface SummaryProps {
  summary: string;
}

const Summary: React.FC<SummaryProps> = ({ summary }) => {
  return (
    <Card>
      <CardContent>
        <p className="text-lg font-bold">Summary</p>
        <ReactMarkdown>{summary}</ReactMarkdown>
      </CardContent>
    </Card>
  );
};

export default Summary;

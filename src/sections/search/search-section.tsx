import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useAuthContext } from "@/hooks/use-auth-context";
import { saveSearchResults } from "@/services/search-result-service";

const searchSchema = z.object({
  searchWord: z.string().min(1, "Search word is required"),
});

type SearchFormValues = z.infer<typeof searchSchema>;

const SearchSection = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuthContext();

  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      searchWord: "",
    },
  });

  /**
   * Handles the form submission.
   * @param values - The form values.
   */
  const onSubmit = async (values: SearchFormValues) => {
    setLoading(true);
    try {
      if (!user) {
        throw new Error("User not found");
      }
      const response = await fetch("/api/scrape", {
        method: "POST",
        body: JSON.stringify({ searchWord: values.searchWord }),
      });
      const data = await response.json();
      await saveSearchResults(data.content, user?.uid);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Search</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="searchWord"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Search Word</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter search word" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit" className="mt-4" disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default SearchSection;

/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
// eslint-disable-next-line @typescript-eslint/no-require-imports

const GOOGLE_API_KEY = process.env.GOOGLE_SEARCH_API_KEY;
const SEARCH_ENGINE_ID = process.env.SEARCH_ENGINE_ID;

async function getSearchResults(query: string, numResults = 1) {
  const url = `https://www.googleapis.com/customsearch/v1?q=${query}&key=${GOOGLE_API_KEY}&cx=${SEARCH_ENGINE_ID}&num=${numResults}`;

  try {
    const response = await axios.get(url);
    const results = response.data.items.map((item: any) => item.link);

    return results;
  } catch (error) {
    console.error("Error fetching search results:", error);
    return [];
  }
}

async function scrapeWebsite(url: string): Promise<string> {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);

    // Example: Scraping paragraph text (you can customize as per your needs)
    const text = $("p").text();
    return text;
  } catch (error) {
    console.error(`Error scraping ${url}:`, error);
    return "";
  }
}

async function summarizeText(text: string): Promise<string> {
  const prompt = `Summarize the following text in a concise manner, highlighting the key points:

${text}

Summary:`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 150,
    });
    console.log(response);
    return response.choices[0].message.content || "No summary generated.";
  } catch (error) {
    console.error("Error in summarizing text:", error);
    return "Error in generating summary.";
  }
}

export async function POST(request: Request) {
  try {
    const { searchWord } = await request.json();
    if (!searchWord) {
      return NextResponse.json(
        { error: "Search word is required" },
        { status: 400 },
      );
    }

    const urls = await getSearchResults(searchWord);
    const scrapedContent = [];

    for (const url of urls) {
      const text = await scrapeWebsite(url);
      console.log(`Content from ${url}:`, text.substring(0, 500)); // Display first 500 characters for brevity
      const summary = await summarizeText(text);
      console.log(`Summary from ${url}:`, summary);
      scrapedContent.push({ url, text, summary });
    }

    return NextResponse.json({ content: scrapedContent });
  } catch (error) {
    console.error("Error in scrape route:", error);
    return NextResponse.json(
      { error: "An error occurred while scraping" },
      { status: 500 },
    );
  }
}

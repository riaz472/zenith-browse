'use server';
/**
 * @fileOverview This file implements a Genkit flow for summarizing webpage content.
 *
 * - summarizeWebpage - A function that summarizes webpage content and extracts key takeaways.
 * - SummarizeWebpageInput - The input type for the summarizeWebpage function.
 * - SummarizeWebpageOutput - The return type for the summarizeWebpage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeWebpageInputSchema = z.object({
  webpageContent: z
    .string()
    .describe('The full text content of the webpage to be summarized.'),
  webpageUrl:
    z.string().url().optional().describe('The URL of the webpage, if available, for additional context.'),
});
export type SummarizeWebpageInput = z.infer<typeof SummarizeWebpageInputSchema>;

const SummarizeWebpageOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the webpage content.'),
  keyTakeaways:
    z.array(z.string()).describe('A list of key takeaways or main points from the webpage.'),
});
export type SummarizeWebpageOutput = z.infer<typeof SummarizeWebpageOutputSchema>;

export async function summarizeWebpage(
  input: SummarizeWebpageInput
): Promise<SummarizeWebpageOutput> {
  return summarizeWebpageFlow(input);
}

const summarizeWebpagePrompt = ai.definePrompt({
  name: 'summarizeWebpagePrompt',
  input: {schema: SummarizeWebpageInputSchema},
  output: {schema: SummarizeWebpageOutputSchema},
  prompt: `You are an AI assistant specialized in summarizing web content. Your task is to provide a concise summary and extract key takeaways from the provided webpage text.

{{#if webpageUrl}}
Webpage URL: {{{webpageUrl}}}
{{/if}}

Webpage Content:
{{{webpageContent}}}

Please provide:
1. A concise summary of the main content.
2. A list of key takeaways or main points.
`,
});

const summarizeWebpageFlow = ai.defineFlow(
  {
    name: 'summarizeWebpageFlow',
    inputSchema: SummarizeWebpageInputSchema,
    outputSchema: SummarizeWebpageOutputSchema,
  },
  async (input) => {
    const {output} = await summarizeWebpagePrompt(input);
    return output!;
  }
);

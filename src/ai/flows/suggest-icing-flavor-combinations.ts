'use server';
/**
 * @fileOverview Suggests icing flavor combinations based on custom order details.
 *
 * - suggestIcingFlavorCombinations - A function that suggests icing flavor combinations.
 * - SuggestIcingFlavorCombinationsInput - The input type for the suggestIcingFlavorCombinations function.
 * - SuggestIcingFlavorCombinationsOutput - The return type for the suggestIcingFlavorCombinations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestIcingFlavorCombinationsInputSchema = z.object({
  productType: z
    .string()
    .describe('The type of product, e.g., cake, cupcakes, etc.'),
  desiredFlavor: z.string().describe('The desired flavor profile, e.g., sweet, fruity, chocolatey.'),
});
export type SuggestIcingFlavorCombinationsInput = z.infer<
  typeof SuggestIcingFlavorCombinationsInputSchema
>;

const SuggestIcingFlavorCombinationsOutputSchema = z.object({
  suggestedCombinations: z
    .array(z.string())
    .describe('An array of suggested icing flavor combinations.'),
});
export type SuggestIcingFlavorCombinationsOutput = z.infer<
  typeof SuggestIcingFlavorCombinationsOutputSchema
>;

export async function suggestIcingFlavorCombinations(
  input: SuggestIcingFlavorCombinationsInput
): Promise<SuggestIcingFlavorCombinationsOutput> {
  return suggestIcingFlavorCombinationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestIcingFlavorCombinationsPrompt',
  input: {schema: SuggestIcingFlavorCombinationsInputSchema},
  output: {schema: SuggestIcingFlavorCombinationsOutputSchema},
  prompt: `You are a pastry chef specializing in creating unique icing flavor combinations.

  Based on the customer's custom order details, suggest icing flavor combinations that would complement the product and desired flavor profile.

  Product Type: {{{productType}}}
  Desired Flavor: {{{desiredFlavor}}}

  Suggest at least 3 flavor combinations.
  `,
});

const suggestIcingFlavorCombinationsFlow = ai.defineFlow(
  {
    name: 'suggestIcingFlavorCombinationsFlow',
    inputSchema: SuggestIcingFlavorCombinationsInputSchema,
    outputSchema: SuggestIcingFlavorCombinationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

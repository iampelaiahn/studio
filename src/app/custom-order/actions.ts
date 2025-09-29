"use server";

import { suggestIcingFlavorCombinations, SuggestIcingFlavorCombinationsInput } from "@/ai/flows/suggest-icing-flavor-combinations";
import { z } from "zod";

const actionInputSchema = z.object({
  productType: z.string().min(1, "Product type is required."),
  desiredFlavor: z.string().min(1, "Desired flavor is required."),
});

type SuggestionsResult = {
  suggestions?: string[];
  error?: string;
};

export async function getIcingSuggestions(input: SuggestIcingFlavorCombinationsInput): Promise<SuggestionsResult> {
    const parsedInput = actionInputSchema.safeParse(input);
    if (!parsedInput.success) {
        const issues = parsedInput.error.issues.map(i => i.message).join(' ');
        return { error: `Invalid input: ${issues}` };
    }
    
    try {
        const result = await suggestIcingFlavorCombinations(parsedInput.data);
        if (!result.suggestedCombinations || result.suggestedCombinations.length === 0) {
            return { error: "No suggestions could be generated. Please try a different flavor." };
        }
        return { suggestions: result.suggestedCombinations };
    } catch (e) {
        console.error("AI Error:", e);
        return { error: "Failed to get suggestions from AI. Please try again." };
    }
}

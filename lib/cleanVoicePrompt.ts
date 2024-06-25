// Function to clean up the voice prompt
export default function cleanVoicePrompt(prompt: string): string {
  // Replace multiple spaces with a single space, replace newlines with spaces, and trim the string
  return prompt
    .replace(/\s+/g, " ") // Replace multiple spaces with a single space
    .replace(/\n/g, " ") // Replace newline characters with spaces
    .trim() // Trim leading and trailing whitespace
}

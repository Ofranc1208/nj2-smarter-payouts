// Chat helpers for Mint chatbot. Shared by MyChatComponent.

export const followupTopics: string[] = [
  "Understanding structured settlements",
  "How the early payout process works",
  "How to compare offers and quotes",
  "What to look for in structured settlement companies (ethical practices)",
  "Common mistakes to avoid when selling structured settlements"
];

export function splitIntoParagraphs(text: string): string[] {
  if (text.includes("\n\n")) {
    return text.split(/\n\n+/).map(p => p.trim()).filter(Boolean);
  }
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const paragraphs: string[] = [];
  let current = "";
  for (let i = 0; i < sentences.length; i++) {
    current += sentences[i].trim() + " ";
    if ((i + 1) % 2 === 0 || i === sentences.length - 1) {
      paragraphs.push(current.trim());
      current = "";
    }
  }
  return paragraphs;
}

export function renderAssistantParagraphs(paragraphs: string[], keyPrefix = "para"): JSX.Element[] {
  return paragraphs.map((p, i) => (
    <p key={`${keyPrefix}-${i}`} className="mb-2 text-gray-800 dark:text-gray-100">{p}</p>
  ));
}

export function shouldAppendCalculatorCTA(content: string): boolean {
  return /calculator|quote|how much|worth|value|estimate|payout/i.test(content);
} 
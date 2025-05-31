import React from 'react';
// Chat helpers for Mint chatbot. Shared by MyChatComponent.

export const followupTopics: string[] = [
  "Understanding structured settlements",
  "How the early payout process works",
  "How to compare offers and quotes",
  "What to look for in structured settlement companies (ethical practices)",
  "Common mistakes to avoid when selling structured settlements"
];

export function splitIntoParagraphs(text: string): string[] {
  // First, split on double newlines (paragraphs)
  let paragraphs = text.split(/\n\n+/).map(p => p.trim()).filter(Boolean);
  let result: string[] = [];
  paragraphs.forEach(para => {
    // If this paragraph looks like a numbered or bulleted list, split further
    // Numbered: lines starting with 1. 2. 3. etc.
    // Bulleted: lines starting with - or *
    if (/^(\d+\.|[-*]) /.test(para) || para.match(/\n(\d+\.|[-*]) /)) {
      // Split into lines
      const lines = para.split(/\n/).map(l => l.trim()).filter(Boolean);
      let buffer = '';
      lines.forEach(line => {
        if (/^(\d+\.|[-*]) /.test(line)) {
          if (buffer) result.push(buffer);
          buffer = line;
        } else {
          buffer += ' ' + line;
        }
      });
      if (buffer) result.push(buffer);
    } else {
      result.push(para);
    }
  });
  return result;
}

export function renderAssistantParagraphs(paragraphs: string[], keyPrefix = "para"): JSX.Element[] {
  return paragraphs.map((p, i) => (
    <p key={`${keyPrefix}-${i}`} className="mb-2 text-gray-800 dark:text-gray-100">{p}</p>
  ));
}

export function shouldAppendCalculatorCTA(content: string): boolean {
  return /calculator|quote|how much|worth|value|estimate|payout/i.test(content);
} 
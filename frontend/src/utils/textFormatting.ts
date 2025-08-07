/**
 * Smart text formatting utilities for chat messages
 */

export const formatMessageText = (text: string): string => {
  if (!text || text.length === 0) return text;

  // Capitalize first letter of the entire message
  let formatted = text.charAt(0).toUpperCase() + text.slice(1);

  // Capitalize first letter after sentence endings (. ! ?) followed by space
  formatted = formatted.replace(
    /([.!?]\s+)([a-z])/g,
    (_match, punctuation, letter) => {
      return punctuation + letter.toUpperCase();
    }
  );

  // Capitalize "i" ONLY when it's a standalone word (surrounded by word boundaries)
  // This prevents capitalizing "i" in words like "this", "is", "it", etc.
  formatted = formatted.replace(/\b[iI]\b/g, 'I');

  return formatted;
};

export const formatInputText = (
  text: string,
  cursorPosition: number
): { text: string; newCursorPosition: number } => {
  // Only apply minimal formatting during typing to avoid disruption
  let formatted = text;

  // Only capitalize first letter if it's lowercase
  if (
    formatted.length > 0 &&
    formatted.charAt(0) !== formatted.charAt(0).toUpperCase()
  ) {
    formatted = formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }

  // Only capitalize "i" when it's a standalone word (surrounded by word boundaries)
  // This prevents capitalizing "i" in words like "this", "is", "it", etc.
  // const originalFormatted = formatted;
  formatted = formatted.replace(/\b[iI]\b/g, 'I');

  // Only capitalize after sentence endings if there's already a space and lowercase letter
  formatted = formatted.replace(
    /([.!?]\s+)([a-z])/g,
    (_match, punctuation, letter) => {
      return punctuation + letter.toUpperCase();
    }
  );

  const lengthDifference = formatted.length - text.length;

  return {
    text: formatted,
    newCursorPosition: Math.max(0, cursorPosition + lengthDifference),
  };
};

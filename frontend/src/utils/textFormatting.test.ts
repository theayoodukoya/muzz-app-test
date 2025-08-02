import { describe, it, expect } from 'vitest';
import { formatMessageText, formatInputText } from './textFormatting';

describe('textFormatting', () => {
  describe('formatMessageText', () => {
    it('should capitalize first letter of message', () => {
      expect(formatMessageText('hello world')).toBe('Hello world');
    });

    it('should capitalize after sentence endings', () => {
      expect(formatMessageText('hello. how are you?')).toBe(
        'Hello. How are you?'
      );
      expect(formatMessageText('great! what about you?')).toBe(
        'Great! What about you?'
      );
    });

    it('should capitalize standalone "i"', () => {
      expect(formatMessageText('i am fine')).toBe('I am fine');
      expect(formatMessageText('how are i doing')).toBe('How are I doing');
    });

    it('should not capitalize "i" in words', () => {
      expect(formatMessageText('this is nice')).toBe('This is nice');
      expect(formatMessageText('it is working')).toBe('It is working');
    });

    it('should handle empty or null input', () => {
      expect(formatMessageText('')).toBe('');
      expect(formatMessageText(null as any)).toBe(null);
    });

    it('should handle complex sentences', () => {
      const input = 'hello! i hope you are well. how is everything?';
      const expected = 'Hello! I hope you are well. How is everything?';
      expect(formatMessageText(input)).toBe(expected);
    });
  });

  describe('formatInputText', () => {
    it('should format text and maintain cursor position', () => {
      const result = formatInputText('hello world', 5);
      expect(result.text).toBe('Hello world');
      expect(result.newCursorPosition).toBe(5);
    });

    it('should adjust cursor position when text length changes', () => {
      const result = formatInputText('i am typing', 1);
      expect(result.text).toBe('I am typing');
      expect(result.newCursorPosition).toBe(1);
    });
  });
});

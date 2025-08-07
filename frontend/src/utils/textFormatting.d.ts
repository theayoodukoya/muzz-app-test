/**
 * Smart text formatting utilities for chat messages
 */
export declare const formatMessageText: (text: string) => string;
export declare const formatInputText: (text: string, cursorPosition: number) => {
    text: string;
    newCursorPosition: number;
};

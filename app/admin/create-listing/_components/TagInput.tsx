"use client";

import { useState, KeyboardEvent } from "react";

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  suggestions?: string[];
}

export default function TagInput({
  tags,
  onChange,
  placeholder = "Type and press Enter to add",
  suggestions = [],
}: TagInputProps) {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = suggestions.filter(
    (s) =>
      s.toLowerCase().includes(inputValue.toLowerCase()) &&
      !tags.includes(s)
  );

  const addTag = (value: string) => {
    const trimmed = value.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInputValue("");
    setShowSuggestions(false);
  };

  const removeTag = (index: number) => {
    onChange(tags.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  return (
    <div className="relative">
      <div className="min-h-11 w-full rounded-md border border-gray-300 bg-white px-3 py-2 flex flex-wrap gap-1.5 focus-within:ring-2 focus-within:ring-cobalt-500 focus-within:border-cobalt-500">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="inline-flex items-center gap-1 rounded-full bg-cobalt-500/15 px-2.5 py-0.5 text-sm font-medium text-cobalt-700"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="ml-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full text-cobalt-500 hover:bg-cobalt-500/20 hover:text-cobalt-700 focus:outline-none"
              aria-label={`Remove ${tag}`}
            >
              <svg className="h-3 w-3" viewBox="0 0 12 12" fill="currentColor">
                <path d="M4.22 4.22a.75.75 0 0 1 1.06 0L6 5.94l.72-.72a.75.75 0 1 1 1.06 1.06L7.06 7l.72.72a.75.75 0 1 1-1.06 1.06L6 8.06l-.72.72a.75.75 0 0 1-1.06-1.06L4.94 7l-.72-.72a.75.75 0 0 1 0-1.06z" />
              </svg>
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            setShowSuggestions(e.target.value.length > 0 && suggestions.length > 0);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (inputValue.length > 0 && suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="flex-1 min-w-32 border-none bg-transparent text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-0 p-0"
        />
      </div>

      {showSuggestions && filteredSuggestions.length > 0 && (
        <ul className="absolute z-10 mt-1 w-full rounded-md border border-gray-200 bg-white shadow-lg max-h-48 overflow-auto">
          {filteredSuggestions.map((suggestion) => (
            <li key={suggestion}>
              <button
                type="button"
                onMouseDown={() => addTag(suggestion)}
                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-cobalt-50/10 hover:text-cobalt-600"
              >
                {suggestion}
              </button>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-1 text-xs text-gray-500">
        Press Enter or comma to add. Backspace to remove last.
      </p>
    </div>
  );
}

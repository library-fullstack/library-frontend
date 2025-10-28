import { useState, useEffect, useCallback, useRef } from "react";
import { booksApi } from "../../features/books/api";
import type { Book } from "../../features/books/types";

interface UseBookSearchReturn {
  query: string;
  setQuery: (query: string) => void;
  results: Book[];
  isLoading: boolean;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  handleSearch: () => void;
  clearSearch: () => void;
}

const DEBOUNCE_DELAY = 300;
const MIN_SEARCH_LENGTH = 2;
const MAX_SUGGESTIONS = 8;

export function useBookSearch(): UseBookSearchReturn {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchSearchResults = useCallback(async (searchQuery: string) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    setIsLoading(true);

    try {
      const data = await booksApi.getAllBooks({
        keyword: searchQuery.trim(),
        limit: MAX_SUGGESTIONS,
        offset: 0,
      });

      const bookResults = Array.isArray(data) ? data : [];
      setResults(bookResults);
      setIsOpen(bookResults.length > 0);
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Search error:", error);
        setResults([]);
        setIsOpen(false);
      }
    } finally {
      setIsLoading(false);
      abortControllerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (query.trim().length < MIN_SEARCH_LENGTH) {
      setResults([]);
      setIsOpen(false);
      setIsLoading(false);
      return;
    }

    debounceTimerRef.current = setTimeout(() => {
      fetchSearchResults(query);
    }, DEBOUNCE_DELAY);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [query, fetchSearchResults]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const handleSearch = useCallback(() => {
    if (query.trim().length >= MIN_SEARCH_LENGTH) {
      setIsOpen(false);
    }
  }, [query]);

  const clearSearch = useCallback(() => {
    setQuery("");
    setResults([]);
    setIsOpen(false);
    setIsLoading(false);
  }, []);

  return {
    query,
    setQuery,
    results,
    isLoading,
    isOpen,
    setIsOpen,
    handleSearch,
    clearSearch,
  };
}

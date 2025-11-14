import { useCallback, useRef, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Book } from "../types";
import axiosClient from "../../../shared/api/axiosClient";
import logger from "../../../shared/lib/logger";

export interface AdvancedSearchParams {
  keyword: string;
  searchType?: "all" | "author" | "title" | "publisher";
  category_id?: number;
  status?: string;
  sort_by?:
    | "newest"
    | "oldest"
    | "newest_added"
    | "oldest_added"
    | "title_asc"
    | "title_desc"
    | "popular";
  limit?: number;
}

interface SearchSuggestion {
  id: number;
  title: string;
  author: string;
  type: "book" | "author" | "category";
}

class SearchService {
  async searchBooks(params: AdvancedSearchParams): Promise<Book[]> {
    try {
      logger.info("[Search] Đang tìm kiếm với tham số:", params);

      const cleanParams = Object.fromEntries(
        Object.entries(params).filter(
          ([, value]) => value !== null && value !== undefined
        )
      );

      const res = await axiosClient.get<Book[]>("/books", {
        params: cleanParams,
      });

      logger.info("[Search] Đã tìm thấy", res.data?.length || 0, "kết quả");
      return res.data || [];
    } catch (err) {
      logger.error("[Search] Thất bại:", err);
      throw err;
    }
  }

  async getSuggestions(keyword: string): Promise<SearchSuggestion[]> {
    try {
      if (!keyword || keyword.length < 2) {
        return [];
      }

      logger.info("[Search] Getting suggestions for:", keyword);

      const res = await axiosClient.get<SearchSuggestion[]>(
        "/books/suggestions",
        {
          params: { keyword, limit: 10 },
        }
      );

      return res.data || [];
    } catch (err) {
      logger.error("[Search] Thất bại khi lấy gợi ý:", err);
      return [];
    }
  }
}

export const searchService = new SearchService();

export function useAdvancedSearch(debounceMs: number = 300) {
  const [query, setQuery] = useState("");
  const [params, setParams] = useState<AdvancedSearchParams>({
    keyword: "",
  });
  const debounceTimerRef = useRef<NodeJS.Timeout>();

  const handleSearch = useCallback(
    (searchQuery: string, searchParams?: Partial<AdvancedSearchParams>) => {
      setQuery(searchQuery);

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        setParams((prev) => ({
          ...prev,
          keyword: searchQuery,
          ...searchParams,
        }));
      }, debounceMs);
    },
    [debounceMs]
  );

  const {
    data: results = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["books-search", params],
    queryFn: () => searchService.searchBooks(params),
    enabled: params.keyword.length >= 1,
    staleTime: 30000,
    gcTime: 5 * 60 * 1000,
  });

  const clearSearch = useCallback(() => {
    setQuery("");
    setParams({ keyword: "" });
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
  }, []);

  return {
    query,
    results,
    isLoading,
    error,
    handleSearch,
    clearSearch,
    setParams,
  };
}

export function useSearchSuggestions(
  keyword: string,
  debounceMs: number = 200
) {
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const debounceTimerRef = useRef<NodeJS.Timeout>();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!keyword || keyword.length < 2) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);

    debounceTimerRef.current = setTimeout(async () => {
      try {
        const results = await searchService.getSuggestions(keyword);
        setSuggestions(results);
        setError(null);
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        logger.error("[Suggestions] Error:", error);
      } finally {
        setIsLoading(false);
      }
    }, debounceMs);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [keyword, debounceMs]);

  return { suggestions, isLoading, error };
}

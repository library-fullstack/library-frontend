import React, {
  createContext,
  useCallback,
  useState,
  useEffect,
  useRef,
} from "react";
import { favouritesApi } from "../features/favourites/api/favourites.api";
import { AuthContext } from "./AuthContext.context";
import logger from "../shared/lib/logger";
import { STORAGE_KEYS } from "../shared/lib/storageKeys";

export interface FavouriteItem {
  id: number;
  user_id: string;
  book_id: number;
  title: string;
  author_names?: string | null;
  thumbnail_url?: string | null;
  description?: string | null;
  isbn?: string | null;
  publisher_name?: string | null;
  publication_date?: string | null;
  available_count?: number | null;
  created_at: string;
  updated_at: string;
}

interface FavouritesApiResponse {
  success: boolean;
  data: FavouriteItem[];
}

interface FavouritesResponse {
  data: FavouritesApiResponse;
}

export interface FavouritesContextType {
  favourites: FavouriteItem[];
  loading: boolean;
  isFavourite: (bookId: number) => boolean;
  addFavourite: (bookId: number) => Promise<void>;
  removeFavourite: (bookId: number) => Promise<void>;
  toggleFavourite: (bookId: number) => Promise<void>;
  refetch: () => Promise<void>;
}

const FavouritesContext = createContext<FavouritesContextType | undefined>(
  undefined
);

const FAVOURITES_STORAGE_KEY = STORAGE_KEYS.favourites?.state || "favourites";
const EMPTY_FAVOURITES: FavouriteItem[] = [];

const getStoredFavourites = (): FavouriteItem[] => {
  try {
    const stored = localStorage.getItem(FAVOURITES_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      logger.debug("[FavouritesContext] Loaded from localStorage");
      return parsed;
    }
  } catch (error) {
    logger.error(
      "[FavouritesContext] Failed to parse stored favourites:",
      error
    );
  }
  logger.debug("[FavouritesContext] No stored favourites, returning empty");
  return [...EMPTY_FAVOURITES];
};

const saveFavouritesToStorage = (favourites: FavouriteItem[]): void => {
  try {
    logger.debug("[FavouritesContext] Saving to localStorage");
    localStorage.setItem(FAVOURITES_STORAGE_KEY, JSON.stringify(favourites));
  } catch (error) {
    logger.error(
      "[FavouritesContext] Failed to save favourites to localStorage:",
      error
    );
  }
};

const clearFavouritesStorage = (): void => {
  try {
    logger.debug("[FavouritesContext] Clearing localStorage");
    localStorage.removeItem(FAVOURITES_STORAGE_KEY);
  } catch (error) {
    logger.error(
      "[FavouritesContext] Failed to clear favourites from localStorage:",
      error
    );
  }
};

interface FavouritesProviderProps {
  children: React.ReactNode;
}

export const FavouritesProvider: React.FC<FavouritesProviderProps> = ({
  children,
}) => {
  const authContext = React.useContext(AuthContext);
  const user = authContext?.user;
  const authLoading = false;
  const [favourites, setFavourites] = useState<FavouriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const hasFetchedRef = useRef(false);
  const isRefetchingRef = useRef(false);

  const refetch = useCallback(async () => {
    if (!user?.id) {
      logger.debug("[FavouritesContext] No user, skipping refetch");
      setFavourites([]);
      setLoading(false);
      return;
    }

    if (isRefetchingRef.current) {
      logger.debug("[FavouritesContext] Refetch already in progress, skipping");
      return;
    }

    isRefetchingRef.current = true;
    logger.info("[FavouritesContext] Refetching favourites from API");

    try {
      const response = (await favouritesApi.getAll()) as FavouritesResponse;
      if (response.data?.success) {
        logger.info(
          `[FavouritesContext] Fetched ${
            response.data.data?.length || 0
          } favourites`
        );
        const newFavourites = response.data.data || [];
        setFavourites(newFavourites);
        saveFavouritesToStorage(newFavourites);
      } else {
        logger.warn("[FavouritesContext] Fetch favourites failed:", response);
        const storedFavourites = getStoredFavourites();
        setFavourites(storedFavourites);
      }
    } catch (error: unknown) {
      logger.error("[FavouritesContext] Error fetching favourites:", error);
      const storedFavourites = getStoredFavourites();
      setFavourites(storedFavourites);
    } finally {
      setLoading(false);
      isRefetchingRef.current = false;
    }
  }, [user?.id]);

  useEffect(() => {
    if (authLoading) {
      logger.debug("[FavouritesContext] Auth still loading, waiting...");
      return;
    }

    if (!user?.id) {
      logger.info("[FavouritesContext] No user logged in, clearing favourites");
      setFavourites([]);
      clearFavouritesStorage();
      setLoading(false);
      hasFetchedRef.current = false;
      return;
    }

    if (hasFetchedRef.current) {
      logger.debug(
        "[FavouritesContext] Already fetched, skipping initial fetch"
      );
      return;
    }

    logger.info("[FavouritesContext] User logged in, fetching favourites");
    hasFetchedRef.current = true;

    const storedFavourites = getStoredFavourites();
    if (storedFavourites.length > 0) {
      logger.debug(
        `[FavouritesContext] Using stored favourites (${storedFavourites.length} items)`
      );
      setFavourites(storedFavourites);
      setLoading(false);
    }

    refetch();
  }, [user?.id, authLoading, refetch]);

  const isFavourite = useCallback(
    (bookId: number): boolean => {
      return favourites.some((fav) => fav.book_id === bookId);
    },
    [favourites]
  );

  const addFavourite = useCallback(
    async (bookId: number) => {
      if (!user?.id) {
        logger.warn(
          "[FavouritesContext] Cannot add favourite: User not logged in"
        );
        throw new Error("User not logged in");
      }

      logger.info(`[FavouritesContext] Adding favourite for book ${bookId}`);

      try {
        const response = (await favouritesApi.add(
          bookId
        )) as FavouritesResponse;
        if (response.data?.success) {
          logger.info(
            `[FavouritesContext] Successfully added favourite for book ${bookId}`
          );
          const newFavourites = response.data.data || [];
          setFavourites(newFavourites);
          saveFavouritesToStorage(newFavourites);
        } else {
          logger.error(
            "[FavouritesContext] Failed to add favourite:",
            response
          );
          throw new Error("Failed to add favourite");
        }
      } catch (error: unknown) {
        logger.error("[FavouritesContext] Error adding favourite:", error);
        throw error;
      }
    },
    [user?.id]
  );

  const removeFavourite = useCallback(
    async (bookId: number) => {
      if (!user?.id) {
        logger.warn(
          "[FavouritesContext] Cannot remove favourite: User not logged in"
        );
        throw new Error("User not logged in");
      }

      logger.info(`[FavouritesContext] Removing favourite for book ${bookId}`);

      try {
        const response = await favouritesApi.remove(bookId);
        if ((response.data as any)?.success) {
          logger.info(
            `[FavouritesContext] Successfully removed favourite for book ${bookId}`
          );
          const newFavourites = (response.data as any)?.data || [];
          setFavourites(newFavourites);
          saveFavouritesToStorage(newFavourites);
        } else {
          logger.error(
            "[FavouritesContext] Failed to remove favourite:",
            response
          );
          throw new Error("Failed to remove favourite");
        }
      } catch (error: unknown) {
        logger.error("[FavouritesContext] Error removing favourite:", error);
        throw error;
      }
    },
    [user?.id]
  );

  const toggleFavourite = useCallback(
    async (bookId: number) => {
      if (isFavourite(bookId)) {
        await removeFavourite(bookId);
      } else {
        await addFavourite(bookId);
      }
    },
    [isFavourite, addFavourite, removeFavourite]
  );

  const value: FavouritesContextType = {
    favourites,
    loading,
    isFavourite,
    addFavourite,
    removeFavourite,
    toggleFavourite,
    refetch,
  };

  return (
    <FavouritesContext.Provider value={value}>
      {children}
    </FavouritesContext.Provider>
  );
};

export default FavouritesContext;

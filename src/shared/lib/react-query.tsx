import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { ReactNode } from "react";
import { queryClient } from "./queryClient";
import logger from "./logger";
import { STORAGE_KEYS } from "./storageKeys";

const persister = createSyncStoragePersister({
  storage: window.localStorage,
  key: STORAGE_KEYS.reactQuery.offlineCache,
  serialize: JSON.stringify,
  deserialize: JSON.parse,
});

const PERSISTABLE_QUERY_KEYS = ["books", "categories", "banners"];

interface QueryProviderProps {
  children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister,
        maxAge: 1000 * 60 * 60 * 24,
        buster: "v1",
        dehydrateOptions: {
          shouldDehydrateQuery: (query) => {
            const queryKey = query.queryKey[0];

            if (queryKey === "user" || queryKey === "cart") {
              logger.debug(
                `[QueryProvider] Skipping ${String(
                  queryKey
                )} cache persistence (user-specific)`
              );
              return false;
            }

            if (typeof queryKey === "string") {
              const shouldPersist = PERSISTABLE_QUERY_KEYS.includes(queryKey);
              if (!shouldPersist) {
                logger.debug(
                  `[QueryProvider] Skipping ${queryKey} cache persistence (not whitelisted)`
                );
              }
              return shouldPersist;
            }

            logger.debug(
              `[QueryProvider] Skipping complex query key cache persistence`,
              queryKey
            );
            return false;
          },
        },
      }}
    >
      {children}
      {import.meta.env.DEV && (
        <ReactQueryDevtools
          initialIsOpen={false}
          buttonPosition="bottom-left"
          position="bottom"
        />
      )}
    </PersistQueryClientProvider>
  );
}

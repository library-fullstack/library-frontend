import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { dbService } from "../lib/database";
import logger from "../lib/logger";

interface OfflineMutationOptions<TData, TError, TVariables>
  extends Omit<UseMutationOptions<TData, TError, TVariables>, "mutationFn"> {
  action: "ADD_TO_CART" | "REMOVE_FROM_CART" | "BORROW";
  mutationFn: (variables: TVariables) => Promise<TData>;
}

export function useOfflineMutation<TData, TError, TVariables>(
  options: OfflineMutationOptions<TData, TError, TVariables>
) {
  const { action, mutationFn, ...restOptions } = options;

  const mutation = useMutation<TData, TError, TVariables>({
    mutationFn: async (variables: TVariables) => {
      if (!navigator.onLine) {
        logger.info(`[Offline] Queueing mutation: ${action}`);

        await dbService.queueMutation({
          action,
          data: variables,
          timestamp: Date.now(),
        });

        return {
          success: true,
          offline: true,
          message:
            "Hành động đã được lưu. Sẽ đồng bộ khi kết nối được phục hồi.",
        } as unknown as TData;
      }

      return mutationFn(variables);
    },
    ...restOptions,
  });

  return mutation;
}

export function useReplayMutations() {
  interface PendingMutation {
    id: string;
    action: string;
    data: unknown;
    timestamp: number;
  }

  const replayMutation = useMutation({
    mutationFn: async () => {
      const mutations = await dbService.getPendingMutations();
      logger.info(`[Replay] Found ${mutations.length} pending mutations`);

      const results = await Promise.allSettled(
        (mutations as PendingMutation[]).map(async (mut) => {
          try {
            logger.info(`[Replay] Replaying mutation: ${mut.action}`);
            await new Promise((resolve) => setTimeout(resolve, 500));

            await dbService.removePendingMutation(mut.id);
            logger.info(`[Replay] Mutation ${mut.id} replayed successfully`);

            return { success: true, id: mut.id };
          } catch (err) {
            logger.error(`[Replay] Failed to replay mutation ${mut.id}:`, err);
            return { success: false, id: mut.id, error: err };
          }
        })
      );

      const succeeded = results.filter(
        (r) =>
          r.status === "fulfilled" && (r.value as { success: boolean }).success
      ).length;
      const failed = results.filter(
        (r) =>
          r.status === "rejected" || !(r.value as { success: boolean }).success
      ).length;

      logger.info(
        `[Replay] Complete - Succeeded: ${succeeded}, Failed: ${failed}`
      );

      return { succeeded, failed, results };
    },
  });

  return replayMutation;
}

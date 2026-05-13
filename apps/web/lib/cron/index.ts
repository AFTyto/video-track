import { Client } from "@upstash/qstash";

// lazily initialize qstash to avoid build-time errors
let _qstash: Client | null = null;

function getQStash(): Client {
  if (!_qstash) {
    const token = process.env.QSTASH_TOKEN;
    if (!token) {
      // Return a mock client that won't fail during build
      return {
        publishJSON: async () => ({ messageId: "mock" }),
        queue: () => ({ enqueueJSON: async () => ({ messageId: "mock" }) } as any),
        batchJSON: async () => [] as any,
      } as unknown as Client;
    }
    _qstash = new Client({ token });
  }
  return _qstash;
}

export const qstash = {
  publishJSON: (...args: Parameters<Client["publishJSON"]>) => getQStash().publishJSON(...args),
  queue: (options: { queueName: string }) => getQStash().queue(options),
  batchJSON: (...args: Parameters<Client["batchJSON"]>) => getQStash().batchJSON(...args),
};

// Default batch size for cron jobs that process records in batches
export const CRON_BATCH_SIZE = 100;

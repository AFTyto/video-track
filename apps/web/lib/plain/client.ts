import { PlainClient } from "@team-plain/typescript-sdk";

let _client: PlainClient | null = null;

function getPlainClient(): PlainClient {
  if (!_client) {
    _client = new PlainClient({
      apiKey: process.env.PLAIN_API_KEY as string,
    });
  }
  return _client;
}

export function getPlain() {
  return getPlainClient();
}

export type PlainUser = {
  id: string;
  name: string | null;
  email: string | null;
};

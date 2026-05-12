import { punyEncode } from "@dub/utils";
import {
  decodeKeyIfCaseSensitive,
  encodeKey,
  isCaseSensitiveDomain,
} from "../api/links/case-sensitivity";
import { conn } from "./connection";
import { EdgeLinkProps, EdgeLinkWithWebhooks } from "./types";

const getLinkViaEdgeHelper = async ({
  domain,
  key,
}: {
  domain: string;
  key: string;
}): Promise<EdgeLinkWithWebhooks | null> => {
  const isCaseSensitive = isCaseSensitiveDomain(domain);
  const keyToQuery = isCaseSensitive
    ? encodeKey(key)
    : punyEncode(decodeURIComponent(key));

  const rows =
    (await conn`SELECT Link.*, LinkWebhook.webhookId
       FROM "Link"
       LEFT JOIN "LinkWebhook" ON Link.id = LinkWebhook.linkId
       WHERE Link.domain = ${domain} AND Link.key = ${keyToQuery}`) as EdgeLinkProps[];

  if (!rows || !Array.isArray(rows) || rows.length === 0) return null;

  const first = rows[0] as EdgeLinkProps & { webhookId: string | null };
  const { webhookId: _w, ...link } = first;
  const webhooks = (rows as (EdgeLinkProps & { webhookId: string | null })[])
    .map((r) => r.webhookId)
    .filter((id): id is string => id != null)
    .map((webhookId) => ({ webhookId }));

  return {
    ...link,
    key: decodeKeyIfCaseSensitive({ domain, key }),
    webhooks,
  };
};

const inFlightLinkLookups = new Map<
  string,
  Promise<Awaited<ReturnType<typeof getLinkViaEdgeHelper>>>
>();

export const getLinkViaEdge = async ({
  domain,
  key,
}: {
  domain: string;
  key: string;
}): Promise<Awaited<ReturnType<typeof getLinkViaEdgeHelper>>> => {
  const lookupKey = `${domain}:${key}`;
  const existingLookup = inFlightLinkLookups.get(lookupKey);

  if (existingLookup) {
    console.log(`[getLinkViaEdge] ${lookupKey} - Existing lookup found`);
    return await existingLookup;
  }

  const lookupPromise = getLinkViaEdgeHelper({ domain, key }).finally(() => {
    inFlightLinkLookups.delete(lookupKey);
  });

  inFlightLinkLookups.set(lookupKey, lookupPromise);

  return await lookupPromise;
};

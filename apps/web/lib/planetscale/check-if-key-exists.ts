import { punyEncode } from "@dub/utils";
import {
  encodeKey,
  isCaseSensitiveDomain,
} from "../api/links/case-sensitivity";
import { conn } from "./connection";

export const checkIfKeyExists = async ({
  domain,
  key,
}: {
  domain: string;
  key: string;
}) => {
  const isCaseSensitive = isCaseSensitiveDomain(domain);
  const keyToQuery = isCaseSensitive
    ? encodeKey(key)
    : punyEncode(decodeURIComponent(key));

  const rows = (await conn`SELECT 1 FROM "Link" WHERE domain = ${domain} AND key = ${keyToQuery} LIMIT 1`) as { "1": number }[];

  return rows && Array.isArray(rows) && rows.length > 0;
};

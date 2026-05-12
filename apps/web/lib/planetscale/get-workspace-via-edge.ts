import { normalizeWorkspaceId } from "../api/workspaces/workspace-id";
import { WorkspaceProps } from "../types";
import { conn } from "./connection";

export const getWorkspaceViaEdge = async ({
  workspaceId,
  includeDomains = false,
}: {
  workspaceId: string;
  includeDomains?: boolean;
}) => {
  const workspaceIdNorm = normalizeWorkspaceId(workspaceId);
  let rows;

  if (includeDomains) {
    rows = (await conn`
      SELECT 
        w.*,
        d.slug
      FROM "Project" w
      LEFT JOIN "Domain" d ON w.id = d."projectId"
      WHERE w.id = ${workspaceIdNorm}
      LIMIT 100
    `) as any[];
  } else {
    rows = (await conn`
      SELECT w.* 
      FROM "Project" w 
      WHERE w.id = ${workspaceIdNorm} 
      LIMIT 1
    `) as any[];
  }

  if (!rows || !Array.isArray(rows) || rows.length === 0) {
    return null;
  }

  if (!includeDomains) {
    return rows[0] as WorkspaceProps;
  }

  const firstRow = rows[0];
  const workspaceData = { ...firstRow };
  const domains: { slug: string }[] = [];

  rows.forEach((row: any) => {
    if (row.slug) {
      domains.push({ slug: row.slug });
    }
  });

  const { slug, ...cleanWorkspaceData } = workspaceData;

  return {
    ...cleanWorkspaceData,
    domains,
  } as WorkspaceProps & { domains: { slug: string }[] };
};

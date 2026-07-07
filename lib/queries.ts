import { prisma } from "./prisma";
import { getResource } from "./resources";
import { SINGLE_USER_ID } from "./constants";

type AnyDelegate = { findMany: (a: unknown) => Promise<unknown[]> };

function delegate(model: string) {
  return (prisma as unknown as Record<string, AnyDelegate>)[model];
}

/** Fetch all rows for a config-driven resource, ordered per its config. */
export async function fetchRows(resourceKey: string, userId: string) {
  const resource = getResource(resourceKey);
  const rows = await delegate(resource.model).findMany({
    where: { userId },
    orderBy: resource.defaultOrderBy,
  });
  return rows as (Record<string, unknown> & { id: string })[];
}

/** Convenience for dashboards/reports that read several models at once. */
export function db() {
  return prisma;
}

export { SINGLE_USER_ID };

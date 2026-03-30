import Resolver from "@forge/resolver";
import { GCHeadDA, GCDA } from "../dataAccess/GoalCollectionDA";
import { GDA, GHeadDA } from "../dataAccess/GoalDA";

export const exportResolver = (resolver: Resolver) => {
  resolver.define('exportData', async ({ payload: { scopeId } }) => {
    const gcHead = await GCHeadDA.get(scopeId);
    if (!gcHead || !gcHead.goalCollectionIds || gcHead.goalCollectionIds.length === 0) {
      return { gcHead: { nextId: 0, goalCollectionIds: [] }, collections: [] };
    }

    const collections = await Promise.all(
      gcHead.goalCollectionIds.map(async (collectionId: string) => {
        const collection = await GCDA.get(scopeId, collectionId);
        const gHead = await GHeadDA.get(scopeId, collectionId);
        let goals: any[] = [];
        if (gHead && gHead.goalIds && gHead.goalIds.length > 0) {
          const results = await Promise.all(
            gHead.goalIds.map((id: string) => GDA.get(scopeId, collectionId, id))
          );
          goals = results.filter(Boolean);
        }
        return {
          collection,
          gHead: gHead ?? { nextId: 1, goalIds: [] },
          goals,
        };
      })
    );

    return { gcHead, collections };
  });
};

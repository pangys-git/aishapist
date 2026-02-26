import { AnalysisResult } from '../types';
import { openDB, IDBPDatabase } from 'idb';

const DB_NAME = 'ai_shapist_db';
const STORE_NAME = 'history';

async function getDB(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    },
  });
}

export const storageService = {
  async getResults(): Promise<AnalysisResult[]> {
    const db = await getDB();
    const results = await db.getAll(STORE_NAME);
    return results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  },

  async saveResult(result: AnalysisResult): Promise<boolean> {
    const db = await getDB();
    await db.put(STORE_NAME, result);
    return true;
  },

  async deleteResult(id: string): Promise<boolean> {
    const db = await getDB();
    await db.delete(STORE_NAME, id);
    return true;
  }
};

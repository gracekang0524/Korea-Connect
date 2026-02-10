import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import { 
  users, type User, type InsertUser,
  jobs, type Job, type InsertJob,
  housing, type Housing, type InsertHousing,
  marketplace, type MarketplaceItem, type InsertMarketplaceItem,
  guides, type Guide, type InsertGuide,
  favorites, type Favorite, type InsertFavorite
} from "@shared/schema";

export interface IStorage {
  // Jobs
  getJobs(): Promise<Job[]>;
  getJob(id: number): Promise<Job | undefined>;
  createJob(job: InsertJob): Promise<Job>;
  deleteJob(id: number): Promise<void>;

  // Housing
  getHousing(): Promise<Housing[]>;
  getHousingItem(id: number): Promise<Housing | undefined>;
  createHousing(housing: InsertHousing): Promise<Housing>;
  deleteHousing(id: number): Promise<void>;

  // Marketplace
  getMarketplaceItems(): Promise<MarketplaceItem[]>;
  getMarketplaceItem(id: number): Promise<MarketplaceItem | undefined>;
  createMarketplaceItem(item: InsertMarketplaceItem): Promise<MarketplaceItem>;
  deleteMarketplaceItem(id: number): Promise<void>;

  // Guides
  getGuides(category?: string): Promise<Guide[]>;
  getGuide(id: number): Promise<Guide | undefined>;
  createGuide(guide: InsertGuide): Promise<Guide>;

  // Favorites
  getFavorites(userId: string): Promise<Favorite[]>;
  createFavorite(favorite: InsertFavorite): Promise<Favorite>;
  deleteFavorite(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Jobs
  async getJobs(): Promise<Job[]> {
    return await db.select().from(jobs).orderBy(desc(jobs.createdAt));
  }
  async getJob(id: number): Promise<Job | undefined> {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
    return job;
  }
  async createJob(insertJob: InsertJob): Promise<Job> {
    const [job] = await db.insert(jobs).values(insertJob).returning();
    return job;
  }
  async deleteJob(id: number): Promise<void> {
    await db.delete(jobs).where(eq(jobs.id, id));
  }

  // Housing
  async getHousing(): Promise<Housing[]> {
    return await db.select().from(housing).orderBy(desc(housing.createdAt));
  }
  async getHousingItem(id: number): Promise<Housing | undefined> {
    const [item] = await db.select().from(housing).where(eq(housing.id, id));
    return item;
  }
  async createHousing(insertHousing: InsertHousing): Promise<Housing> {
    const [item] = await db.insert(housing).values(insertHousing).returning();
    return item;
  }
  async deleteHousing(id: number): Promise<void> {
    await db.delete(housing).where(eq(housing.id, id));
  }

  // Marketplace
  async getMarketplaceItems(): Promise<MarketplaceItem[]> {
    return await db.select().from(marketplace).orderBy(desc(marketplace.createdAt));
  }
  async getMarketplaceItem(id: number): Promise<MarketplaceItem | undefined> {
    const [item] = await db.select().from(marketplace).where(eq(marketplace.id, id));
    return item;
  }
  async createMarketplaceItem(insertItem: InsertMarketplaceItem): Promise<MarketplaceItem> {
    const [item] = await db.insert(marketplace).values(insertItem).returning();
    return item;
  }
  async deleteMarketplaceItem(id: number): Promise<void> {
    await db.delete(marketplace).where(eq(marketplace.id, id));
  }

  // Guides
  async getGuides(category?: string): Promise<Guide[]> {
    if (category) {
      return await db.select().from(guides).where(eq(guides.category, category));
    }
    return await db.select().from(guides);
  }
  async getGuide(id: number): Promise<Guide | undefined> {
    const [guide] = await db.select().from(guides).where(eq(guides.id, id));
    return guide;
  }
  async createGuide(insertGuide: InsertGuide): Promise<Guide> {
    const [guide] = await db.insert(guides).values(insertGuide).returning();
    return guide;
  }

  // Favorites
  async getFavorites(userId: string): Promise<Favorite[]> {
    return await db.select().from(favorites).where(eq(favorites.userId, userId));
  }
  async createFavorite(insertFavorite: InsertFavorite): Promise<Favorite> {
    const [favorite] = await db.insert(favorites).values(insertFavorite).returning();
    return favorite;
  }
  async deleteFavorite(id: number): Promise<void> {
    await db.delete(favorites).where(eq(favorites.id, id));
  }
}

export const storage = new DatabaseStorage();

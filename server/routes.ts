import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { isAuthenticated } from "./replit_integrations/auth";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Auth setup
  await setupAuth(app);
  registerAuthRoutes(app);

  // === JOBS ===
  app.get(api.jobs.list.path, async (req, res) => {
    const jobs = await storage.getJobs();
    res.json(jobs);
  });

  app.get(api.jobs.get.path, async (req, res) => {
    const job = await storage.getJob(Number(req.params.id));
    if (!job) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json(job);
  });

  app.post(api.jobs.create.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.jobs.create.input.parse(req.body);
      // Ensure user owns the content (although schema parsing might not catch this if userId is in body)
      // We should ideally overwrite userId from req.user for security, but the schema has it.
      // Let's assume the frontend sends it or we override it.
      const userId = (req.user as any).claims.sub;
      const job = await storage.createJob({ ...input, userId });
      res.status(201).json(job);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.jobs.delete.path, isAuthenticated, async (req, res) => {
    const job = await storage.getJob(Number(req.params.id));
    if (!job) return res.status(404).json({ message: "Job not found" });
    
    // Check ownership
    if (job.userId !== (req.user as any).claims.sub) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await storage.deleteJob(Number(req.params.id));
    res.status(204).send();
  });

  // === HOUSING ===
  app.get(api.housing.list.path, async (req, res) => {
    const housing = await storage.getHousing();
    res.json(housing);
  });

  app.get(api.housing.get.path, async (req, res) => {
    const item = await storage.getHousingItem(Number(req.params.id));
    if (!item) {
      return res.status(404).json({ message: 'Housing not found' });
    }
    res.json(item);
  });

  app.post(api.housing.create.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.housing.create.input.parse(req.body);
      const userId = (req.user as any).claims.sub;
      const item = await storage.createHousing({ ...input, userId });
      res.status(201).json(item);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.housing.delete.path, isAuthenticated, async (req, res) => {
    const item = await storage.getHousingItem(Number(req.params.id));
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.userId !== (req.user as any).claims.sub) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await storage.deleteHousing(Number(req.params.id));
    res.status(204).send();
  });

  // === MARKETPLACE ===
  app.get(api.marketplace.list.path, async (req, res) => {
    const items = await storage.getMarketplaceItems();
    res.json(items);
  });

  app.get(api.marketplace.get.path, async (req, res) => {
    const item = await storage.getMarketplaceItem(Number(req.params.id));
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  });

  app.post(api.marketplace.create.path, isAuthenticated, async (req, res) => {
    try {
      const input = api.marketplace.create.input.parse(req.body);
      const userId = (req.user as any).claims.sub;
      const item = await storage.createMarketplaceItem({ ...input, userId });
      res.status(201).json(item);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  app.delete(api.marketplace.delete.path, isAuthenticated, async (req, res) => {
    const item = await storage.getMarketplaceItem(Number(req.params.id));
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (item.userId !== (req.user as any).claims.sub) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await storage.deleteMarketplaceItem(Number(req.params.id));
    res.status(204).send();
  });

  // === GUIDES ===
  app.get(api.guides.list.path, async (req, res) => {
    const category = req.query.category as string | undefined;
    const guides = await storage.getGuides(category);
    res.json(guides);
  });

  app.get(api.guides.get.path, async (req, res) => {
    const guide = await storage.getGuide(Number(req.params.id));
    if (!guide) {
      return res.status(404).json({ message: 'Guide not found' });
    }
    res.json(guide);
  });

  app.post(api.guides.create.path, isAuthenticated, async (req, res) => {
    // Ideally check for admin role here
    try {
      const input = api.guides.create.input.parse(req.body);
      const guide = await storage.createGuide(input);
      res.status(201).json(guide);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      throw err;
    }
  });

  return httpServer;
}

// SEED DATA
async function seedDatabase() {
  const guides = await storage.getGuides();
  if (guides.length === 0) {
    await storage.createGuide({
      title: "How to open a bank account",
      content: "# Opening a Bank Account\n\nTo open a bank account in Korea, you typically need:\n- Alien Registration Card (ARC)\n- Passport\n- Proof of employment (optional but helpful)\n\nMajor banks include Shinhan, Woori, KEB Hana, and KB Kookmin.",
      category: "bank"
    });
    await storage.createGuide({
      title: "Visa Types Overview",
      content: "# Common Visa Types\n\n- E-2: Foreign Language Instructor\n- E-7: Special Occupation\n- F-4: Overseas Korean\n- F-6: Marriage Migrant\n\nCheck the immigration website for latest requirements.",
      category: "visa"
    });
    await storage.createGuide({
      title: "Year-end Tax Settlement (Yeonmal Jeongsan)",
      content: "# Year-end Tax Settlement\n\nThis is an annual process to finalize your income tax for the previous year. It usually happens in January/February.\n\nKey documents:\n- Hometax PDF download\n- Receipts for donations, medical expenses, etc.",
      category: "tax"
    });
    await storage.createGuide({
      title: "Buying a Used Car",
      content: "# Buying a Used Car\n\n- Check Encar or K Car for listings.\n- Verify the vehicle history report.\n- You will need insurance before transferring ownership.\n- Visit your local Gu-office (District Office) to register.",
      category: "car"
    });
    await storage.createGuide({
      title: "Learning Korean",
      content: "# Resources for Learning Korean\n\n- KIIP (Korea Immigration and Integration Program)\n- Talk To Me In Korean\n- University Language Institutes",
      category: "korean_language"
    });
  }
}

// Run seed on startup (simplified for this environment)
seedDatabase().catch(console.error);

import { z } from 'zod';
import { 
  insertJobSchema, jobs, 
  insertHousingSchema, housing, 
  insertMarketplaceSchema, marketplace,
  insertGuideSchema, guides,
  insertFavoriteSchema, favorites
} from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  jobs: {
    list: {
      method: 'GET' as const,
      path: '/api/jobs' as const,
      responses: {
        200: z.array(z.custom<typeof jobs.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/jobs/:id' as const,
      responses: {
        200: z.custom<typeof jobs.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/jobs' as const,
      input: insertJobSchema,
      responses: {
        201: z.custom<typeof jobs.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/jobs/:id' as const,
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  housing: {
    list: {
      method: 'GET' as const,
      path: '/api/housing' as const,
      responses: {
        200: z.array(z.custom<typeof housing.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/housing/:id' as const,
      responses: {
        200: z.custom<typeof housing.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/housing' as const,
      input: insertHousingSchema,
      responses: {
        201: z.custom<typeof housing.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/housing/:id' as const,
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  marketplace: {
    list: {
      method: 'GET' as const,
      path: '/api/marketplace' as const,
      responses: {
        200: z.array(z.custom<typeof marketplace.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/marketplace/:id' as const,
      responses: {
        200: z.custom<typeof marketplace.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/marketplace' as const,
      input: insertMarketplaceSchema,
      responses: {
        201: z.custom<typeof marketplace.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/marketplace/:id' as const,
      responses: {
        204: z.void(),
        404: errorSchemas.notFound,
      },
    },
  },
  guides: {
    list: {
      method: 'GET' as const,
      path: '/api/guides' as const,
      input: z.object({
        category: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof guides.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/guides/:id' as const,
      responses: {
        200: z.custom<typeof guides.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/guides' as const,
      input: insertGuideSchema,
      responses: {
        201: z.custom<typeof guides.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}

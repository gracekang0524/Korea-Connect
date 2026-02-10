import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type CreateGuideRequest } from "@shared/routes";

export function useGuides(category?: string) {
  return useQuery({
    queryKey: [api.guides.list.path, category],
    queryFn: async () => {
      // Manually construct query string since we don't have a helper for it in api definition
      const url = category 
        ? `${api.guides.list.path}?category=${category}` 
        : api.guides.list.path;
        
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch guides");
      return api.guides.list.responses[200].parse(await res.json());
    },
  });
}

export function useGuide(id: number) {
  return useQuery({
    queryKey: [api.guides.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.guides.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch guide");
      return api.guides.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreateGuide() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateGuideRequest) => {
      const validated = api.guides.create.input.parse(data);
      const res = await fetch(api.guides.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.guides.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create guide");
      }
      return api.guides.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.guides.list.path] }),
  });
}

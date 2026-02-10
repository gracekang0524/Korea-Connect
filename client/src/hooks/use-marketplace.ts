import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type CreateMarketplaceItemRequest } from "@shared/routes";

export function useMarketplaceItems() {
  return useQuery({
    queryKey: [api.marketplace.list.path],
    queryFn: async () => {
      const res = await fetch(api.marketplace.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch marketplace items");
      return api.marketplace.list.responses[200].parse(await res.json());
    },
  });
}

export function useMarketplaceItem(id: number) {
  return useQuery({
    queryKey: [api.marketplace.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.marketplace.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch item details");
      return api.marketplace.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreateMarketplaceItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateMarketplaceItemRequest) => {
      const validated = api.marketplace.create.input.parse(data);
      const res = await fetch(api.marketplace.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.marketplace.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create item");
      }
      return api.marketplace.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.marketplace.list.path] }),
  });
}

export function useDeleteMarketplaceItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.marketplace.delete.path, { id });
      const res = await fetch(url, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error("Failed to delete item");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.marketplace.list.path] }),
  });
}

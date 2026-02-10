import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type CreateHousingRequest } from "@shared/routes";

export function useHousingList() {
  return useQuery({
    queryKey: [api.housing.list.path],
    queryFn: async () => {
      const res = await fetch(api.housing.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch housing");
      return api.housing.list.responses[200].parse(await res.json());
    },
  });
}

export function useHousing(id: number) {
  return useQuery({
    queryKey: [api.housing.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.housing.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch housing details");
      return api.housing.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useCreateHousing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateHousingRequest) => {
      const validated = api.housing.create.input.parse(data);
      const res = await fetch(api.housing.create.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validated),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.housing.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to create housing listing");
      }
      return api.housing.create.responses[201].parse(await res.json());
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.housing.list.path] }),
  });
}

export function useDeleteHousing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.housing.delete.path, { id });
      const res = await fetch(url, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error("Failed to delete housing listing");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [api.housing.list.path] }),
  });
}

"use client";

import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/apiRequest";

export function usePermissions() {
  const { data, isLoading } = useQuery({
    queryKey: ["auth-me"],
    queryFn: () => apiRequest("GET", "/api/v1/admin/auth/me"),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const permissions = data?.data?.permissions || [];

  return {
    permissions,
    isLoading,
    can: (permission) => permissions.includes(permission),
    canAny: (perms) => perms.some((p) => permissions.includes(p)),
    canAll: (perms) => perms.every((p) => permissions.includes(p)),
  };
}

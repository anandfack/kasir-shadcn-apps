"use client";

import { apiRequest } from "@/lib/apiRequest";

const handleLogout = async () => {
  try {
    await apiRequest("POST", "/api/v1/auth/admin/logout");

    window.location.href = "/auth-admin/login";
  } catch (error) {
    console.error(error.message);
  }
};

export default handleLogout;

"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { apiRequest } from "@/lib/apiRequest";
import { ChevronDown, ChevronUp } from "lucide-react";
import React, { useState } from "react";

export default function DropdownMenuDemo({ user }) {
  const [dropdownOpen, setDropDownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/v1/auth/admin/logout");

      window.location.href = "/auth-admin/login";
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <DropdownMenu open={dropdownOpen} onOpenChange={setDropDownOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          {user?.nama}{" "}
          {dropdownOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="start">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{user?.nama}</DropdownMenuLabel>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={handleLogout}>
            Log out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

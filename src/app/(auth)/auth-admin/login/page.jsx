"use client";

import { apiRequest } from "@/lib/apiRequest";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { getApiErrorMessage } from "@/lib/getApiErrorMessage";

const LoginPage = () => {
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    try {
      const result = await apiRequest("POST", "/api/v1/auth/admin/login", {
        username,
        password,
      });

      window.location.href = "/admin/dashboard";
    } catch (error) {
      toast({
        title: "Gagal login!",
        description: getApiErrorMessage(error),
        variant: "destructive",
      });
      console.error(error);
      // setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto max-h-lg my-auto">
      <CardHeader className="flex items-center justify-center">
        <CardTitle className="flex items-center justify-center text-2xl">
          Hey, hello 👋
        </CardTitle>
        <CardDescription className="flex items-center justify-center">
          Login untuk mengakses admin panel
        </CardDescription>
      </CardHeader>
      <CardContent>
        {errorMessage && (
          <p className="text-red-600 text-sm mb-2">{errorMessage}</p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="username">Username / Email</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Login
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginPage;

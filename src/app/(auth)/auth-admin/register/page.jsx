"use client";

import { apiRequest } from "@/app/utils/fetchOptions";
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

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Password dan Confirm Password harus sama");
      return;
    }
    try {
      const result = await apiRequest("POST", "/api/v1/auth/admin/register", {
        email: formData.email,
        username: formData.username,
        password: formData.password,
      });
      alert("registrasi berhasil");
      console.log("Response: ", result);

      window.location.href = "/auth-admin/login";
    } catch (error) {
      console.error(error);
      alert(error.message || "Register gagal");
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto max-h-lg my-auto">
      <div className="flex items-center gap-16">
        <CardHeader>
          <CardTitle>Register to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <Button variant="link">
          <Link href="/auth-admin/login">Sign In</Link>
        </Button>
      </div>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="●●●●●●●●"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Re-type Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="●●●●●●●●"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          {/* <CardFooter className="flex-col gap-2"> */}
            <Button type="submit" className="w-full mt-6">
              Register
            </Button>
          {/* </CardFooter> */}
        </form>
      </CardContent>
    </Card>
  );
};

export default RegisterPage;

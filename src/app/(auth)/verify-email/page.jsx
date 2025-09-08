"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [message, setMessage] = useState("Memverifikasi email...");
  const router = useRouter();

  useEffect(() => {
    if (token) {
      fetch("/api/auth/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setMessage(data.error);
          } else {
            setMessage("Email berhasil diverifikasi! Redirect ke login...");
            setTimeout(() => router.push("/login"), 2000);
          }
        });
    } else {
      setMessage("Token tidak ditemukan.");
    }
  }, [token, router]);

  return <div className="p-6 text-center">{message}</div>;
}

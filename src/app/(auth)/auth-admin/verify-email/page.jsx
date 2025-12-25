"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status");

  useEffect(() => {
    if (status === "success") {
      alert("Email berhasil diverifikasi!");
    }
  }, [status]);

  return <p>Memverifikasi email...</p>;
}

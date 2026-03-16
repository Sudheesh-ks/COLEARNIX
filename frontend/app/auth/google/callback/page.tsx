"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Loader from "@/app/components/Loader/Loader";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      localStorage.setItem("userAccessToken", token);
      router.replace("/home");
    } else {
      router.replace("/login");
    }
  }, [router, searchParams]);

  return (
    <Loader />
  );
}
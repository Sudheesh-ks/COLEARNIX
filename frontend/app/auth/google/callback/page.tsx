"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Loader from "@/app/components/Loader/Loader";
import toast from "react-hot-toast";

function GoogleCallbackHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (error === "blocked") {
      toast.error("admin blocked your account");
      router.replace("/");
      return;
    }

    if (token) {
      localStorage.setItem("userAccessToken", token);
      router.replace("/home");
    } else {
      router.replace("/login");
    }
  }, [router, searchParams]);

  return <Loader />;
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={<Loader />}>
      <GoogleCallbackHandler />
    </Suspense>
  );
}
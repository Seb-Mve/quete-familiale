"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/store";

export default function Home() {
  const router = useRouter();
  const famille = useStore((s) => s.famille);

  useEffect(() => {
    if (!famille) {
      router.replace("/onboarding");
    } else if (famille.enfants.length === 1) {
      router.replace(`/enfant/${famille.enfants[0].id}`);
    } else {
      router.replace("/famille");
    }
  }, [famille, router]);

  return (
    <div className="min-h-screen bg-warm flex items-center justify-center">
      <div className="text-4xl animate-pulse">⚔️</div>
    </div>
  );
}

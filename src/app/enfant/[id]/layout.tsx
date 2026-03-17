"use client";

import { usePathname } from "next/navigation";
import TabBar, { type ActiveTab } from "@/components/ui/TabBar";
import { use } from "react";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

function getActiveTab(pathname: string): ActiveTab {
  if (pathname.includes("/catalogue")) return "catalogue";
  if (pathname.includes("/profil")) return "profil";
  return "home";
}

export default function EnfantLayout({ children, params }: LayoutProps) {
  const { id } = use(params);
  const pathname = usePathname();
  const activeTab = getActiveTab(pathname);

  return (
    <div className="pb-20">
      {children}
      <TabBar activeTab={activeTab} enfantId={id} />
    </div>
  );
}

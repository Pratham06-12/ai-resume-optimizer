"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MobileNavProps {
  onOpen: () => void;
}

export function MobileNav({ onOpen }: MobileNavProps) {
  return (
    <div className="fixed left-0 right-0 top-0 z-30 flex h-14 items-center justify-between border-b border-white/10 bg-[#060912]/95 px-4 backdrop-blur-xl lg:hidden">
      <Button variant="ghost" size="icon" onClick={onOpen} type="button">
        <Menu className="h-5 w-5" />
      </Button>
      <span className="font-bold text-white">ResumeAI</span>
      <div className="w-10" />
    </div>
  );
}

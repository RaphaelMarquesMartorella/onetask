"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserMenu } from "./user-menu";

interface HeaderProps {
  title?: string;
  onMenuClick?: () => void;
}

export function Header({ title, onMenuClick }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200">
      <div className="flex h-full items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>
          {title && (
            <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
          )}
        </div>
        <UserMenu />
      </div>
    </header>
  );
}

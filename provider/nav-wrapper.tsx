"use client";
import { usePathname } from "next/navigation";

const HIDDEN_PATHS = ["/auth", "/auth/callback", "/onboarding", "/deneme"];

export const NavWrapper = ({ children, hideOnCheckout = false }: { children: React.ReactNode, hideOnCheckout?: boolean }) => {
  const pathname = usePathname();
  
  if (HIDDEN_PATHS.includes(pathname)) return null;
  
  // Explicitly hide footer on checkout paths
  if (hideOnCheckout && (pathname === "/checkout" || pathname.startsWith("/checkout/"))) {
    return null;
  }
  
  return <>{children}</>;
};
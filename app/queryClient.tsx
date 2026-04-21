"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { queryClientConfig } from "@/lib/query-client";

// Global variable to persist client on CSR but create fresh on SSR per request
let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new query client
    return new QueryClient(queryClientConfig);
  } else {
    // Browser: make a new query client if we don't already have one
    // This is very important! This is what prevents the React Query error
    if (!browserQueryClient) browserQueryClient = new QueryClient(queryClientConfig);
    return browserQueryClient;
  }
}

export default function Queryclientprovider({children}: {children: React.ReactNode}) {
  // Use a ref-like approach to ensure the client is stable
  const [queryClient] = useState(() => getQueryClient());
  
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
"use client";

import { ThemeProvider } from "next-themes";
import ReactQueryProvider from "./ReactQueryProvider";

export default function Providers({ children }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <ReactQueryProvider>{children}</ReactQueryProvider>
    </ThemeProvider>
  );
}

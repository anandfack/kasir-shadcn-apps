"use client";

import { ThemeProvider } from "next-themes";
import ReactQueryProvider from "./ReactQueryProvider";
import { Provider } from "react-redux";
import { store } from "../store";

export default function Providers({ children }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
    >
      <Provider store={store}>
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </Provider>
    </ThemeProvider>
  );
}

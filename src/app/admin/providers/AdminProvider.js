// "use client";

// import { ThemeProvider } from "next-themes";
// import { Provider } from "react-redux";
// import AdminReactQueryProvider from "./AdminReactQueryProvider";

// export default function AdminProvider({ children }) {
//   return (
//     <ThemeProvider
//       attribute="class"
//       defaultTheme="dark"
//       enableSystem={false}
//       forcedTheme="dark"
//     >
//       <Provider>
//         <AdminReactQueryProvider>{children}</AdminReactQueryProvider>
//       </Provider>
//     </ThemeProvider>
//   );
// }

"use client";

import { ThemeProvider } from "next-themes";

export default function AdminProvider({ children }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      forcedTheme="dark"
    >
      {children}
    </ThemeProvider>
  );
}

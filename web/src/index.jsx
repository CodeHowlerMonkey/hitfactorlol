import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/soho-dark/theme.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import { RouterProvider } from "react-router-dom";
import router from "./router";
import "./index.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <PrimeReactProvider>
      <QueryClientProvider queryClient={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </PrimeReactProvider>
  </React.StrictMode>
);

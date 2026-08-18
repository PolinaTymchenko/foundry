import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "{{packageScope}}/tokens/tokens.css";
import "{{packageScope}}/react/styles.css";
import { App } from "./App.js";

const container = document.getElementById("root");
if (!container) {
  throw new Error("Missing #root element in index.html");
}

const queryClient = new QueryClient();

createRoot(container).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
);

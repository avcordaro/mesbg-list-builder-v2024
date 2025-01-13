import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.scss";
import { HelmetProvider } from "react-helmet-async";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ErrorBoundary } from "./components/error-boundary/ErrorBoundary.tsx";
import { RootFallback } from "./components/error-boundary/RootFallback.tsx";
import { routes } from "./routing/routes.tsx";
import { ThemeContextProvider } from "./theme/ThemeContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary inCaseOfError={<RootFallback />}>
      <ThemeContextProvider>
        <HelmetProvider>
          <RouterProvider router={createBrowserRouter(routes)} />
        </HelmetProvider>
      </ThemeContextProvider>
    </ErrorBoundary>
  </StrictMode>,
);

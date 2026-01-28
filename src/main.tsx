// eslint-disable-next-line import/order
import { ThemeContextProvider } from "./theme/ThemeContext.tsx";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.scss";
import { HelmetProvider } from "react-helmet-async";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthProvider } from "./firebase/FirebaseAuthContext.tsx";
import { ErrorBoundary } from "./layout/error-boundary/ErrorBoundary.tsx";
import { RootFallback } from "./layout/error-boundary/RootFallback.tsx";
import { LockContextProvider } from "./lock/LockContext.tsx";
import { routes } from "./routing/routes.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ErrorBoundary inCaseOfError={<RootFallback />}>
      <ThemeContextProvider>
        <LockContextProvider>
          <AuthProvider>
            <HelmetProvider>
              <RouterProvider router={createBrowserRouter(routes)} />
            </HelmetProvider>
          </AuthProvider>
        </LockContextProvider>
      </ThemeContextProvider>
    </ErrorBoundary>
  </StrictMode>,
);

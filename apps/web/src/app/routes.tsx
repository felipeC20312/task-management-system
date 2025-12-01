import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from "@tanstack/react-router";
import { lazy } from "react";

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  component: lazy(() =>
    import("@/features/auth/pages/login/loginPage").then((m) => ({
      default: m.LoginPage,
    })),
  ),
});

const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/register",
  component: lazy(() =>
    import("@/features/auth/pages/register/registerPage").then((m) => ({
      default: m.RegisterPage,
    })),
  ),
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: lazy(() =>
    import("@/features/dashboard/pages/dashboardPage").then((m) => ({
      default: m.DashboardPage,
    })),
  ),
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  registerRoute,
  dashboardRoute,
]);

export const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

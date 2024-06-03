import { createRootRoute, createRoute, createRouter } from "@tanstack/react-router";
import App from "@/App";
import About from "@/components/About";
import News from "@/components/News";
import Support from "@/components/Support";

const rootRoute = createRootRoute({
  component: App,
});

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
});

export const aboutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/about",
  component: About,
});

export const newsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/news",
  component: News,
});

export const supportRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/support",
  component: Support,
});

const routeTree = rootRoute.addChildren([indexRoute, aboutRoute, newsRoute, supportRoute]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default router;

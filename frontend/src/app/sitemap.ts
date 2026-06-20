import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";

const routes = ["/", "/about", "/contact", "/pricing", "/login", "/register"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${SITE.url}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: route === "/" ? 1 : 0.8,
  }));
}

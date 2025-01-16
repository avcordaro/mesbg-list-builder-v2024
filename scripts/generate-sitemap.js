// scripts/generate-sitemap.js
import { createWriteStream } from "fs";
import { SitemapStream } from "sitemap";

const baseUrl = "https://www.mesbg-list-builder.com"; // Replace with your actual domain

const links = [
  { url: "/about", changefreq: "weekly", priority: 1.0 },
  { url: "/database", changefreq: "weekly", priority: 0.9 },
  { url: "/rosters", changefreq: "monthly", priority: 0.7 },
  { url: "/match-history", changefreq: "monthly", priority: 0.4 },
  { url: "/collection", changefreq: "monthly", priority: 0.4 },
  { url: "/settings", changefreq: "monthly", priority: 0.4 },
];

const stream = new SitemapStream({ hostname: baseUrl });

const writeStream = createWriteStream("./build/sitemap.xml");
stream.pipe(writeStream);

links.forEach((link) => stream.write(link));
stream.end();

console.log("✅ Sitemap generated at build/sitemap.xml");

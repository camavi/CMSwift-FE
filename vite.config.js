import { defineConfig } from "vite";
import fs from "fs";
import path from "path";
function getHtmlEntries(dir, base = dir, entries = {}) {
  for (const file of fs.readdirSync(dir)) {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) getHtmlEntries(full, base, entries);
    else if (file.endsWith(".html")) {
      const name = path.relative(base, full).replace(/\.html$/, "");
      entries[name] = full;
    }
  }
  return entries;
}

export default defineConfig({
  root: "pages",
  plugins: [
    {
      name: "cmswift-rewrite-demo",
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const original = req.url || "/";
          const pathname = original.split("?")[0];
          if (path.posix.extname(pathname)) return next();

          if (pathname === "/demo" || pathname.startsWith("/demo/")) {
            const q = original.includes("?") ? original.slice(original.indexOf("?")) : "";
            req.url = "/demo/index.html" + q;
          }
          next();
        });
      },
    },
  ],

  build: {
    outDir: "../dist",
    emptyOutDir: true,
    rollupOptions: {
      input: getHtmlEntries("pages"),
    },
  },
});

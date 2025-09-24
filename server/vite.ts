import express, { type Express } from "express";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer, createLogger } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import { nanoid } from "nanoid";

const viteLogger = createLogger();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = fileURLToPath(
        new URL("../client/index.html", import.meta.url)
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  // FIXED: Correct path to the built public directory
  const distPath = path.join(__dirname, "public");

  // Alternative more robust path resolution:
  // const distPath = path.resolve(__dirname, '../public');

  log(`Looking for static files in: ${distPath}`);

  if (!fs.existsSync(distPath)) {
    log(`Build directory not found: ${distPath}`, "vite");
    log("Current working directory: " + process.cwd(), "vite");
    log("Directory contents of dist folder:", "vite");

    const distDir = path.dirname(distPath);
    if (fs.existsSync(distDir)) {
      const files = fs.readdirSync(distDir);
      log(`Files in dist: ${files.join(", ")}`, "vite");
    }

    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first with 'npm run build'`
    );
  }

  // Log what files are found
  const files = fs.readdirSync(distPath);
  log(`Found static files: ${files.join(", ")}`, "vite");

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    log(
      `Serving index.html from: ${path.resolve(distPath, "index.html")}`,
      "vite"
    );
    res.sendFile(path.resolve(distPath, "index.html"));
  });

  log(`Static file serving configured from: ${distPath}`, "vite");
}

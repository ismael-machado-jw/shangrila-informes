import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs/promises";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  const DB_PATH = path.join(process.cwd(), "db.json");

  // Initial DB setup if it doesn't exist
  try {
    await fs.access(DB_PATH);
  } catch {
    const initialData = {
      publicadores: [
        { id: "1", nombre: "Ismael Machado", grupo: 1 },
        { id: "2", nombre: "Juan Pérez", grupo: 1 },
        { id: "3", nombre: "Ana García", grupo: 1 },
        { id: "4", nombre: "Carlos Ruiz", grupo: 1 },
        { id: "5", nombre: "Elena Blanco", grupo: 2 }, // Different group to test filter
      ],
      reports: []
    };
    await fs.writeFile(DB_PATH, JSON.stringify(initialData, null, 2));
  }

  // API Routes
  app.get("/api/data", async (req, res) => {
    try {
      const data = JSON.parse(await fs.readFile(DB_PATH, "utf-8"));
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to read data" });
    }
  });

  app.post("/api/reports", async (req, res) => {
    try {
      const { publisherId, month, field, value } = req.body;
      const data = JSON.parse(await fs.readFile(DB_PATH, "utf-8"));
      
      let report = data.reports.find((r: any) => r.publisherId === publisherId && r.month === month);
      
      if (!report) {
        report = {
          publisherId,
          month,
          participo: false,
          cursos: 0,
          precursorado: "",
          horas: 0,
          notas: ""
        };
        data.reports.push(report);
      }
      
      report[field] = value;
      
      await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
      res.json({ success: true, report });
    } catch (error) {
      res.status(500).json({ error: "Failed to update report" });
    }
  });

  // Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

import express, { Request, Response } from "express";
import cors from "cors";
import { deployToken } from "./scripts/deployToken.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.post("/api/deploy", async (req: Request, res: Response) => {
  try {
    const { name, symbol, initialSupply, network } = req.body;

    if (!name || !symbol) {
      return res.status(400).json({
        success: false,
        error: "Token name and symbol are required",
      });
    }

    const result = await deployToken({
      name,
      symbol,
      initialSupply: initialSupply ? BigInt(initialSupply) : undefined,
      network: network || "sepolia", // Default to Sepolia, but can be overridden
    });

    if (result.success) {
      res.json(result);
    } else {
      res.status(500).json(result);
    }
  } catch (error: any) {
    console.error("API error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Internal server error",
    });
  }
});

app.get("/api/health", (req: Request, res: Response) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});


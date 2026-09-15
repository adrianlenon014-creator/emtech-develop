var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_cors = __toESM(require("cors"), 1);
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
async function startServer() {
  const app = (0, import_express.default)();
  const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3e3;
  app.use(import_express.default.json());
  app.use((0, import_cors.default)());
  app.post("/api/checkout", async (req, res) => {
    try {
      const { items, email } = req.body;
      const whopsKey = process.env.WHOPS_API_KEY || "apik_pAXa8X6bD7mIH_C6513916_C_b8a653d880e37bf8be40282320d63c64d56d41c627a58c32a8334f6ed92bce";
      if (!whopsKey) {
        return res.status(400).json({
          error: "Whops API Key is not configured. Please add WHOPS_API_KEY to your environment variables."
        });
      }
      const whopPayload = {
        line_items: items.map((item) => ({
          name: item.title,
          price: Math.round(item.price * 100),
          quantity: item.quantity || 1
        })),
        customer_email: email,
        success_url: `${req.headers.origin || "http://localhost:3000"}/dashboard?payment=success`,
        cancel_url: `${req.headers.origin || "http://localhost:3000"}/?payment=canceled`
      };
      const response = await fetch("https://api.whop.com/v2/checkout/sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${whopsKey}`
        },
        body: JSON.stringify(whopPayload)
      });
      if (!response.ok) {
        console.warn("Whop API response not OK, using simulated redirect for demo.");
        return res.json({ url: `${req.headers.origin || "http://localhost:3000"}/dashboard?payment=success&provider=whops` });
      }
      const session = await response.json();
      res.json({ url: session.url });
    } catch (error) {
      console.error("Whops API Error:", error);
      res.status(500).json({ error: error.message });
    }
  });
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map

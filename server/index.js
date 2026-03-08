import express from "express";
import cors from "cors";
import "dotenv/config";
import sequelize from "./dataBase/connection.js";
import User from "./models/User.js";
import Category from "./models/Category.js";
import Session from "./models/Session.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import Comment from "./models/Comment.js";
import commentRoutes from "./routes/commentRoutes.js";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);
app.use("/api/categories", categoryRoutes);
app.use("/api/users", userRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/comments", commentRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Conectado a la base de datos");
});

Category.hasMany(Session, { foreignKey: "categoryId" });
Session.belongsTo(Category, { foreignKey: "categoryId" });
User.hasMany(Session, { foreignKey: "userId" });
Session.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Comment, { foreignKey: "userId" });
Comment.belongsTo(User, { foreignKey: "userId" });
Session.hasMany(Comment, { foreignKey: "sessionId", onDelete: "CASCADE" });
Comment.belongsTo(Session, { foreignKey: "sessionId" });

async function starServer() {
  try {
    await sequelize.authenticate();
    console.log("✅ Conexión a Neon exitosa");

    //para crear la tabla fisicamente
    await sequelize.sync({ alter: true });
    console.log("🚀 Tablas sincronizadas en la nube");

    const count = await Category.count();
    if (count === 0) {
      await Category.bulkCreate([
        { id: 1, name: "Frontend" },
        { id: 2, name: "Backend" },
        { id: 3, name: "Ciberseguridad" },
      ]);
      console.log("🌱 Categorías iniciales creadas correctamente");
    }
  } catch (error) {
    console.error("❌ Error al sincronizar:", error);
  }
}

app.get("/health", async (req, res) => {
  try {
    res.json({ status: "ok", message: "Server is running" });
  } catch (error) {
    console.error(error);
  }
});

starServer();

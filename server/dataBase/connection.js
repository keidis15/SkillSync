import { Sequelize } from "sequelize";
import "dotenv/config";

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  logging: false
});

// --- AGREGA ESTE BLOQUE PARA ARREGLAR LA BASE DE DATOS ---
const syncDB = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log("✅ Base de datos sincronizada: Columna resource_url verificada/creada.");
  } catch (error) {
    console.error("❌ Error al sincronizar la base de datos:", error);
  }
};

syncDB(); // Ejecuta la sincronización al iniciar
// -------------------------------------------------------

export default sequelize;
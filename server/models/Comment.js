import { DataTypes } from "sequelize";
import sequelize from "../dataBase/connection.js"; //configuración de conexión

const Comment = sequelize.define("Comment", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
    notEmpty: true, // No permite strings vacíos ""
    len: [1, 500]   // Limita el comentario para evitar ataques de denegación de servicio por texto masivo
  }
  },
});

export default Comment;
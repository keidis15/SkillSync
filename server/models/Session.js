import { DataTypes } from "sequelize";
import sequelize from "../dataBase/connection.js";

const Session = sequelize.define("Session", {
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  date: { type: DataTypes.DATE, allowNull: false },
  resource_url: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      // Solo valida si el campo NO está vacío
      isUrl: {
        msg: "Formato de URL no válido",
        args: true,
      },
    },
  },
});

export default Session;

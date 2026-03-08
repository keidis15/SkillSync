import sequelize from "../dataBase/connection.js";
import { DataTypes } from "sequelize";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false, // No puede estar vacío
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: { msg: "Debe ser un correo válido" },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [8, 100],
          msg: "La contraseña debe tener entre 8 y 100 caracteres",
        },
      },
    },
    role: {
      type: DataTypes.STRING,
      defaultValue: "student", // Por defecto será estudiante
    },
    profilePic: {
      type: DataTypes.TEXT, // Cambiar STRING por TEXT para soportar Base64
      allowNull: true,
    },
    jobTitle: {
      type: DataTypes.STRING,
      defaultValue: "Usuario Full Stack",
    },
    certifications: {
      type: DataTypes.STRING,
      defaultValue: "AIEP Web Dev | Santander Cybersecurity",
    },
  },
  {
    timestamps: true, // Crea automáticamente createdAt y updatedAt
  },
);

export default User;

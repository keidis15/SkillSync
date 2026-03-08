//Aqui encontraremos la función que recibe los datos y los guarda en la tabla que acabas de crear en Neon.

import Category from "../models/Category.js";

export const createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const newCategory = await Category.create({name});
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(500).json({ message: "Error al crear la categoría", error: error.message });
    }
}

// Función para obtener todas las categorías
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener categorías", error: error.message });
  }
};
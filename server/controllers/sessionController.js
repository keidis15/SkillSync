import Session from "../models/Session.js";
import Category from "../models/Category.js";
import User from "../models/User.js";
import Comment from "../models/Comment.js";

export const createSession = async (req, res) => {
  try {
    const { title, description, date, categoryId, userId, resource_url } =
      req.body;

    const newSession = await Session.create({
      title,
      description,
      date,
      categoryId,
      userId,
      resource_url,
    });

    res.status(201).json(newSession);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear sesión", error: error.message });
  }
};

export const getSessions = async (req, res) => {
  try {
    const sessions = await Session.findAll({
      include: [
        { model: User, attributes: ["name"] }, // Incluye el nombre del autor
        { model: Category, attributes: ["name"] }, // Opcional: incluye el nombre de la categoría
      ],
    });
    res.json(sessions);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener sesiones" });
  }
};

export const deleteSession = async (req, res) => {
  const { id } = req.params; // Obtenemos el ID de la URL
  try {
    const deleted = await Session.destroy({ where: { id } });
    if (deleted) {
      res.json({ message: "Sesión eliminada correctamente" });
    } else {
      res.status(404).json({ message: "Sesión no encontrada" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la sesión" });
  }
};

export const updateSession = async (req, res) => {
  const { id } = req.params;
  const { title, description, date, categoryId } = req.body;
  try {
    const [updated] = await Session.update(
      { title, description, date, categoryId },
      { where: { id } },
    );
    if (updated) {
      const updatedSession = await Session.findByPk(id);
      return res.json(updatedSession);
    }
    res.status(404).json({ message: "Sesión no encontrada" });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar" });
  }
};
export const getSessionById = async (req, res) => {
  try {
    const { id } = req.params;
    const session = await Session.findByPk(id, {
      include: [
        { model: User, attributes: ["name"] }, // Autor de la sesión
        {
          model: Comment,
          include: [{ model: User, attributes: ["name"] }], // Autores de los comentarios
        },
      ],
      order: [[Comment, "createdAt", "DESC"]], // Los más nuevos primero
    });

    if (!session)
      return res.status(404).json({ message: "Sesión no encontrada" });

    res.json(session);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al obtener sesión", error: error.message });
  }
};

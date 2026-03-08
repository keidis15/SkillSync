import Comment from "../models/Comment.js";
import User from "../models/User.js";

export const createComment = async (req, res) => {
  try {
    const { content, sessionId, userId } = req.body;
    
    const newComment = await Comment.create({
      content,
      sessionId,
      userId
    });

    // Lo devolvemos incluyendo los datos del usuario para mostrar su nombre de inmediato
    const commentWithUser = await Comment.findByPk(newComment.id, {
      include: [{ model: User, attributes: ['name'] }]
    });

    res.status(201).json(commentWithUser);
  } catch (error) {
    res.status(500).json({ message: "Error al publicar comentario", error: error.message });
  }
};

export const updateComment = async (req, res) => {
  const { id } = req.params;
  const { content, userId } = req.body; // El userId viene del frontend (o token)
  try {
    const [updated] = await Comment.update(
      { content },
      { where: { id, userId } } // Seguridad: solo si el comentario es del usuario
    );
    if (updated) {
      const updatedComment = await Comment.findByPk(id, { include: [User] });
      return res.json(updatedComment);
    }
    res.status(403).json({ message: "No autorizado o comentario no encontrado" });
  } catch (error) {
    res.status(500).json({ message: "Error al editar" });
  }
};

export const deleteComment = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body; // En un futuro esto vendrá del JWT
  try {
    const deleted = await Comment.destroy({ where: { id, userId } });
    if (deleted) return res.json({ message: "Comentario eliminado" });
    res.status(403).json({ message: "No puedes eliminar este comentario" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar" });
  }
};
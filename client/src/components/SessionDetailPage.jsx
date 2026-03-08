import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api/axios";

export function SessionDetailPage() {
  const { id } = useParams();
  const [session, setSession] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const navigate = useNavigate();
  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "?");

  useEffect(() => {
    api
      .get(`/sessions/${id}`)
      .then((res) => {
        setSession(res.data);
        // Sequelize devuelve los modelos asociados en plural: 'Comments'
        if (res.data.Comments) {
          setComments(res.data.Comments);
        }
      })
      .catch((err) => console.error("Error al cargar:", err));
  }, [id]);

  if (!session)
    return <div className="text-center mt-5">Cargando recurso...</div>;

  const handleCommentSubmit = async () => {
    if (!newComment.trim()) return;

    try {
      const userString = localStorage.getItem("user");
      if (!userString) {
        alert("Debes iniciar sesión para comentar");
        return;
      }
      const userData = JSON.parse(userString);

      const response = await api.post("/comments", {
        content: newComment,
        sessionId: id,
        userId: userData.id,
      });

      // Añadimos el nuevo comentario a la lista y limpiamos el texto
      setComments([...comments, response.data]);
      setNewComment("");
    } catch (error) {
      console.error("Error detallado:", error);
      alert("No se pudo publicar el comentario");
    }
  };
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("¿Seguro que quieres borrar este comentario?")) return;

    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      await api.delete(`/comments/${commentId}`, {
        data: { userId: userData.id },
      });

      // Filtramos el estado para quitarlo de la vista de inmediato
      setComments(comments.filter((c) => c.id !== commentId));
    } catch (error) {
      alert("No se pudo eliminar", error);
    }
  };
  const handleUpdateComment = async (commentId) => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const response = await api.put(`/comments/${commentId}`, {
        content: editContent,
        userId: userData.id,
      });

      // Actualizamos el array localmente para que se vea el cambio
      setComments(
        comments.map((c) => (c.id === commentId ? response.data : c)),
      );
      setEditingCommentId(null); // Salimos del modo edición
    } catch (error) {
      alert("No se pudo editar el comentario", error);
    }
  };

  return (
  <div className="container py-4">
    {/* Botón Volver */}
    <div className="mb-4 text-center text-md-start">
      <button
        onClick={() => navigate(-1)}
        className="btn d-flex align-items-center p-0 text-secondary border-0 bg-transparent"
        style={{ transition: "0.3s" }}
      >
        <i className="bi bi-arrow-left me-2" style={{ fontSize: "1.2rem" }}></i>
        <span style={{ fontWeight: "500" }}>Volver</span>
      </button>
    </div>

    {/* Fila Principal para la Card */}
    <div className="row justify-content-center">
      {/* CAMBIO CLAVE: Quitamos w-50. 
          Usamos col-12 (móvil) y col-lg-8 (escritorio) */}
      <div className="col-12 col-lg-8">
        <div className="card shadow-sm border-0 rounded-4 overflow-hidden mb-5">
          <div className="bg-primary py-2"></div>
          <div className="card-body p-4 p-md-5">
            <h1 className="display-5 fw-bold text-dark mb-2 text-break">
              {session.title}
            </h1>

            <div className="d-flex align-items-center text-muted mb-4">
              <div className="bg-light rounded-circle p-2 me-3">
                <i className="bi bi-person-fill fs-4"></i>
              </div>
              <span>
                Por <strong>{session.User?.name || "Usuario de SkillSync"}</strong>
              </span>
            </div>

            <h5 className="fw-bold text-dark text-uppercase small spacing-1 mb-3">
              Descripción del Recurso
            </h5>
            <p
              className="fs-5 text-secondary mb-5"
              style={{ whiteSpace: "pre-line", lineHeight: "1.6" }}
            >
              {session.description || "No hay una descripción disponible."}
            </p>

            {session.resource_url && (
              <div className="p-4 bg-light rounded-4 text-center border">
                <p className="mb-3 fw-semibold">¿Quieres profundizar?</p>
                <a
                  href={session.resource_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-dark btn-lg px-4 px-md-5 rounded-pill shadow-sm w-100 w-md-auto"
                >
                  <i className="bi bi-github me-2"></i> Ver Documentación
                </a>
              </div>
            )}
          </div>
        </div>

        {/* SECCIÓN DE COMENTARIOS 
            Ahora vive dentro del mismo sistema de columnas para mantener alineación */}
        <div className="mt-2">
          <h4 className="fw-bold mb-4">
            Comentarios{" "}
            <span className="badge bg-secondary ms-2">{comments.length}</span>
          </h4>

          {/* Caja para escribir comentario */}
          <div className="card shadow-sm border-0 p-3 mb-4 rounded-4">
            <textarea
              className="form-control border-0 bg-light"
              rows="2"
              placeholder="Escribe un aporte o duda..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              style={{ resize: "none" }}
            ></textarea>
            <div className="text-end mt-2">
              <button
                onClick={handleCommentSubmit}
                className="btn btn-primary rounded-pill px-4"
              >
                Comentar
              </button>
            </div>
          </div>

          {/* Lista de comentarios */}
          <div className="mt-4">
            {comments.map((c) => {
              const userData = JSON.parse(localStorage.getItem("user"));
              const isOwner = userData && userData.id === c.userId;
              const isEditing = editingCommentId === c.id;

              return (
                <div key={c.id} className="mb-3 p-3 bg-white rounded-4 shadow-sm border-0">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div className="d-flex align-items-center">
                      <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3"
                           style={{ width: "35px", height: "35px", fontSize: "0.9rem" }}>
                        {getInitial(c.User?.name)}
                      </div>
                      <div>
                        <strong className="d-block text-dark small">
                          {c.User?.name || "Usuario"}
                        </strong>
                        <small className="text-muted" style={{ fontSize: "0.7rem" }}>
                          {new Date(c.createdAt).toLocaleDateString()}
                        </small>
                      </div>
                    </div>
                    {isOwner && !isEditing && (
                      <div>
                        <button onClick={() => { setEditingCommentId(c.id); setEditContent(c.content); }} className="btn btn-link text-primary p-1"><i className="bi bi-pencil"></i></button>
                        <button onClick={() => handleDeleteComment(c.id)} className="btn btn-link text-danger p-1"><i className="bi bi-trash"></i></button>
                      </div>
                    )}
                  </div>
                  <p className="mb-0 text-secondary ps-md-5" style={{ fontSize: "0.95rem" }}>
                    {c.content}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div> {/* Fin col-lg-8 */}
    </div> {/* Fin row */}
  </div>
);
}

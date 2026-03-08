import { useEffect } from "react";
import api from "../api/axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const categoryStyles = {
  "Desarrollo Web": {
    icon: "🌐",
    color: "primary",
    bg: "rgba(13, 110, 253, 0.1)",
  },
  Ciberseguridad: { icon: "🛡️", color: "danger", bg: "rgba(220, 53, 69, 0.1)" },
  "Metodologías Ágiles": {
    icon: "🚀",
    color: "success",
    bg: "rgba(25, 135, 84, 0.1)",
  },
  "Diseño UI/UX": { icon: "🎨", color: "info", bg: "rgba(13, 202, 240, 0.1)" },
  Default: { icon: "📚", color: "secondary", bg: "#f8f9fa" },
};

export default function SessionList() {
  const [sessions, setSessions] = useState([]);
  const [searchTerm] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    //traemos los datos con get
    const fetchSessions = async () => {
      try {
        const res = await api.get("/sessions");

        setSessions(res.data);
      } catch (error) {
        console.error("Error al traer sessions", error);
      }
    };
    fetchSessions();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta sesión?")) {
      try {
        await api.delete(`/sessions/${id}`);
        // Actualizamos la lista local para que desaparezca al instante
        setSessions(sessions.filter((s) => s.id !== id));
      } catch (error) {
        alert("No se pudo eliminar la sesión", error);
      }
    }
  };
  const filteredSessions = sessions.filter(
    (session) =>
      session.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      session.description.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  return (
    <div className="container">
      <h2 className="mb-4 text-center">Explorar Sesiones</h2>
      {/* ... (buscador) */}

      <div className="row">
        {filteredSessions.map((session) => {
          const currentUser = JSON.parse(localStorage.getItem("user"));
          const isMySession =
            Number(session.userId) === Number(currentUser?.id);
          const style =
            categoryStyles[session.Category?.name] || categoryStyles["Default"];

          return (
            <div className="col-md-4 mb-4" key={session.id}>
              {/* Añadimos una clase personalizada o estilos para el hover */}
              <div
                className={`card h-100 shadow-sm ${isMySession ? "border-primary" : "border-0"}`}
                style={{ transition: "transform 0.2s", cursor: "pointer" }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.transform = "scale(1.02)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                {/* 1. Envolvemos el cuerpo con un Link al detalle */}
                <Link
                  to={`/sessions/${session.id}`}
                  className="text-decoration-none text-dark"
                >
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <span
                        className={`badge rounded-pill text-${style.color}`}
                        style={{ backgroundColor: style.bg }}
                      >
                        {style.icon} {session.Category?.name || "General"}
                      </span>
                    </div>
                    <h5 className="card-title text-primary fw-bold">
                      {session.title}
                    </h5>
                    <p className="card-text card-description-truncate">{session.description}</p>
                    <p className="text-muted small mb-0">
                      👤 {session.User?.name || "Anónimo"}
                    </p>
                  </div>
                </Link>

                
                <div className="card-footer bg-transparent border-0 d-flex justify-content-end gap-2 pb-3">
                  {isMySession && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/edit-session/${session.id}`);
                        }}
                        className="btn btn-warning btn-sm"
                      >
                        Editar
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(session.id);
                        }}
                        className="btn btn-danger btn-sm"
                      >
                        Eliminar
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

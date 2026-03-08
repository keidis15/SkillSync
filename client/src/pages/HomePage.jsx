import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../api/axios";
import SessionCard from "../components/SessionCard";
import "animate.css";

function HomePage() {
  const [sessions, setSessions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // 1. Cargar todas las sesiones de Neon
  useEffect(() => {
    api
      .get("/sessions")
      .then((res) => {
        setSessions(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar sesiones", err);
        setLoading(false);
      });
  }, []);

  // 2. Lógica del Buscador en tiempo real
  useEffect(() => {
    api
      .get("/sessions")
      .then((res) => {
        setSessions(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar sesiones", err);
        setLoading(false);
      });
  }, []);

const filteredSessions = sessions.filter((s) => {
  const term = searchTerm.toLowerCase().trim();

  // Buscamos en el título
  const inTitle = s.title?.toLowerCase().includes(term);
  
  // Buscamos en la descripción
  const inDescription = s.description?.toLowerCase().includes(term);

  // Buscamos en la categoría (ajusta 'Category' o 'category' según tu API)
  // Usamos s.Category?.name para evitar errores si Category es undefined
  const inCategory = s.Category?.name?.toLowerCase().includes(term) || 
                     s.category?.name?.toLowerCase().includes(term);

  return inTitle || inDescription || inCategory;
});

  return (
    <div className="container py-5">
      {/* Hero Section (Texto e Imagen Profesional) */}
      <div className="row align-items-center g-5">
        <div className="col-lg-6 animate__animated animate__fadeInDown">
          <h1 className="display-3 fw-bold lh-1 mb-3 text-primary titulo-animado">
            SkillSync <span className="text-dark">Conecta tu talento.</span>
          </h1>
          <p className="lead text-muted mb-4">
            La plataforma definitiva para gestionar y compartir tus sesiones de
            aprendizaje...
          </p>
          <div className="d-grid gap-2 d-md-flex justify-content-md-start">
            <Link
              to="/register"
              className="btn btn-primary btn-lg px-4 me-md-2 shadow"
            >
              Empezar ahora
            </Link>
            <Link
              to="/sessions"
              className="btn btn-outline-secondary btn-lg px-4"
            >
              Explorar Sesiones
            </Link>
          </div>
        </div>
        <div className="col-lg-6 animate__animated animate__zoomIn">
          <img
            src="https://img.freepik.com/free-vector/web-development-programmer-engineering-and-coding-websites-augmented-reality-interface-screens-developer-project-engineer-programming-software-application-design-concept-illustration_107791-3863.jpg"
            className="img-fluid rounded-5 shadow-lg imagen-animada"
            alt="Desarrollo Web"
            style={{ maxHeight: "400px" }}
          />
        </div>
      </div>

      {/* Sección de beneficios (Ahora son FILTROS) */}
      <div className="row mt-5 pt-5 g-4 text-center border-bottom pb-5 mb-5 border-secondary-50">
        <div
          className="col-md-4"
          style={{ cursor: "pointer" }}
          onClick={() => setSearchTerm("Cybersecurity")}
        >
          <div className="p-3 hover-effect benefit-card">
            <div className="fs-1 mb-2 animate__animated hover-animate icon-container">
              🛡️
            </div>
            <h5 className="fw-bold">Seguridad Total</h5>
            <p className="text-muted small">
              Filtrar sesiones de Ciberseguridad.
            </p>
          </div>
        </div>
        <div
          className="col-md-4"
          style={{ cursor: "pointer" }}
          onClick={() => setSearchTerm("Agile")}
        >
          <div className="p-3 hover-effect benefit-card ">
            <div className="fs-1 mb-2 icon-container animate__animated hover-animate">
              🚀
            </div>
            <h5 className="fw-bold">Agilidad</h5>
            <p className="text-muted small">Filtrar por Metodologías Ágiles.</p>
          </div>
        </div>
        <div
          className="col-md-4"
          style={{ cursor: "pointer" }}
          onClick={() => setSearchTerm("Programación")}
        >
          <div className="p-3 hover-effect benefit-card">
            <div className="fs-1 mb-2  icon-container animate__animated hover-animate">
              💻
            </div>
            <h5 className="fw-bold">Full Stack</h5>
            <p className="text-muted small">Filtrar por Desarrollo Web.</p>
          </div>
        </div>
      </div>

      {/* Buscador con la X integrada */}
      <div className="text-center mb-5 p-3">
        <h1 className="display-5 fw-bold text-primary">Explora Recursos</h1>
        <p className="text-muted">
          Encuentra la sesión ideal para potenciar tus habilidades
        </p>

        <div
          className="row justify-content-center mt-4 mx-auto"
          style={{ maxWidth: "600px" }}
        >
          <div className="col-12">
            <div className="input-group shadow-sm rounded-pill border overflow-hidden bg-white">
              <span className="input-group-text bg-transparent border-0 ps-3">
                <i className="bi bi-search text-primary"></i>
              </span>
              <input
                type="text"
                className="form-control border-0 py-2 shadow-none"
                placeholder="Buscar por título o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {/* Botón X dentro del input group */}
              {searchTerm && (
                <button
                  className="btn bg-transparent border-0 pe-3 text-muted"
                  onClick={() => setSearchTerm("")}
                  type="button"
                >
                  <i className="bi bi-x-circle-fill"></i>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Grid de Sesiones */}
      {loading ? (
        <div className="text-center py-5">Cargando sesiones...</div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {filteredSessions.length > 0 ? (
            filteredSessions.map((session) => (
              <div key={session.id} className="col-md-6 col-lg-4 mb-4">
                <SessionCard session={session} />
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <div className="bg-light rounded-4 p-5 border border-dashed">
                <i className="bi bi-search-heart display-1 text-muted opacity-50"></i>
                <h4 className="mt-3 text-secondary">No hay resultados</h4>
                <p className="text-muted">
                  Intenta con otras palabras clave o revisa la ortografía.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default HomePage;

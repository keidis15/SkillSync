import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

function ProfilePage() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [stats, setStats] = useState({ total: 0, latest: "" });
  const navigate = useNavigate();
  // Estados para la edición
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    profilePic: user.profilePic || "",
    jobTitle: user.jobTitle || "Usuario Full Stack",
    certifications:
      user.certifications || "Agrega una corta descripción de tus certificaciones",
  });

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const response = await api.get("/sessions");
        const mySessions = response.data.filter(
          (s) => Number(s.userId) === Number(user.id),
        );
        setStats({
          total: mySessions.length,
          latest: mySessions.length > 0 ? mySessions[0].title : "Ninguna aún",
        });
      } catch (error) {
        console.error("Error al cargar estadísticas", error);
      }
    };
    fetchUserStats();
  }, [user.id]);

  const handleSave = async () => {
    try {
      await api.put(`/users/${user.id}`, formData);

      // Actualizamos el estado local y el localStorage
      const updatedUser = { ...user, ...formData };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      setIsEditing(false);
      alert("¡Perfil actualizado!");
    } catch (error) {
      alert("Error al actualizar el perfil", error);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow border-0 rounded-4 overflow-hidden">
            <div className="bg-primary p-5 text-center text-white">
              {isEditing ? (
                <div className="container px-5">
                  onChange=
                  {(e) => {
                    const file = e.target.files[0];

                    // Validación de tamaño (1MB = 1048576 bytes)
                    if (file && file.size > 1048576) {
                      alert(
                        "La imagen es muy pesada. El máximo permitido es 1MB.",
                      );
                      e.target.value = ""; // Limpiamos el input
                      return;
                    }

                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setFormData({ ...formData, profilePic: reader.result });
                    };
                    if (file) reader.readAsDataURL(file);
                  }}
                  <input
                    type="text"
                    className="form-control form-control-sm mb-2"
                    placeholder="Título profesional"
                    value={formData.jobTitle}
                    onChange={(e) =>
                      setFormData({ ...formData, jobTitle: e.target.value })
                    }
                  />
                </div>
              ) : (
                <div className="text-center">
                  <img
                    src={
                      user.profilePic ||
                      `https://ui-avatars.com/api/?name=${user.name}&background=random`
                    }
                    className="rounded-circle mb-3 shadow border border-4 border-white"
                    style={{
                      width: "120px",
                      height: "120px",
                      objectFit: "cover",
                    }}
                    alt="Profile"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${user.name}`;
                    }}
                  />
                  <h2 className="fw-bold">{user.name}</h2>
                  <span className="badge bg-light text-primary rounded-pill">
                    {user.jobTitle || "Usuario Full Stack"}
                  </span>
                </div>
              )}
            </div>

            <div className="card-body p-4">
              <div className="row text-center mt-3">
                <div
                  className="col-md-6 border-end"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/mis-sesiones")} // Nueva ruta
                >
                  <h3 className="fw-bold text-primary">{stats.total}</h3>
                  <p className="text-muted small uppercase">Sesiones Creadas</p>
                </div>
                <div className="col-md-6">
                  <h6 className="text-muted small mb-1">Última Publicación</h6>
                  <p className="fw-semibold text-truncate px-3">
                    {stats.latest}
                  </p>
                </div>
              </div>

              <hr className="my-4" />

              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex flex-column">
                  <h5 className="mb-0">Certificaciones Vinculadas</h5>

                  {isEditing ? (
                    <textarea
                      className="form-control mt-2"
                      value={formData.certifications}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          certifications: e.target.value,
                        })
                      }
                    />
                  ) : (
                    <p className="text-muted small">
                      {user.certifications ||
                        "AIEP Web Dev | Santander Cybersecurity"}
                    </p>
                  )}
                </div>
                {isEditing ? (
                  <div>
                    <button
                      className="btn btn-success me-2"
                      onClick={handleSave}
                    >
                      Guardar
                    </button>
                    <button
                      className="btn btn-light"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => setIsEditing(true)}
                  >
                    <i className="bi bi-pencil me-1"></i> Editar Perfil
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;

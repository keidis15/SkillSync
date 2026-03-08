
import { Link } from "react-router-dom";

const SessionCard = ({ session }) => {
  return (
    <div className="card h-100 shadow-sm border-0 rounded-4 overflow-hidden">
      <div className="card-body p-4">
        <span className="badge bg-light text-primary mb-2">
          {session.Category?.name || "General"}
        </span>
        <h5 className="card-title fw-bold text-dark">{session.title}</h5>
        <p className="card-text text-secondary small text-truncate">
          {session.description}
        </p>
        <Link to={`/sessions/${session.id}`} className="btn btn-outline-primary btn-sm rounded-pill w-100 mt-3">
          Ver Detalles
        </Link>
      </div>
    </div>
  );
};

export default SessionCard;
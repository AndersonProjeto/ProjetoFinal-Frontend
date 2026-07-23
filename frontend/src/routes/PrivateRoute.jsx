import { Navigate } from "react-router-dom";
import { sessao } from "../client/sessao";

export function PrivateRoute({ children }) {
  if (!sessao.autenticado()) {
    return <Navigate to="/" replace />;
  }

  return children;
}

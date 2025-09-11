
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
    const { token, user, loading } = useAuth();

    if (loading) return <p>Chargement...</p>;
    if (!token || !user) return <Navigate to="/login" replace />;

    return children;
};

export default PrivateRoute;

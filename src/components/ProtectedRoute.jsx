import { Navigate } from "react-router-dom"

export default function ProtectedRoute({ children }) {
    const token = localStorage.getItem("token")
    const user = localStorage.getItem("user")

    // Check if user is authenticated
    if (!token || !user) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" replace />
    }

    // Verify user data is valid JSON
    try {
        JSON.parse(user)
    } catch (e) {
        // Clear invalid data and redirect
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        return <Navigate to="/login" replace />
    }

    // User is authenticated, render the protected content
    return children
}

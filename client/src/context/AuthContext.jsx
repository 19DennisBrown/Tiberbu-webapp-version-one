import { createContext, useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();
export default AuthContext;

export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(() =>
        localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null
    );
    const [user, setUser] = useState(() => {
        try {
            return localStorage.getItem('authTokens')
                ? jwtDecode(JSON.parse(localStorage.getItem('authTokens')).access)
                : null;
        } catch (error) {
            console.error("Error decoding token:", error);
            return null;
        }
    });
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    // Login User
    const loginUser = async (e) => {
        e.preventDefault();
        let response = await fetch('http://127.0.0.1:8000/api/token/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: e.target.username.value,
                password: e.target.password.value
            })
        });

        let data = await response.json();

        if (response.status === 200) {
            setAuthTokens(data);
            setUser(jwtDecode(data.access));
            localStorage.setItem('authTokens', JSON.stringify(data));
            navigate('/');
        } else {
            alert('Invalid credentials');
        }
    };

    // Register User
    const registerUser = async (e) => {
        e.preventDefault();
        let response = await fetch('http://127.0.0.1:8000/api/register/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: e.target.username.value,
                password: e.target.password.value,
                email: e.target.email.value
            })
        });

        let data = await response.json();

        if (response.status === 201) {
            alert('Registration successful!');
            navigate('/login'); // Redirect to login after registration
        } else {
            alert('Registration failed!');
        }
    };

    // Logout User
    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('authTokens');
        setLoading(false);
        navigate('/login');
    };

    const updateToken = async () => {
        if (!authTokens?.refresh) {
            logoutUser();
            setLoading(false);
            return;
        }

        try {
            let response = await fetch('http://127.0.0.1:8000/api/token/refresh/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh: authTokens.refresh }),
            });

            if (response.status === 200) {
                let data = await response.json();
                setAuthTokens(data);
                setUser(jwtDecode(data.access));
                localStorage.setItem('authTokens', JSON.stringify(data));
            } else {
                logoutUser();
            }
        } catch (error) {
            console.error("Failed to refresh token:", error);
            logoutUser();
        }

        setLoading(false);
    };

    useEffect(() => {
        if (!authTokens) {
            setLoading(false); // No token? Stop loading
            return;
        }

        updateToken(); // Only run once on mount

        let interval = setInterval(() => {
            setAuthTokens((prevTokens) => {
                if (!prevTokens) return null; // Prevent running if no tokens exist
                updateToken();
                return prevTokens;
            });
        }, 1000 * 60 * 4); // Refresh every 4 minutes

        return () => clearInterval(interval);
    }, []); // ✅ Empty dependency array prevents infinite re-renders

    return (
        <AuthContext.Provider value={{ user, authTokens, loginUser, logoutUser, registerUser }}>
            {loading ? <p>Loading...</p> : children}
        </AuthContext.Provider>
    );
};

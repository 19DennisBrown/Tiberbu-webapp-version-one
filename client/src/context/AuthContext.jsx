import { createContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from "jwt-decode";
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext();
export default AuthContext;

export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(() => {
        try {
            const savedTokens = localStorage.getItem('authTokens');
            return savedTokens ? JSON.parse(savedTokens) : null;
        } catch (error) {
            console.error("Error parsing authTokens:", error);
            return null;
        }
    });
    
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();

    // Unified state update function
    const updateAuthState = useCallback((tokens) => {
        localStorage.setItem('authTokens', JSON.stringify(tokens));
        setAuthTokens(tokens);
    }, []);

    // User state derivation
    useEffect(() => {
        if (authTokens) {
            try {
                const decoded = jwtDecode(authTokens.access);
                setUser(decoded);
                setLoading(false);
            } catch (error) {
                console.error("Token validation error:", error);
                logoutUser();
            }
        } else {
            setUser(null);
            setLoading(false);
        }
    }, [authTokens]);

    // Automatic navigation handling
    useEffect(() => {
      if (!loading) {
          const isAuthPage = ['/', '/register'].includes(location.pathname);
          
          if (user && isAuthPage) {
              // Redirect authenticated users away from auth pages
              navigate('/home');
          } else if (!user && !isAuthPage) {
              // Redirect unauthenticated users to login
              navigate('/');
          }
      }
  }, [user, loading, navigate, location.pathname]);

    const registerUser = async (e) => {
        e.preventDefault();
        
        try {
            const registrationData = {
                username: e.target.username.value.trim(),
                email: e.target.email.value.trim(),
                password: e.target.password.value,
                role: e.target.role.value.trim(),
            };

            // Registration
            const registerResponse = await fetch('http://127.0.0.1:8000/user/register/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(registrationData),
            });

            if (!registerResponse.ok) {
                const errorData = await registerResponse.json();
                throw new Error(errorData.detail || 'Registration failed');
            }

            // Automatic login after registration
            const loginResponse = await fetch('http://127.0.0.1:8000/user/token/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: registrationData.username,
                    password: registrationData.password,
                }),
            });

            if (!loginResponse.ok) {
                throw new Error('Auto-login failed');
            }

            const tokens = await loginResponse.json();
            updateAuthState(tokens);
            return '';
        } catch (error) {
            console.error('Registration error:', error);
            return error.message || 'Registration failed';
        }
    };

    const loginUser = async (e, setError) => {
        e.preventDefault();
        
        try {
            const response = await fetch('http://127.0.0.1:8000/user/token/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: e.target.username.value,
                    password: e.target.password.value
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || 'Login failed');
            }

            const tokens = await response.json();
            updateAuthState(tokens);
        } catch (error) {
            console.error("Login error:", error);
            setError(error.message || 'Login failed');
        }
    };

    const logoutUser = useCallback(() => {
        localStorage.removeItem('authTokens');
        setAuthTokens(null);
    }, []);

    const updateToken = useCallback(async () => {
        if (!authTokens?.refresh) {
            logoutUser();
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8000/user/token/refresh/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refresh: authTokens.refresh }),
            });

            if (!response.ok) throw new Error('Token refresh failed');

            const data = await response.json();
            const newTokens = { ...authTokens, access: data.access };
            updateAuthState(newTokens);
        } catch (error) {
            console.error("Token refresh error:", error);
            logoutUser();
        }
    }, [authTokens, logoutUser, updateAuthState]);

    // Token refresh system
    useEffect(() => {
        let intervalId;

        if (authTokens) {
            // Immediate check on mount
            const checkToken = async () => {
                try {
                    const decoded = jwtDecode(authTokens.access);
                    if (decoded.exp * 1000 < Date.now() + 10000) { // 10s buffer
                        await updateToken();
                    }
                } catch (error) {
                    logoutUser();
                }
            };

            checkToken();
            
            // Set up periodic refresh
            intervalId = setInterval(() => {
                updateToken();
            }, 1000 * 60 * 14); // 14 minutes
        }

        return () => clearInterval(intervalId);
    }, [authTokens, updateToken, logoutUser]);

    return (
        <AuthContext.Provider value={{
            user,
            authTokens,
            loginUser,
            logoutUser,
            registerUser,
            loading
        }}>
            {loading ? (
                       <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50 flex flex-col justify-center items-center">
                       <div className="relative">
                         {/* Main spinner */}
                         <div className="w-20 h-20 border-4 border-blue-100 rounded-full"></div>
                         <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full absolute top-0 left-0 animate-spin"></div>
             
                         {/* Optional pulse effect */}
                         <div className="absolute inset-0 flex justify-center items-center">
                           <div className="w-16 h-16 bg-blue-600 rounded-full animate-ping opacity-20"></div>
                         </div>
             
                         {/* Optional loading text */}
                         <p className="mt-4 text-blue-600 font-medium text-lg">
                           Processing...
                         </p>
                       </div>
                     </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
};
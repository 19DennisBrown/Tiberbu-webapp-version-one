import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './utils/PrivateRoute';
import { AuthProvider } from './context/AuthContext';

import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import Profile from './pages/Profile/Profile';
import ProfileUpdate from './pages/Profile/ProfileUpdate';
// import PhysicianPatient from './pages/Physician/PhysicianPatient';


import LandingPage from './components/LandingPage/LandingPage';
import Blog from './components/LandingPage/Blog';
import Services from './components/LandingPage/Services';
import About from './components/LandingPage/About';
import Chat from './pages/Chat/Chat';


import ViewProfile from './pages/Profile/ViewProfile';
import PhysicianPatient from './Physician/PhysicianPatient';
import CreateIllness from './Illness/CreateIllness';
import UpdateIllness from './Illness/UpdateIllness';
import PhysicianIllness from './Physician/PhysicianIllness';
import ViewIllnesses from './Illness/ViewIllnesses';
import PatientForPhysician from './Patient/PatientForPhysician';

function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <Routes>

            {/* Homepage */}
            <Route path="/home" element={<PrivateRoute><HomePage /></PrivateRoute>} />

            {/* Profile */}
            <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/view_profile/:user_id" element={<PrivateRoute><ViewProfile /></PrivateRoute>} />
            <Route path="/update_profile/:user_id" element={<PrivateRoute><ProfileUpdate /></PrivateRoute>} />

            {/* ONE PATIENT */}
            <Route path="/patient/:user_id" element={<PrivateRoute><PatientForPhysician /></PrivateRoute>} />
            {/* List of Patients for a specific Physician */}
            <Route path="/physician_patient/:user_id" element={<PrivateRoute><PhysicianPatient /></PrivateRoute>} />

            {/* List of illness attended for a specific Physician */}
            <Route path="/physician_illness/:user_id" element={<PrivateRoute><PhysicianIllness /></PrivateRoute>} />

            {/* Illness routes */}
            {/* view */}
            <Route path="/patients/:user_id/illnesses" element={<PrivateRoute><ViewIllnesses /></PrivateRoute>} />
            {/* add */}
            <Route path="/add_illness" element={<PrivateRoute><CreateIllness /></PrivateRoute>} />

            {/* update */}
            <Route path="/update_illness/:illness_id" element={<PrivateRoute>< UpdateIllness/></PrivateRoute>} />


            {/* chat */}
            <Route path="/chat/:user_id" element={<PrivateRoute><Chat /></PrivateRoute>} />

            {/* auth */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* landing page */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
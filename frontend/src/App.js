import Footer           from "./components/Footer";
import Header           from "./components/Header";
import { ToastContainer } from 'react-toastify';
import { HashRouter, Routes, Route } from "react-router-dom";
import Home             from "./pages/Home";
import Register         from "./pages/Register";
import Login            from "./pages/Login";
import Dashboard        from "./pages/Dashboard";
import { AuthProvider } from "./context/AuthContext";
import RequireAuth      from "./components/RequireAuth";
import Survey           from "./pages/Survey";
import ThankYou         from "./pages/ThankYou";
import Contact          from "./pages/Contact";
import AboutUs         from "./pages/AboutUs";
import RedirectIfAuth   from "./components/RedirectIfAuth";
import NotFound         from "./pages/NotFound";
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
      <HashRouter>
        <AuthProvider>
        <Header />
        <ToastContainer position="top-right" autoClose={5000} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/register"
            element={
              <RedirectIfAuth>
                <Register />
              </RedirectIfAuth>
            }
          />
          <Route
            path="/login"
            element={
              <RedirectIfAuth>
                <Login />
              </RedirectIfAuth>
            }
          />
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
          <Route
            path="/survey/:id"
            element={
              <Survey />
            }
          />
          <Route
            path="/thankYou"
            element={
              <ThankYou />
            }
          />
          <Route
            path="/contact"
            element={
              <Contact />
            }
          />
           <Route
            path="/about"
            element={
              <AboutUs />
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
        </AuthProvider>
      </HashRouter>
  );
}

export default App;
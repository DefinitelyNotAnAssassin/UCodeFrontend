import { createBrowserRouter } from "react-router-dom";

import { Applayout } from "./components/layouts/AppLayout";

import NoMatch from "./pages/NoMatch";
import LandingPage from "./pages/LandingPage";
import CoursesPage from "./pages/Courses";
import ResourcesPage from "./pages/Resources";
import CommunityPage from "./pages/Community";
import AboutPage from "./pages/About";
import { Sign } from "crypto";
import ProtectedRoute from "./pages/ProtectedRoute";
import SignUpPage from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import StudentDashboard from "./pages/Dashboard";
import { AuthProvider } from "./contexts/AuthContext";
import SignOut from "./pages/SignOut";
import CourseDetailPage from "./pages/CourseDetail";
import ActivityPage from "./pages/ActivityPage";
import AdminDashboard from "./pages/AdminDashboard";
import CertificatePage from "./pages/CertificatePage";




export const router = createBrowserRouter([
    {
        path: "/",
        element: <ProtectedRoute authenticated={<StudentDashboard />}  unauthenticated={<LandingPage />} />,
    },

    {
        path: "/courses",   
        element: <CoursesPage />,
    },
    {
        path: "/courses/:id",
        element: <CourseDetailPage />,
    },
    {
        path: "/activity/:id",
        element: <ActivityPage />,
    },
    {
        path: "/resources",
        element: <ResourcesPage />,
    },
    {
        path: "/community",
        element: <CommunityPage />,
    },
    {
        path: "/sign_up",   
        element: <SignUpPage />,
    },
    {
        path: "/sign_in", 
        element: <SignIn />,
    },
    {
        path: "/logout",
        element: <SignOut />,
    },
    {
        path: "/admin_dashboard",   
        element: <AdminDashboard />,
    },

    {
        path: "/certificates/:id",
        element: <CertificatePage />,
    },
    {
        path: "*",
        element: <NoMatch />,
    }

])

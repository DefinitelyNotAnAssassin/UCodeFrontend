import { createBrowserRouter } from "react-router-dom";

import { Applayout } from "./components/layouts/AppLayout";

import NoMatch from "./pages/NoMatch";
import LandingPage from "./pages/LandingPage";
import CoursesPage from "./pages/Courses";
import ResourcesPage from "./pages/Resources";
import CommunityPage from "./pages/Community";
import AboutPage from "./pages/About";


export const router = createBrowserRouter([
    {
        path: "/",
        element: <LandingPage />,
    },
    {
        path: "/courses",   
        element: <CoursesPage />,
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
        path: "/about", 
        element: <AboutPage />,

    },
    {
        path: "*",
        element: <NoMatch />,
    }

])

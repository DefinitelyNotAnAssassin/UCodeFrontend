import { RouterProvider } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { router } from "./Router";
import { Toast } from "./components/ui/toast";
import { Toaster } from "./components/ui/toaster";

export default function App() {
    return (
        <AuthProvider>
            <Toaster />
            <RouterProvider router={router} />
        </AuthProvider>
       
    )
}

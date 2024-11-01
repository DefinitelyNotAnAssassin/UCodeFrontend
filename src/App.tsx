import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { router } from "./Router";

export default function App() {
    return (
            <RouterProvider router={router} />
    )
}

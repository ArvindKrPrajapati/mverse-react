import { createBrowserRouter } from "react-router-dom";
import Home from '../pages/Home'
import Play from "../pages/Play";
import Search from "../pages/Search";
export const router = createBrowserRouter([
    {
        path: "/",
        element: <Home tv={false} />,
    },
    {
        path: "/tv",
        element: <Home tv={true} />,
    },
    {
        path: "/tv/play/:id/:s/:e",
        element: <Play tv={true} />
    },
    {
        path: "/search",
        element: <Search />,
    },
    {
        path: "/movie/play/:id",
        element: <Play tv={false} />
    }
]);

import { createBrowserRouter } from "react-router-dom";
import Cateogory from "../pages/Cateogory";
import Home from '../pages/Home'
import Play from "../pages/Play";
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
        path: "/:cat",
        element: <Cateogory />,
    },
    {
        path: "/movie/play/:id",
        element: <Play tv={false} />
    }
]);

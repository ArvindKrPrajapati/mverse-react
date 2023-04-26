import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import Play from "../pages/Play";
import Search from "../pages/Search";
import Cateogory from "../pages/Cateogory";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";

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
    element: <Play tv={true} />,
  },
  {
    path: "/search",
    element: <Search />,
  },
  {
    path: "/movie/play/:id",
    element: <Play tv={false} />,
  },
  {
    path: "/movie/:cat/:id/:page",
    element: <Cateogory tv={false} />,
  },
  {
    path: "/tv/:cat/:id/:page",
    element: <Cateogory tv={true} />,
  },
  {
    path: "/movie/:cat/:page",
    element: <Cateogory tv={false} />,
  },
  {
    path: "/tv/:cat/:page",
    element: <Cateogory tv={true} />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

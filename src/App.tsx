import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./routes/Home";
import ErrorPage from "./routes/ErrorPage";

const routes = [
  {
      path: "/",
      element: <Home />,
      errorElement: <ErrorPage/>,

  },
];

const router = createBrowserRouter(routes, {
  basename: "/discovraphy"
});

export default function App(){
  return <RouterProvider router={router}/>
}
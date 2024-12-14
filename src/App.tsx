import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./routes/Home";
import Error from "./routes/Error";

const routes = [
  {
      path: "/",
      element: <Home />,
      errorElement: <Error/>,

  },
];

const router = createBrowserRouter(routes, {
  future: {
    v7_relativeSplatPath: true,
    v7_fetcherPersist: true,
    v7_normalizeFormMethod: true,
    v7_partialHydration: true,
  },
  basename: "/discovraphy/"
});

export default function App(){
  return <RouterProvider router={router}/>
}
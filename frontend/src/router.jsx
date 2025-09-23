import App from "./App";
import DeployVM from "./pages/DeployVM";
import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/login";
import HomePage from "./pages/HomePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    //errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "/login",
        element: <Login />,
        
      },
      {
        path: "/vm/create",
        element: <DeployVM />,
        //action: vmCreationAction,
      },
      {
        path: "/service/deploy",
        //element: <ServiceDeployment />,
      },
      {
        path: "/infrastructure",
        //element: <InfrastructureTracking />,
        //loader: infrastructureLoader,
      },
    ],
  },
]);
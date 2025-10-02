import App from "./App";
import DeployVM from "./pages/DeployVM";
import { createBrowserRouter } from "react-router-dom";
import Login from "./pages/login";
import HomePage from "./pages/HomePage";
import SignUp from "./pages/signup";
import InfraView from "./pages/InfraView";
import VMPage from "./pages/VMPage";
import { infrastructureLoader } from "./loader";



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
        element: <HomePage/>,
      },
      {
        path: "/signup",
        element: <SignUp />,
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
        path: "/infrastructure-view",
        element: <InfraView />,
        loader: infrastructureLoader ,
      },
      {
        path: "/vm/:vm_id",
        element: <VMPage />,
      },
    ],
  },
]);
import { Link } from "react-router-dom";
import Login from "./login";
import { useState } from "react";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { MonitorPlay } from "lucide-react";

function HomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 [text-shadow:2px_2px_6px_rgba(0,0,0,0.2)]">Welcome to Crossland Infra.</h1>

      {!isLoggedIn && <Login setIsLoggedIn={setIsLoggedIn} />}

      {isLoggedIn && (
        <div className="space-x-4">
          <Card>
            <CardHeader>
              <CardTitle><MonitorPlay />Crossland Infrastructure</CardTitle>
              <CardDescription>
                {" "}
                Your one-stop solution for managing virtual machines and
                services.
              </CardDescription>
              <CardAction>Choose option</CardAction>
            </CardHeader>
            <CardContent className="flex [&>*]:m-4  ">
              <Link
                to="/vm/create"
                
              >
                <Button>
                Deploy a VM
                </Button>
              </Link>
              <Link
                to="/service/deploy"
              >
                <Button>
                  Deploy a Service
                </Button>
              </Link>
              <Link
                to="/infrastructure"
              >
                <Button>
                  View Infrastructure
                </Button>
              </Link>
            </CardContent>
            <CardFooter>
              
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}

export default HomePage;

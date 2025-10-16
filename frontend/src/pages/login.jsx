import { useForm, Controller } from "react-hook-form";
import { fetchData } from "../fetch";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function Login() {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    console.log("Login data:", data);
    const resp = await fetchData(data, "/api/login");
    if (resp.results == "success") {
      console.log(resp.results);
      const token = resp.token;
      localStorage.setItem("token", token);
      navigate("/");
      
    } else {
      console.log(resp.results);
      alert("Login failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 [text-shadow:2px_2px_6px_rgba(0,0,0,0.2)]">Welcome to Crossland Infra.</h1>
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
        <CardAction>
          <Button variant="link"> <Link to="/signup">Sign Up</Link></Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-6">
            <Label htmlFor="login">Login</Label>
            <Controller
              name="username"
              control={control}
              rules={{ required: true }}
              defaultValue=""
              render={({ field }) => (
                <Input {...field} placeholder="Username" />
              )}
            />
            <Label htmlFor="password">Password</Label>
            <Controller
              name="password"
              control={control}
              rules={{ required: true }}
              defaultValue=""
              render={({ field }) => (
                <Input {...field} type="password" placeholder="Password" />
              )}
            />
          </div>
          <CardFooter className="flex-col !p-0 !pt-6 ">
            <Button type="submit" disabled={isSubmitting} className="w-full">
              Login
            </Button>
            <Button
              onClick={() => {
                navigate("/signup");
              }}
              className="w-full mt-2"
              variant="outline"
            >
              Sign Up
            </Button>
          </CardFooter>
        </form>
      </CardContent>
    </Card>
    </div>
  );
}

export default Login;

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

function Login({ setIsLoggedIn }) {
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
    if (resp == "success") {
      console.log(resp);
      setIsLoggedIn(true);
    } else {
      console.log(resp);
      alert("Login failed");
    }
  };

  return (
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
  );
}

export default Login;

import { useForm, Controller } from "react-hook-form";
import { fetchData } from "../fetch";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

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

/* todo : we are registered after we need to login 
redirect to sign in page */
/* todo : add a button on login page to permit registration
 */
function SignUp(  ) {
  const { 
    control, 
    handleSubmit, 
    formState: { isSubmitting } } 
    = useForm({
    defaultValues: {
        username: "",
        password: ""
    }
  });

  const navigate = useNavigate();

  const onSubmit = async (data) => {
    console.log("SignUp data:", data);
    const resp = await fetchData(data, "/api/sign-up")
    if (resp.results == "success") {
      console.log(resp.results);
        navigate("/login");
    }
    else {
      console.log(resp.results);
      alert("registration failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen w-full bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 [text-shadow:2px_2px_6px_rgba(0,0,0,0.2)]">Welcome to Crossland Infra.</h1>
    <Card className="w-full max-w-sm ">
      <CardHeader>
        <CardTitle>Create your account</CardTitle>
        <CardDescription>
          Enter your pseudo and password below to create your account
        </CardDescription>
        <CardAction>
          <Button variant="link"> <Link to="/login">Sign in</Link></Button>
        </CardAction>
      </CardHeader>
      <CardContent>
    
      <form onSubmit={handleSubmit(onSubmit)}>
        <Label htmlFor="login" className="mt-4 mb-2">Username</Label>
        <Controller
          name="username"
          control={control}
          rules={{ required: true }}
          defaultValue=""
          render={({ field }) => <Input {...field} placeholder="Username" />}
        />
        <Label htmlFor="password" className="mt-4 mb-2">Password</Label>
        <Controller
          name="password"
          control={control}
          rules={{ required: true }}
          defaultValue=""
          render={({ field }) => (
            <Input {...field} type="password" placeholder="Password" />
          )}
        />
        <Button
          type="submit"
          className="w-full mt-4"
          disabled={isSubmitting}
        >
          Sign Up
        </Button>
      </form>
    </CardContent>
  </Card>
  </div>
);
}

export default SignUp;
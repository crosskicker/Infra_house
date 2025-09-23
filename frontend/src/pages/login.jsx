// todo : implement login functionality
import { useForm, Controller } from "react-hook-form";
import { fetchData } from "../fetch";

function Login( { setIsLoggedIn } ) {
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

  const onSubmit = async (data) => {
    console.log("Login data:", data);
    const resp = await fetchData(data, "/api/login")
    if (resp == "success") {
      console.log(resp);
      setIsLoggedIn(true);
    }
    else {
      console.log(resp);
      alert("Login failed");
    }
  };

  return (
    <div className="flex flex-col">
      <h1>Login Page</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Controller
          name="username"
          control={control}
          rules={{ required: true }}
          defaultValue=""
          render={({ field }) => <input {...field} placeholder="Username" />}
        />
        <Controller
          name="password"
          control={control}
          rules={{ required: true }}
          defaultValue=""
          render={({ field }) => (
            <input {...field} type="password" placeholder="Password" />
          )}
        />
        <button
          type="submit"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          disabled={isSubmitting}
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;

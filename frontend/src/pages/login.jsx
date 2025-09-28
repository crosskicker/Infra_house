import { useForm, Controller } from "react-hook-form";
import { fetchData } from "../fetch";
import { useNavigate } from "react-router-dom";

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
      <button
        onClick={() => {
          navigate("/signup");
        }}
        className="mt-4 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
      >
        Sign Up
      </button>
      <iframe
        src="https://on.tty-share.com/s/fIZVpVKEU2eYPumWj0cXX1bNS9Zy8bLc38pg-F3P8lGyEB9fkM01m3RsWpyhXY60suA/"
        title="Terminal Web"
        width="100%"
        height="600"
        style={{ border: "1px solid #ccc", borderRadius: "8px" }}
      ></iframe>
    </div>
  );
}

export default Login;

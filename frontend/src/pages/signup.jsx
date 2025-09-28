import { useForm, Controller } from "react-hook-form";
import { fetchData } from "../fetch";
import { useNavigate } from "react-router-dom";

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
    if (resp == "success") {
      console.log(resp);
        navigate("/login");
    }
    else {
      console.log(resp);
      alert("registration failed");
    }
  };

  return (
    <div className="flex flex-col">
      <h1>SignUp Page</h1>
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
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default SignUp;
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SelectList from './components/SelectList'
import { useForm, Controller } from "react-hook-form";

function App() {
  // TODO : recuperer la liste des OS depuis le backend (fetch)
  const [os, setOs] = useState(["Ubuntu", "Debian", "Fedora", "Arch Linux"]);

  // For Action with react-router-dom
  //const submit = useSubmit();

    const {
    register,
    control, // Utilisation de control pour intégrer react-select via Controller
    handleSubmit,
    clearErrors,
    setError,
    formState: { errors, isSubmitting, isSubmitSuccessful, isSubmitted },
  } = useForm({
    defaultValues: {
      OS: "",
      
    },
  });


  function mySubmit(values) {
   /*  submit(values, {
      method: "post",
    }); */
    console.log(values)
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        


        <form
        className="flex flex-auto flex-col justify-around items-center "
        onSubmit={handleSubmit(mySubmit)}
      >
        <div className="flex w-72 justify-between">
          <label className="ds-formcontrol-label">OS </label>
          <Controller
            name="OS"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <SelectList
                {...field}
                tab={os}
                onChange={(selectedOption) => {
                  field.onChange(selectedOption.value); // ← injecte la valeur dans react-hook-form
                  //fetchCountryList(selectedOption.value); // ← appelle ta fonction fetch
                }}
                id="OS"
              />
            )}
          />
        </div>
        </form>


        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App

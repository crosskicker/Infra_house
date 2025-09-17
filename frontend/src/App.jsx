import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SelectList from './components/SelectList'
import { useForm, Controller } from "react-hook-form";

function App() {
  // TODO : recuperer la liste des OS depuis le backend (fetch)
  const [os, setOs] = useState(["Ubuntu", "Debian", "Fedora", "Arch Linux"]);
  const [Vcpu, setVcpu] = useState(["1", "2", "4", "8"]);
  const [Memory, setMemory] = useState(["1", "2", "4", "8", "16"]);
  const [Disk, setDisk] = useState(["10", "20", "50", "100"]);

  // Pour soumettre le formulaire
  //import { useSubmit } from "react-router-dom";
  //import { useForm, Controller } from "react-hook-form";

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
      Vcpu: "",
      Memory: "",
      Disk: "",
      
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
      <div className="flex flex-col">
        


        <form
        className="flex flex-auto flex-col justify-around items-center "
        onSubmit={handleSubmit(mySubmit)}
      >
        <div className="flex w-72  justify-between">
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

        <div className="flex w-72  justify-between">
          <label className="ds-formcontrol-label">Vcpu </label>
          <Controller
            name="Vcpu"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <SelectList
                {...field}
                tab={Vcpu}
                onChange={(selectedOption) => {
                  field.onChange(selectedOption.value); // ← injecte la valeur dans react-hook-form
                  //fetchCountryList(selectedOption.value); // ← appelle ta fonction fetch
                }}
                id="Vcpu"
              />
            )}
          />
        </div>

        <div className="flex w-72    justify-between">
          <label className="ds-formcontrol-label">Memory </label>
          <Controller
            name="Memory"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <SelectList
                {...field}
                tab={Memory}
                onChange={(selectedOption) => {
                  field.onChange(selectedOption.value); // ← injecte la valeur dans react-hook-form
                  //fetchCountryList(selectedOption.value); // ← appelle ta fonction fetch
                }}
                id="Memory"
              />
            )}
          />
        </div>

        <div className="flex w-72  justify-between">
          <label className="ds-formcontrol-label">Disk </label>
          <Controller
            name="Disk"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <SelectList
                {...field}
                tab={Disk}
                onChange={(selectedOption) => {
                  field.onChange(selectedOption.value); // ← injecte la valeur dans react-hook-form
                  //fetchCountryList(selectedOption.value); // ← appelle ta fonction fetch
                }}
                id="Disk"
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

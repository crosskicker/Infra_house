import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SelectList from './components/SelectList'
import { useForm, Controller } from "react-hook-form";
import { fetchData } from './fetch'

function App() {
  // TODO : recuperer la liste des OS depuis le backend (fetch)
  const [os, setOs] = useState(["Other","Ubuntu", "Debian", "Fedora", "Arch Linux"]); //todo insérer une iso si other
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
      ssh_key: "ssh-test",
      
    },
  });


async function mySubmit(values) {
  console.log("Données à envoyer :", values);
  const response = await fetchData(values, "/api/create-vm");
}

  return (
    <>
      <div>
       
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      
      <div className="flex flex-col">
        


        <form
        className="flex flex-auto flex-col justify-around items-center "
        onSubmit={handleSubmit(mySubmit)}
        >
        <div className="flex w-72  justify-between">
          <label className="">OS </label>
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
          <label className="">Vcpu </label>
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
          <label className="">Memory </label>
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
          <label className="">Disk </label>
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

        <div  className="flex w-72  justify-between">
          <label className="">SSH Key</label>
          <div className="">
            <input
              id="ssh_key"
              className="border-2 "
              type="text"
              placeholder=""
              {...register("ssh_key")}
            />
          </div>
        </div>
        <button
          type="submit"
          className=" text-black font-bold py-2 px-4 rounded"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>

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

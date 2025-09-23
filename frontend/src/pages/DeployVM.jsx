import { useState } from "react";

import { useForm, Controller } from "react-hook-form";
import SelectList from "../components/SelectList";
import { fetchData } from "../fetch";

function DeployVM() {
  // TODO : recuperer la liste des OS depuis le backend (fetch)
  const [os, setOs] = useState([
    "Other",
    "Ubuntu",
    "Debian",
    "Fedora",
    "Arch Linux",
  ]); //todo insérer une iso si other
  const [Vcpu, setVcpu] = useState(["1", "2", "4", "8"]);
  const [Memory, setMemory] = useState(["1", "2", "4", "8", "16"]);
  const [Disk, setDisk] = useState(["10", "20", "50", "100"]);
  const [name, setName] = useState("myvm"); // TODO : 1 UNIQUE name per VM
  const [network, setNetwork] = useState(["NAT", "bridge"]); // TODO : liste des réseaux en dur
  const [description, setDescription] = useState(""); // TODO : description optionnelle

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
      OS: "", // TODO : let user insert a new os if other
      Vcpu: "",
      Memory: "",
      Disk: "",
      ssh_key: "rsa-<key>", //TODO file or text area ?!
      name: "myvm", // TODO : 1 UNIQUE name per VM
      network: "default", // TODO : liste des réseaux en dur
      description : "", // TODO : description optionnelle
    },
  });

  async function mySubmit(values) {
    console.log("Données à envoyer :", values);
    const response = await fetchData(values, "/api/create-vm");
  }

  return (
    <div className="flex flex-col">
      <form
        className="flex flex-auto flex-col justify-around items-center "
        onSubmit={handleSubmit(mySubmit)}
      >
        <div className="flex w-72  justify-between p-2 pl-0">
          <label className="">VM name</label>
          <div className="">
            <input
              id="name"
              className="flex h-10 w-42 bg-gray-50 text-gray-500 rounded-lg  px-4 py-2 border border-transparent shadow-sm text-sm "
              type="text"
              placeholder=""
              {...register("name")}
            />
          </div>
        </div>
        
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

        <div className="flex w-72  justify-between">
          <label className="">Network </label>
          <Controller
            name="network"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <SelectList
                {...field}
                tab={network}
                onChange={(selectedOption) => {
                  field.onChange(selectedOption.value); // ← injecte la valeur dans react-hook-form
                  //fetchCountryList(selectedOption.value); // ← appelle ta fonction fetch
                }}
                id="network"
              />
            )}
          />
        </div>

        <div className="flex w-72  justify-between p-2 pl-0">
          <label className="">SSH Key</label>
          <div className="">
            <input
              id="ssh_key"
              className="flex min-h-[80px] w-42 bg-gray-50 text-gray-500 rounded-lg  px-4 py-2 border border-transparent shadow-sm text-sm "
              type="text"
              placeholder=""
              {...register("ssh_key")}
            />
          </div>
        </div>

        <div className="flex w-72  justify-between p-2 pl-0">
          <label className="">Description</label>
          <div className="">
            <input
              id="description"
              className="flex min-h-[80px] w-42 bg-gray-50 text-gray-500 rounded-lg  px-4 py-2 border border-transparent shadow-sm text-sm  "
              type="text"
              placeholder=""
              {...register("description")}
            />
          </div>
        </div>


        <button
          type="submit"
          className="!bg-blue-600 !hover:bg-blue-700 !text-white !font-medium !py-2 !px-4 !rounded-lg !shadow-sm !transition"
          disabled={isSubmitting}
        >
         {isSubmitting ? "Submitting..." : "Submit"} 
        </button>
      </form>

      
    </div>
  );
}

export default DeployVM;

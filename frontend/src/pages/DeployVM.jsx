import { useState } from "react";
import { useForm } from "react-hook-form";
import SelectList from "../components/SelectList";
import { fetchData } from "../fetch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function DeployVM() {
  const [os] = useState([
    "Other",
    "Ubuntu-20",
    "Debian-13",
    "Fedora",
    "Arch Linux",
  ]);
  const [Vcpu] = useState(["1", "2", "4", "8"]);
  const [Memory] = useState(["1", "2", "4", "8", "16"]);
  const [Disk] = useState(["10", "20", "50", "100"]);
  const [Network] = useState(["NAT", "bridge", "default"]);

  const form = useForm({
    defaultValues: {
      OS: "",
      Vcpu: "",
      Memory: "",
      Disk: "",
      ssh_key: "ssh-rsa AAAA",
      name: "myvm",
      Network: "default",
      description: "",
    },
  });

  async function mySubmit(values) {
    console.log("Données à envoyer :", values);
    await fetchData(values, "/api/create-vm");
  }

  return (
    <div className="flex flex-col items-center pl-0 h-full">
      <h1 className="text-2xl font-bold pt-12 pl-6 self-start">Déployer VM</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(mySubmit)}
          className="flex flex-col items-center  flex-auto space-y-6  self-start pl-6 pr-6 pt-16 pb-12  w-full h-full "
        >
          {/* Ligne 1 : Name + Description */}
          <div className="flex flex-wrap gap-6 h-[20%] w-full self-start  ">
            {/* VM Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-[48%] ">
                  <FormLabel>VM name</FormLabel>
                  <FormControl>
                    <Input placeholder="Nom de la VM" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="w-[48%] ">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Description"
                      {...field}
                      className="min-h-[40px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Ligne 2 : vCPU, Memory, Disk */}
          <div className="flex flex-wrap gap-6 h-[20%] self-start w-full">
            {/* vCPU */}
            <FormField
              control={form.control}
              name="Vcpu"
              render={({ field }) => (
                <FormItem className="w-[31%]">
                  <FormLabel>vCPU</FormLabel>
                  <FormControl>
                    <SelectList
                      {...field}
                      tab={Vcpu}
                      onChange={(selectedOption) =>
                        field.onChange(selectedOption.value)
                      }
                      className=" rounded-lg"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Memory */}
            <FormField
              control={form.control}
              name="Memory"
              render={({ field }) => (
                <FormItem className="w-[31%]">
                  <FormLabel>Memory</FormLabel>
                  <FormControl>
                    <SelectList
                      {...field}
                      tab={Memory}
                      onChange={(selectedOption) =>
                        field.onChange(selectedOption.value)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Disk */}
            <FormField
              control={form.control}
              name="Disk"
              render={({ field }) => (
                <FormItem className="w-[31%] b">
                  <FormLabel>Disk</FormLabel>
                  <FormControl>
                    <SelectList
                      {...field}
                      tab={Disk}
                      onChange={(selectedOption) =>
                        field.onChange(selectedOption.value)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Ligne 3 : OS + Network */}
          <div className="flex flex-wrap  gap-6 h-[20%] self-start w-full">
            {/* OS */}
            <FormField
              control={form.control}
              name="OS"
              render={({ field }) => (
                <FormItem className="w-[48%]">
                  <FormLabel>OS</FormLabel>
                  <FormControl>
                    <SelectList
                      {...field}
                      tab={os}
                      
                      onChange={(selectedOption) =>
                        field.onChange(selectedOption.value)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Network */}
            <FormField
              control={form.control}
              name="Network"
              render={({ field }) => (
                <FormItem className="w-[48%]">
                  <FormLabel>Network</FormLabel>
                  <FormControl>
                    <SelectList
                      {...field}
                      tab={Network}
                      onChange={(selectedOption) =>
                        field.onChange(selectedOption.value)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Ligne 4 : SSH Key */}
          <div className="flex self-start h-[20%] w-full">
            <FormField
              control={form.control}
              name="ssh_key"
              render={({ field }) => (
                <FormItem className="w-[100%]">
                  <FormLabel>SSH Key</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Clé publique SSH"
                      {...field}
                      className="min-h-[80px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Bouton Submit */}
          <div className="flex self-start w-full">
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-96"
          >
            {form.formState.isSubmitting ? "Building..." : "Build"}
          </Button>
          <Button
          className="w-96"
          variant="secondary"
          >
            Reset
          </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default DeployVM;

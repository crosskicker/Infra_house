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
    <div className="flex flex-col items-center pl-0 ">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(mySubmit)}
          className="flex flex-col items-center justify-around flex-auto space-y-6  self-start pl-6 pt-6 w-full"
        >
          {/* Ligne  : Name + Description */}
          <div className="flex flex-wrap justify-around  gap-6 w-full self-start ">
            {/* VM Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-72">
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
                <FormItem className="w-72">
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Description"
                      {...field}
                      className="min-h-[80px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* Ligne 2 : vCPU, Memory, Disk */}
          <div className="flex flex-wrap justify-around gap-6 self-start w-full">
            {/* vCPU */}
            <FormField
              control={form.control}
              name="Vcpu"
              render={({ field }) => (
                <FormItem className="w-48">
                  <FormLabel>vCPU</FormLabel>
                  <FormControl>
                    <SelectList
                      {...field}
                      tab={Vcpu}
                      onChange={(selectedOption) =>
                        field.onChange(selectedOption.value)
                      }
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
                <FormItem className="w-48">
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
                <FormItem className="w-48">
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
          <div className="flex flex-wrap justify-around gap-6 self-start w-full">
            {/* OS */}
            <FormField
              control={form.control}
              name="OS"
              render={({ field }) => (
                <FormItem className="w-72">
                  <FormLabel>OS</FormLabel>
                  <FormControl>
                    <SelectList
                      {...field}
                      tab={os}
                      className="w-64 rounded-lg"
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
                <FormItem className="w-72">
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
          <div className="flex self-start w-full">
            <FormField
              control={form.control}
              name="ssh_key"
              render={({ field }) => (
                <FormItem className="w-96">
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
          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-72"
          >
            {form.formState.isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default DeployVM;

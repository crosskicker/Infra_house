import { fetchData } from "../fetch";
import { useParams, useLocation } from "react-router-dom";
import { useState, useEffect, use } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";


function VMPage() {
/*TODO : Ne pas  oublier d'appeler getInfoVM() si on change les données de la VM */
  const [ttyShareUrl, setTtyShareUrl] = useState(
    "https://on.tty-share.com/s/bzbXSujX09LiRDZFjo9G6cHfq4TRPSQil05f1Bigh3-MhH5itdeMHZYlXgIJ6nfGZtw/"
  );

  const { vm_id } = useParams(); // récupère l'id de l'URL
  const location = useLocation();
  const [vm, setVm] = useState(location.state?.vm);
  const { /* _id, */ name, currentState, metadata } = vm;
  const nav = useNavigate();


  // Gérer les erreurs de fetch coté front et back 
  async function runShell() {
    console.log("Starting shell for VM ID:", vm_id);
    const resp = await fetchData({ vm_id: vm_id }, "/api/start-shell");
    if (resp == "error") {
      console.log(resp);
    } else {
      console.log(resp);
      setTtyShareUrl(resp);
      getInfoVM();
    }
  }

  async function destroyVM() {
    const resp = await fetchData({ vm_id: vm_id }, "/api/destroy-vm");
    if (resp == "error") {
      
      console.log(resp);
      //todo : display un msg d'erreur
    } else {
      console.log(resp);
      nav("/infrastructure-view");
      
    }
  }

  async function getInfoVM(){
    const resp = await fetchData({ vm_id: vm_id }, "/api/vm-info");
    if (resp == "error") {
      
      console.log(resp);
      
    } else {
      console.log(resp);
      setVm(resp);
    }
  }

  // refresh l'état de la VM à chaque changement des données de la VM
  useEffect(() => { 

    console.log(" useEffect changer les données de la VM")

  }, [vm_id]);

  return (
    <>
      <div className="flex m-8  ">
        <h1 className="text-xl font-semibold text-gray-800">{name}</h1>
      </div>

      <div className=" ">
        {vm ? (
          <Card className="w-full max-w-md mx-auto rounded-2xl shadow-lg hover:shadow-xl transition-shadow mb-4 ml-8">
            <CardContent className="p-4">
              {/* Titre */}
              <div className="flex items-start  justify-between mb-2">
                <h2 className="text-xl font-semibold text-gray-800">{name}</h2>
                <span
                  className={`px-2 py-1 text-sm rounded-full ${
                    currentState === "running"
                      ? "bg-green-100 text-green-700"
                      : currentState === "provisioning"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {currentState}
                </span>
              </div>

              {/* Métadonnées */}
              <div className="text-sm text-gray-600 space-y-1">
                <p>
                  <span className="font-medium">OS:</span> {metadata?.OS}
                </p>
                <p>
                  <span className="font-medium">vCPU:</span> {metadata?.Vcpu}
                </p>
                <p>
                  <span className="font-medium">RAM:</span> {metadata?.Memory}{" "}
                  GB
                </p>
                <p>
                  <span className="font-medium">Disque:</span> {metadata?.Disk}{" "}
                  GB
                </p>
                <p>
                  <span className="font-medium">Réseau:</span>{" "}
                  {metadata?.network}
                </p>
                <p>
                  <span className="font-medium">IP:</span>{" "}
                  {metadata?.ip || "N/A"}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <p>Chargement de la VM...</p>
        )}
      </div>
      <div className="flex space-x-4 mb-4">
        <Button onClick={runShell} className="bg-blue-600 hover:bg-blue-500  ">
          Run a shell
        </Button>
        <Button className="bg-blue-600 hover:bg-blue-500  ">
          Stop the shell
        </Button>
        <Button onClick={destroyVM} className="bg-blue-600 hover:bg-blue-500  ">
          Destroy the VM
        </Button>
      </div>
      <iframe
        src={ttyShareUrl}
        title="Terminal Web"
        width=" 550px "
        height="220px"
        style={{ border: "1px solid #ccc", borderRadius: "8px" }}
      ></iframe>
    </>
  );
}

export default VMPage;

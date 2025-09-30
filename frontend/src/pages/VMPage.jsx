import { fetchData } from "../fetch";
import { useParams, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

function VMPage() {
  const [ttyShareUrl, setTtyShareUrl] = useState(
    "https://blog.stephane-robert.info/docs/developper/autres-langages/yaml/"
  );

  const { vm_id } = useParams(); // récupère l'id de l'URL
  const location = useLocation();
  const [vm, setVm] = useState(location.state?.vm);

  // todo : créer un composant vm info box

  async function runShell() {
    const resp = await fetchData({"vm_id": vm_id}, "/api/start-shell");
    if (resp == "error") {
      console.log(resp);
    } else {
      console.log(resp);
      setTtyShareUrl(resp);
    }
  }

  async function stopVM() {
    const resp = await fetchData(vm_id, "/api/stop-vm");
    if (resp == "error") {
      console.log(resp);
    } else {
      console.log(resp);
      setTtyShareUrl("None");
    }
  }

  useEffect(() => {
    if (!vm) {
      // si pas d’objet en state, on refetch depuis le backend
      console.log("Fetching VM info for ID:", vm_id);
      fetchData(vm_id, "/api/vm-info").then((data) => setVm(data));
    }
  }, [vm, vm_id]);

  return (
    <>
      <h1>VM Page</h1>
      <p>This is the virtual machine page.</p>
      {/*     todo : vm info box
       */}{" "}
      <div>
        {vm ? (
          <>
            <h1>{vm.name}</h1>
            <p>Status: {vm.status}</p>
            <p>ID: {vm.id}</p>
          </>
        ) : (
          <p>Chargement de la VM...</p>
        )}
      </div>
      <button onClick={runShell}>Run a shell</button>
      <button>Stop the shell</button>
      <button onClick={stopVM}>Stop the VM</button>
      <iframe
        src={ttyShareUrl}
        title="Terminal Web"
        width="100%"
        height="600"
        style={{ border: "1px solid #ccc", borderRadius: "8px" }}
      ></iframe>
    </>
  );
}

export default VMPage;

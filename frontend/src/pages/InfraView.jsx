import { useLoaderData } from "react-router-dom";
import VMInfoBox from "@/components/VMInfoBox";

function InfraView() {
  const vms = useLoaderData();
  console.log(vms);

  if (!vms || vms.length === 0) {
    return <p>Aucune VM disponible.</p>;
  }

  return (
    <div className="grid gap-4 p-4">
      {vms.map((vm) => (
        <VMInfoBox key={vm._id} vm={vm} />
      ))}
    </div>
  );
}

export default InfraView;

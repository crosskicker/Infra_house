import { useLoaderData } from "react-router-dom";
import VMInfoBox from "@/components/VMInfoBox";
import { Link } from "react-router-dom";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

import { MonitorX, MousePointerClick } from "lucide-react"


function InfraView() {
  const vms = useLoaderData();
  console.log(vms);

  if (!vms || vms.length === 0) {
    return (
      <div className="p-8">
       <Alert>
        <MonitorX />
        <AlertTitle>
          There is no VM deployed yet.
        </AlertTitle>
        <AlertDescription><p>
          Go to  <Link to="/deploy-vm"> <b>Deploy VM</b></Link>  to create your first virtual machine.
          </p>
        </AlertDescription>
      </Alert>
      </div>
    );
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

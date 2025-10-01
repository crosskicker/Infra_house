import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";

function VMInfoBox({ vm }) {
  if (!vm) return null;

  const { _id, name, currentState, metadata } = vm;

  return (
    <Link to={`/vm/${_id}`} state={{ vm }} className="block">
      <Card className="w-full max-w-md mx-auto rounded-2xl shadow-lg hover:shadow-xl transition-shadow mb-4">
        <CardContent className="p-4">
          {/* Titre */}
          <div className="flex items-center justify-between mb-2">
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
              <span className="font-medium">RAM:</span> {metadata?.Memory} GB
            </p>
            <p>
              <span className="font-medium">Disque:</span> {metadata?.Disk} GB
            </p>
            <p>
              <span className="font-medium">Réseau:</span> {metadata?.network}
            </p>
            <p>
              <span className="font-medium">IP:</span> {metadata?.ip || "N/A"}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

export default VMInfoBox;

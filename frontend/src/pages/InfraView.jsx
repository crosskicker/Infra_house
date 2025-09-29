import { Link } from "react-router-dom";

function InfraView() {
  // test
  const vms = [
    { id: "vm-101", name: "Serveur Web", status: "Running" },
    { id: "vm-102", name: "Base de Données", status: "Stopped" },
    { id: "vm-103", name: "Proxy", status: "Running" },
  ];

  return (
    <>
      <div className="grid gap-4 p-4">
        {vms.map((vm) => (
          <Link
            key={vm.id}
            to={`/vm/${vm.id}`}
            state={{ vm }}   // 👈 tu passes l'objet ici
            className="block rounded-2xl p-4 shadow hover:shadow-lg transition"
          >
            <h2 className="text-lg font-bold">{vm.name}</h2>
            <p className="text-gray-600">Status: {vm.status}</p>
          </Link>
        ))}
      </div>
    </>
  );
}

export default InfraView;

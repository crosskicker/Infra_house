/*VERIFIER le type de donnée recup : response => response.results*/

/* import { errorHandlerForm } from "../ErrorHandler/ErrorHandler"; */
const addr = "http://127.0.0.1:5000"; //todo mettre dans un fichier de config

/* FETCH ACTION */
export function fetchAction(data, url) {
  return fetch(addr + url, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
}

/* FIN FETCH ACTION */

/*FETCH LOADERS(GET) & DATA */
export async function fetchGet(url) {
  try {
    const response = await fetch(addr + url, {
      method: "GET",
      credentials: "include", // Include cookies in the request
    });
    if (response.ok) {
      const reponse = await response.json();
      console.log(reponse);
      return reponse.results;
    } else {
      const errorData = await response.json();
      return { error: "Server error " + errorData.message };
    }
  } catch (e) {
    return { error: "Network error " + e.message };
  }
}

export async function fetchData(value, url) {
  try {
    const response = await fetch(addr + url, {
      method: "POST",
      body: JSON.stringify(value),
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (response.ok) {
      const reponse = await response.json();
      return reponse.results;
    } else {
      const errorData = await response.json();
      return { error: "Server error " + errorData.message };
    }
  } catch (e) {
    return { error: "Network error " + e.message };
  }
}

//fonction pour charger la liste suivante
export async function  fetchList(obj, url, setter, setError, clearErrors) {
  clearErrors();
  const response = await fetchData(obj, url);
  //on recupere la reponse duserveur et on la passe a cette fonction qui prend
  //le setter pour mettre à jour les valeurs de la liste suivante
  errorHandlerForm(response, setter, setError);
}

//créé une fonction de traitement pour les données retourné par notre API
//Si trop gros faire dans un fichier a part

export async function downloadExcel(end) {
  try {
    const response = await fetch(addr + end, {
      method: "GET",
      credentials: "include",
    });

    if (response.ok) {
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "naming.xlsx";
      link.click();
    } else {
      const errorData = await response.json();
      console.error("Error downloading Excel file:", errorData);
      return { error: "Server error: " + errorData.message };
    }
  } catch (e) {
    console.error("Error downloading Excel file:", e);
    return { error: "Network error: " + e.message };
  }
}

import { redirect } from "react-router-dom";
import { fetchAction } from "./fetch";

async function factorizedAction(obj, url, endpoint) {
  /*
   desc: Sends form data to the backend using the 
   correct endpoint via the Action function specific 
   to each form (page), and redirects the user to a new page 
   (the next part of the app).
   param:
      obj => form values
      url => path to the new web page
      endpoint => backend address
   return: redirects to the new page
  */
  try {
    const response = await fetchAction(obj, endpoint);
    if (response.ok) {
      const reponse = await response.json();
      console.log(reponse);
      return redirect(url);
    } else {
      const errorMessage = await response.json();
      console.log("Erreur lors de la requête :", errorMessage.message);
      return { error: errorMessage.message };
    }
  } catch (e) {
    console.log(e);
    return { error: "Network error " + e.message };
  }
}

export async function exempleAction({ request, params }) {
  /*
    desc: Sends the form data from the X page to the correct backend endpoint
    and redirects to a new page.
    param:
        request => form fields
    return: redirection
  */
  const data = await request.formData();
  
  return factorizedAction(
    data,
    "/todo", //path to the new page
    "/todo" //endpoint
  );
}
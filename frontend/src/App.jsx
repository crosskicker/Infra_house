import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SelectList from './components/SelectList'
import { useForm, Controller } from "react-hook-form";
import { fetchData } from './fetch'
import DeployVM from './pages/DeployVM'
import { Outlet } from 'react-router'
import NavigationBar from './components/NavigationBar'

function App() {


  // Pour soumettre le formulaire
  //import { useSubmit } from "react-router-dom";
  //import { useForm, Controller } from "react-hook-form";

  // For Action with react-router-dom
  //const submit = useSubmit();





async function mySubmit(values) {
  console.log("Données à envoyer :", values);
  const response = await fetchData(values, "/api/create-vm");
}

  return (


    <div className="flex  h-screen w-full ">
      <div className="w-64 h-screen flex-shrink-0 ">
        <NavigationBar user={{ name: "toto", email: "cross@example.com" }}  />
        {/* <Navigation /> */}
        {/* <DeployVM /> */}
        
      </div>
      <main className="flex-1 h-screen">
        <Outlet />
      </main>
    </div>
    
  )
}

export default App

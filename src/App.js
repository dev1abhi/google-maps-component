import React, { useState, useEffect } from "react";
import MapContainer from "./components/mapContainer";
import TruckAnimation from "./components/truckAnimation";
import ControlPanel from "./components/controlPanel";

import { getDistanceMatrix } from "./algorithms/distanceMatrix";
import { solveCVRP } from "./algorithms/cvrpSolver";

import { getDirectionsForRoutes } from "./service/getRoutesService";
import  {io}   from "socket.io-client";
import { createTruckBins } from "./algorithms/cvrpSolver";



const API_KEY = 'AIzaSyAV_2oWQhPdIhkkxtTCv29EnRABHyeg-EA'; // Replace with your Google Maps API key

//development link
// const socket = io('http://localhost:5000',{  
//   transports: ["websocket", "polling"],
//   withCredentials: true,
 
// })


//production link
const socket = io('https://ecoindia-backend.onrender.com/',{  
  transports: ["websocket", "polling"],
  withCredentials: true,
  secure:true
})




const depot = { lat: 12.9716, lng: 77.5940 };



const bins = [
  { address: "Bin 1 Address", lat: 12.968230392971455, lng: 77.5951199077175 },
  { address: "Bin 2 Address", lat: 12.972409087780731, lng: 77.59495707940663 },
  { address: "Bin 3 Address", lat: 12.969884415055294 , lng: 77.59751447496744 },
  { address: "Bin 4 Address", lat: 12.961956862413377, lng: 77.59475020864278 },
];



const App = () => {
  const [directionsResults, setDirectionsResults] = useState([]);
  const [map, setMap] = useState(null);
  const [animationStarted, setAnimationStarted] = useState(false);
  const [trucks , setTrucks]= useState(null);

  const handleMarkerFinished = (index) => {
    alert(`Truck ${index + 1} has finished its route.`);
  };

  useEffect(() => {
    const getOptimizedRoutes = async () => {
      const distanceMatrix = await getDistanceMatrix(depot, bins);
      const optimizedRoutes = solveCVRP(distanceMatrix, 4);
      const trucks = createTruckBins(optimizedRoutes);
      setTrucks(trucks);
      console.log(trucks);
      getDirectionsForRoutes(optimizedRoutes, setDirectionsResults);
    };

    getOptimizedRoutes();
  // Listen for the signal from the backend
  socket.on("startJourney", () => {
    console.log("Truck journey started signal received!");
    setAnimationStarted(true); // Start the animation
  });

  return () => {
    socket.off("startJourney"); // Clean up the listener when the component unmounts
  };
}, []);


  return (
    <div style={{ position: "relative", height: "100vh" }}>
      <MapContainer
        directionsResults={directionsResults}
        setMap={setMap}
        API_KEY={API_KEY}
      />
      <TruckAnimation
        directionsResults={directionsResults}
        map={map}
        animationStarted={animationStarted}
        setAnimationStarted={setAnimationStarted}
        trucks={trucks}
      />
    </div>
  );
};

export default App;


{/* <ControlPanel onStartAnimation={() => setAnimationStarted(true)} /> */}

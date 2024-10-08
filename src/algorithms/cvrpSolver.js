
//Each truck can take {each route which will get populated by backend after 2 or N number of bins are added in bins list} . 2 or n number of bins managed by 1 truck.

//create routes from bins/get-bins , and then create routes for them, centre as vellore

// export const solveCVRP = (distanceMatrix, truckCount) => {
//     // CVRP Algo
  //   return [
  //     {
  //       //truck 1 goes to bin 2 & bin 3
  //       origin: { lat: 12.9716, lng: 77.5940 },
  //       destination: { lat: 12.972409087780731, lng: 77.59495707940663 },
  //       waypoints: [
  //         { location: { lat: 12.969884415055294 , lng: 77.59751447496744 }, stopover: true },
  //       ]
  //     },
  //     {  //truck 2 goes to bin 1 and bin 4
  //       origin: { lat: 12.9716, lng: 77.5940 },
  //       destination: { lat: 12.961956862413377, lng: 77.59475020864278 }, //bheemana garden
  //       waypoints: [
  //         { location: { lat: 12.968230392971455, lng: 77.5951199077175 }, stopover: true }, //vittall malya road
  //       ]
  //     }
  //   ];
  // };


// // Function to create truckBins based on CVRP solution which assigns bins to trucks
// export const createTruckBins = (cvrpSolution) => {
//   return cvrpSolution.map((route,index) => {

//     // Collect waypoints
//     const bins = route.waypoints.map((wp) => ({
//       lat: wp.location.lat,
//       lng: wp.location.lng,
     
//     }));
//     // Add destination bin
//     bins.push({
//       lat: route.destination.lat,
//       lng: route.destination.lng,
     
//     });

//     return {
//       bins,
//       index
//     };
//   });
// };

import axios from 'axios';
//12.898093156428512, 79.14079705175504
// Function to fetch bins from the API
const fetchBins = async () => {
  try {
    const response = await axios.get('https://ecoindia-backend.onrender.com/bins/all-bins');
    return response.data.bins.map(bin => ({
      lat: bin.lat,
      lng: bin.lng,
    })); // Extract lat and lng from each bin
  } catch (error) {
    console.error('Error fetching bins:', error);
    return [];
  }
};

export const solveCVRP = async (truckCount) => {
  const bins = await fetchBins();
  console.log(bins);

  const origin = { lat: 12.898093156428512, lng: 79.14079705175504 }; // Vellore as the center

  // Create routes based on bins data
  const routes = bins.map(bin => ({
    origin,
    destination: { lat: bin.lat, lng: bin.lng },
    waypoints: [] // Empty waypoints as specified
  }));

  console.log('routes ',routes);
  return routes; // Limit to the number of trucks
};

// Function to create truckBins based on CVRP solution which assigns bins to trucks
export const createTruckBins = (cvrpSolution) => {
  console.log('cvrpsol',cvrpSolution);
  return cvrpSolution.map((route, index) => {
    // Collect waypoints
    const bins = [];

    // Add destination bin
    bins.push({
      lat: route.destination.lat,
      lng: route.destination.lng,
    });

    return {
      bins,
      index
    };
  });
};

export const getDirectionsForRoutes = (routes, setDirectionsResults) => {
  routes.forEach((route, index) => {
    const { origin, destination, waypoints } = route;

    const request = {
      origin: { lat: origin.lat, lng: origin.lng },
      destination: { lat: destination.lat, lng: destination.lng },
      waypoints: waypoints,
      travelMode: "DRIVING",
    };

    const service = new window.google.maps.DirectionsService();
    service.route(request, (result, status) => {
      if (status === "OK") {
        setDirectionsResults(prev => [...prev, { directions: result, index }]);
      } else {
        console.error(`Directions request failed due to ${status}`);
      }
    });
  });
};

import React from "react";
import { GoogleMap, LoadScript, DirectionsRenderer, Marker } from "@react-google-maps/api";

const mapContainerStyle = {
  width: "80vw",
  height: "80vh",
  border: "2px solid black",
  borderRadius: "10px",
};

const center = {
  lat: 12.9716,
  lng: 77.5940,
};

const MapContainer = ({ directionsResults, setMap, API_KEY }) => {
  return (
    <LoadScript googleMapsApiKey={API_KEY}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={12}
        onLoad={(mapInstance) => setMap(mapInstance)}
      >
        <Marker position={center} icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png" label="Depot" />

        {directionsResults.map((result, idx) => (
          <DirectionsRenderer
            key={idx}
            options={{
              directions: result.directions,
              polylineOptions: {
                strokeColor: ["red", "blue", "green", "purple"][result.index % 4],
                strokeOpacity: 0.7,
                strokeWeight: 5,
              },
              markerOptions: {
                icon: {
                  url: "/dustbin.png",
                  scaledSize: new window.google.maps.Size(30, 30),
                },
                visible: true
              }
            }}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapContainer;

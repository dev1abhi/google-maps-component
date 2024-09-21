

import React, { useEffect } from 'react';

const TruckAnimation = ({ directionsResults, map, animationStarted, setAnimationStarted,  trucks }) => {
  useEffect(() => {
    if (animationStarted && map && directionsResults.length > 0) {
      const routePaths = directionsResults.map(result => result.directions.routes[0].overview_path);
      
      const compareLatitudes = (lat1, lat2) => {
        return lat1.toFixed(3) === lat2.toFixed(3);
      };

      const arePathsEqual = (path1, path2) => {
        if (path1.length !== path2.length) return false;
        for (let i = 0; i < path1.length; i++) {
          if (path1[i].lat() !== path2[i].lat() || path1[i].lng() !== path2[i].lng()) {
            return false;
          }
        }
        return true;
      };

      const uniqueRoutePaths = routePaths.filter((path, index, self) =>
        index === self.findIndex((p) => arePathsEqual(p, path))
      );

      const speed = 1000; // Speed of the truck animation in milliseconds per step

      const markers = uniqueRoutePaths.map((path, index) => {
        const marker = new window.google.maps.Marker({
          position: path[0],
          map,
          icon: "http://maps.google.com/mapfiles/ms/icons/truck.png",
        });

        //getting trucks from app.js
        const truckBins = trucks[index]?.bins || [];
        console.log('truckbins :',truckBins);
        const notifiedBins = new Set(); // Track notified bins
       
        //sending only particular truckBins as bins
        return { marker, path, index, step: 0, bins: truckBins, notifiedBins };
      });

      markers.forEach(({ marker, path, index, bins, notifiedBins }) => {
        const interval = setInterval(async () => {
          if (markers[index].step >= path.length) {
            clearInterval(interval);
            marker.setMap(null); // Remove marker from the map

           

            markers[index] = null;

            if (markers.every(m => m === null)) {
              setAnimationStarted(false);
            }
            return;
          }

          const currentPos = path[markers[index].step];
          marker.setPosition(currentPos);

          // Skip waypoint checking on the last step
          if (markers[index].step < path.length - 1) {
            //console.log(markers[index],bins);
            
            if (bins.length > 0) {

             //console.log(bins);


              const firstBin = bins[0]; // Get the first bin
              if (!notifiedBins.has(firstBin.address) && compareLatitudes(currentPos.lat(), firstBin.lat)) {
                console.log(`Truck ${index + 1} reached at ${firstBin.lat}, ${firstBin.lng}`);  //notification & (delete the bin)
                // alert(`Truck ${index + 1} reached ${firstBin.address}`);
                notifiedBins.add(firstBin.address); // Mark this bin as notified
              }
            }

          }
          
          const finalBin = bins[1];
          // Check if the truck has reached the final destination
          if (markers[index].step === path.length - 1) {
            console.log(`Truck ${index+1} has reached it's final bin ${finalBin.lat} , ${finalBin.lng}`); //notification & (delete the bin )
          }

          markers[index].step++;
        }, speed);
      });
    }
  }, [animationStarted, map, directionsResults, setAnimationStarted,  trucks]);

  return null;
};

export default TruckAnimation;

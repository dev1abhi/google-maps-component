import axios from "axios";

export const getDistanceMatrix = async (depot, bins) => {
  const origins = bins.map(bin => `${bin.lat},${bin.lng}`);
  const destinations = bins.map(bin => `${bin.lat},${bin.lng}`);

  try {

    //development link
    // const response = await axios.get(
    //   `http://localhost:5000/map/distancematrix?origins=${origins.join('|')}&destinations=${destinations.join('|')}`
    // );

    //production link
    const response = await axios.get(
      `https://eco-india-backend-alpha.vercel.app/map/distancematrix?origins=${origins.join('|')}&destinations=${destinations.join('|')}`
    );


    //console.log('Distance Matrix Response:', response.data);

    if (response.data && response.data.rows && Array.isArray(response.data.rows) && response.data.rows.length > 0) {
      const elements = response.data.rows[0].elements;
      if (elements && Array.isArray(elements)) {
        return elements.map(el => el.distance && el.distance.value ? el.distance.value : null);
      } else {
        console.error('Elements array is missing or malformed:', elements);
        return [];
      }
    } else {
      throw new Error('Unexpected API response structure');
    }
  } catch (error) {
    console.error('Error fetching distance matrix:', error);
    return [];
  }
};

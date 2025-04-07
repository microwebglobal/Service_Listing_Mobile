import {GOOGLE_MAP_API_KEY} from '@env';
import axios from 'axios';

const fetchLocations = async (query: any) => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
        query,
      )}&types=geocode&components=country:IN&key=${GOOGLE_MAP_API_KEY}`,
    );

    const apiResults = response.data.predictions.map(
      (prediction: any) => prediction.description,
    );
    return apiResults;
  } catch (error) {
    console.error('Error fetching locations from API:', error);
  }
};

const getCityDetails = async (location: any) => {
  const nameWithoutCountry = location.replace(/,?\s*India$/, '').trim();
  const cityName = nameWithoutCountry.split(',')[0].trim();
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        location,
      )}&key=${GOOGLE_MAP_API_KEY}`,
    );
    const results = response.data.results;
    // console.log('\nResults:', results[0].geometry.location);

    if (results.length > 0) {
      const state = results[0].address_components.find((component: any) =>
        component.types.includes('administrative_area_level_1'),
      );

      return {
        city: cityName,
        postal_code: '',
        state: state.long_name || '',
        latitude: results[0].geometry.location.lat,
        longitude: results[0].geometry.location.lng,
      };
    }
  } catch (error) {
    console.error('Error fetching district from API:', error);
  }
};

export {fetchLocations, getCityDetails};

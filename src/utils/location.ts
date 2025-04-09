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

const getCurrentLocationAddress = async (
  latitude: number,
  longitude: number,
) => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAP_API_KEY}`,
    );
    const results = response.data.results;
    // console.log(response.data.results[0].formatted_address);

    if (results.length > 0) {
      const addressComponents = results[0].address_components;
      const city = addressComponents.find((component: any) =>
        component.types.includes('locality'),
      );
      const state = addressComponents.find((component: any) =>
        component.types.includes('administrative_area_level_1'),
      );
      const postal_code = addressComponents.find((component: any) =>
        component.types.includes('postal_code'),
      );

      return {
        formatted_address: results[0].formatted_address.split(',')[0],
        city: city ? city.long_name : '',
        state: state ? state.long_name : '',
        postal_code: postal_code ? postal_code.long_name : '',
      };
    }
  } catch (error) {
    console.error('Error fetching locations from API:', error);
  }
};

export {fetchLocations, getCityDetails, getCurrentLocationAddress};

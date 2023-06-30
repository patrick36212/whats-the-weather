import { createSlice } from "@reduxjs/toolkit";

const weatherSlice = createSlice({
  name: "weather",
  initialState: {
    geoAgreement: false,
    geoCoordinates: null,
    weatherData: null,
    hourlyWeather: [],
  },
  reducers: {
    setGeoAgreement: (state) => {
      state.geoAgreement = true;
    },
    setGeoCoordinates: (state, { payload: coordinates }) => {
      state.geoCoordinates = coordinates;
    },
    setWeatherData: (state, { payload: apiData }) => {
      state.weatherData = apiData;
    },
    setHourlyWeatherData: (state, { payload: { hourlyData, index } }) => {
      state.hourlyWeather = hourlyData.slice(index);
    },
  },
});

export const {
  setGeoAgreement,
  setGeoCoordinates,
  setWeatherData,
  setHourlyWeatherData,
} = weatherSlice.actions;

export const selectGeoAgreement = (state) => state.weather.geoAgreement;
export const selectGeoCoordinates = (state) => state.weather.geoCoordinates;
export const selectWeatherData = (state) => state.weather.weatherData;
export const selectHourlyWeatherData = (state) => state.weather.hourlyWeather;

export default weatherSlice.reducer;
import Section from "../../components/Section";
import Search from "../../components/Search";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentPositionCoordinates,
  selectCurrentPositionWeather,
  selectDisallowed,
  setCurrentPositionCoordinates,
  setCurrentPositionWeather,
  setDisallowed,
} from "./currentPositionSlice";
import { useQuery } from "react-query";
import { getCurrentData } from "../getCurrentData";
import { LoaderIcon } from "../../components/StatusInfo/Loading/styled";
import WeatherTile from "../../components/WeatherTile";
import { setHourlyWeather } from "../Current/currentSlice";

const CurrentPositionWeather = () => {
  const isDisallowed = useSelector(selectDisallowed);
  const currentPositionCoordinates = useSelector(
    selectCurrentPositionCoordinates
  );
  const currentPositionWeather = useSelector(selectCurrentPositionWeather);
  const dispatch = useDispatch();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) =>
        dispatch(
          setCurrentPositionCoordinates({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          })
        ),
      () => dispatch(setDisallowed())
    );
  }, [dispatch]);

  const { data, isLoading } = useQuery(
    ["currentPositionWeather", { currentPositionCoordinates }],
    () => {
      if (!!currentPositionCoordinates) {
        const stringifyCoordinates = `${currentPositionCoordinates.lat.toString()},${currentPositionCoordinates.lon.toString()}`;
        return getCurrentData(stringifyCoordinates);
      }
    }
  );

  useEffect(() => {
    if (!!data) {
      const currentDay = data.forecast.forecastday[0].hour;
      const nextDay = data.forecast.forecastday[1].hour;
      const hourly = [].concat(currentDay, nextDay);
      const currentHour = data.location.localtime.split(" ")[1].split(":")[0];
      dispatch(setCurrentPositionWeather(data));
      dispatch(setHourlyWeather({ hourly: hourly, index: currentHour }));
    }
  }, [data, dispatch]);

  return (
    <>
      <Search />
      <Section>
        {isLoading && <LoaderIcon />}
        {!!currentPositionWeather && !isLoading && (
          <WeatherTile data={currentPositionWeather} isAddedToFav={true} />
        )}
        {isDisallowed && <h3>Enter city name for weather</h3>}
      </Section>
    </>
  );
};

export default CurrentPositionWeather;

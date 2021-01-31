import './styles.scss';
import React, {useEffect, useState, useRef} from "react";
import moment from 'moment-timezone';
import {useSelector} from "react-redux";
import {Forecast, ForecastDetail} from "../../interfaces";

let dayOfYear = 0;

function ForecastTable(props: any) {
    const [inDegrees, setInDegrees] = useState(true);

    const [inKmh, setInKmh] = useState(true);

    const forecast: Forecast = useSelector((store: any) => {
        return store.forecast[props.locationId];
    });

    const isNewDay = (date: string) => {
        const currentDay = moment(date).dayOfYear();
        if (dayOfYear === 0) {
            dayOfYear = currentDay;
            return true;
        }
        if (currentDay !== dayOfYear) {
            dayOfYear = currentDay;
            return true;
        }
        return false;
    };

    const toggleTemperature = () => {
        setInDegrees(!inDegrees);
    };

    const toggleSpeed = () => {
        setInKmh(!inKmh);
    };

    const updateTempValue = (value: number, degrees: boolean) => {
        return degrees ? value : ((value * (9/5)) + 32).toFixed(1);
    };

    const updateSpeedValue = (value: number, km: boolean) => {
        return km ? value : (value/1.852).toFixed(1);
    };

    return (
        <div className={"forecast-table-container"}>
            <div className={"buttons-container"}>
             <input type={"button"} onClick={toggleTemperature} value={`Show temp in ${inDegrees ? "Fahrenheit" : "Celsius"}`}/>
             <input type={"button"} onClick={toggleSpeed} value={`Show wind speed in ${inKmh ? "Knots" : "Km/h"}`}/>
            </div>
            <table className={"forecast"}>
                <thead>
                <tr>
                    <th className={"date"}>Date</th>
                    <th className={"chance"}>Probability of Rain</th>
                    <th className={"temp"}>Temperature ({inDegrees ? <>&#8451;</> : <>&#8457;</>})</th>
                    <th className={"speed"}>Wind Speed ({inKmh ? "Km/h" : "knots"})</th>
                    <th className={"direction"}>Wind Direction</th>
                </tr>
                </thead>
                {forecast?.part_day_forecasts?.forecasts.map((forecastDetail: ForecastDetail, indexId: number) => {
                    return (
                        <tbody key={indexId}>
                        {isNewDay(forecastDetail.utc_time) && (
                            <tr className={"new-day"}>
                                <td colSpan={5}>
                                    {moment(forecastDetail.local_time).tz(forecastDetail.time_zone).format("DD/MM/YY dddd z")}
                                </td>
                            </tr>
                        )}

                        <tr key={indexId}>
                            <td>{moment(forecastDetail.local_time).format("h:mm a")}</td>
                            <td>{forecastDetail.precis}</td>
                            <td>{updateTempValue(forecastDetail.temperature, inDegrees)}</td>
                            <td>{updateSpeedValue(forecastDetail.wind_speed, inKmh)}</td>
                            <td>{forecastDetail.wind_direction}</td>
                        </tr>
                        </tbody>
                    );
                })}
            </table>
        </div>
    );
}

export default ForecastTable;

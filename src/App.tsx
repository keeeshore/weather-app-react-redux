import './App.scss';
import React, {useEffect, useState, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import {Forecast} from "./interfaces";
import {clearWeatherData, updateGraphData, updateWeatherData} from "./redux/store";
import ForecastTable from "./components/ForecastTable";
import ForecastGraph from "./components/ForecastGraph";

const locationCodes = [
    {name: "Adelaide", value: 12495},
    {name: "Brisbane", value: 9388},
    {name: "Canberra", value: 3928},
    {name: "Darwin", value: 11},
    {name: "Hobart", value: 15464},
    {name: "Melbourne", value: 5594},
    {name: "Perth", value: 13896},
    {name: "Sydney", value: 624},
];

const cacheTimer: number = 30000;

function App() {
    const [locationId, setLocationId] = useState(624);

    const dispatch: any = useDispatch();

    const forecast: Forecast = useSelector((store: any) => {
        return store.forecast[locationId];
    });

    const onLocationChange = (e: any) => {
        console.log("onLocationChange = ", e.target.value);
        setLocationId(e.target.value);
    };

    useEffect(() => {
        const updateLocationAndGraph = async () => {
            const data: Forecast = await dispatch(updateWeatherData(locationId, {}));
            const graphData: any = await dispatch(updateGraphData(data.part_day_forecasts.forecasts));
            // do something else here...
        };
        updateLocationAndGraph();
    }, [locationId]);

    useEffect(() => {
        setTimeout(() => {
            console.log("*********** CLEARING ALL LOCATION DATA **************** ");
            // dispatch(clearWeatherData());
        }, cacheTimer);
    }, []);

    return (
        <div className="App">
            <div className={"options-container"}>
                <label>Please select a Location: </label>
                <select id={"locations"} onChange={onLocationChange} defaultValue={locationId}>
                    {locationCodes.map((loc, indexId) => {
                        return (<option key={indexId} value={loc.value}>{loc.name}</option>)
                    })}
                </select>
            </div>
            <h1>
                Weather forecast for {forecast?.name}
            </h1>
            <ForecastGraph/>
            <ForecastTable locationId={locationId}/>
        </div>
    );
}

export default App;

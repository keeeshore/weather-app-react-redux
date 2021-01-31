import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { ForecastDetail, GraphForecastObj, LocationForecasts, WeatherOptions} from "../interfaces";
import axios from "axios";
import moment from "moment";

const defaultLocationForecast: LocationForecasts = {};

const defaultGraphData: Array<GraphForecastObj> = [];

const graphForecast = (state = defaultGraphData, action: any) => {
    console.log("store dispatch :: graphForecast ::: ", action);
    switch (action.type) {
        case 'UPDATE_LOCATION_GRAPH_FORECASTS': {
            return action.payload;
        }
        default: {
            return state;
        }
    }
};

const forecast = (state = defaultLocationForecast, action: any) => {
    console.log("store dispatch :: forecast ::: ", action);
    switch (action.type) {
        case 'ADD_LOCATION_FORECASTS': {
            return { ...state, ...action.location };
        }
        case 'CLEAR_ALL_LOCATION_FORECASTS': {
            return { ...state, ...action.forecasts };
        }
        default: {
            return state;
        }
    }
};

const getWeatherData: any = async (location: number, opt: WeatherOptions) => {
    const options = { ...{
            locdet: 1,
            latlon: 1,
            lt: 'aploc',
            period: 48,
            detail: 2,
            u: 1,
            format: "json"
        }, ...opt
    };
    const config = {
        params: {
            lt: options.lt,
            lc: location,
            locdet: options.locdet,
            latlon: options.latlon,
            pdf: `twc(period=${options.period},detail=${options.detail})`,
            u: options.u,
            format: options.format,
        }
    };
    return axios.get("https://ws.weatherzone.com.au", config);
};

export const updateGraphData = (forecasts: any) => {
    let graphData: Array<GraphForecastObj> = [];
    forecasts.forEach((detail: ForecastDetail) => {
        graphData.push({
            name: moment(detail.utc_time).format("ddd Do, h:mm a"),
            temp: detail.temperature,
            speed: detail.wind_speed,
            feelsLike: detail.feels_like_c,
            humidity: detail.relative_humidity
        });
    });
    console.log("getWeatherData graphForecasts: ", graphData);
    return (dispatch: any) => {
        dispatch({ type: "UPDATE_LOCATION_GRAPH_FORECASTS", payload: graphData });
    }
};

export const updateWeatherData = (locationId: number, options: WeatherOptions) => {
    return async (dispatch: any, getState: any) => {
        try {
            let locationData: ForecastDetail = getState().forecast[locationId];
            if (locationData && !locationData.forceFetch) {
                // selected Location data is present in state and there is no forceFetch boolean applied, so return the same from state (Cache)
                console.log("updateWeatherData locationData exists return the same: ");
                return locationData;
            }
            // Either no locationData is present, or there forceFetch=true, Therefore fetch data again
            const response = await getWeatherData(locationId, { options });
            console.log("updateWeatherData RESPONSE: ", response.data);
            locationData = response.data.countries[0].locations[0];
            const location: any = {};
            location[locationId] = locationData;
            // Set forceFetch = false, so it need to be fetched again until explicitly set
            location[locationId].forceFetch = false;
            dispatch({ type: "ADD_LOCATION_FORECASTS", location });
            return locationData;
        } catch (error: any) {
            console.error("updateWeatherData ERR: ", error);
            dispatch({ type: "ADD_PART_DAY_FORECASTS", error });
            return error;
        }
    }
};

export const clearWeatherData = (locationId?: number) => {
   return (dispatch: any, getState: any) => {
       let data = getState().forecast;
       let forecasts: any = {};
       Object.keys(data).forEach((key: any) => {
           debugger;
           if (parseInt(key, 10) === locationId) {
               // forceFetch = true; Because the data is in use currently, do not clear it, but make sure to fetch it when its reloaded.
               forecasts[key] = data[key];
               forecasts[key].forceFetch = true;
           } else {
               // Remove all other items in forecast state as they need to fetched from server again.
               forecasts[key] = undefined;
           }
       });
       dispatch({ type: "CLEAR_ALL_LOCATION_FORECASTS", forecasts });
   }
};

const rootReducer = combineReducers({ forecast, graphForecast });

export default createStore(rootReducer, composeWithDevTools(
    applyMiddleware(thunk),
));

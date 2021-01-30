import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import { ForecastDetail, GraphForecastObj, LocationForecasts, MetaData, WeatherOptions} from "../interfaces";
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
    console.log("store dispatch :: forecast ::: ", action.payload);
    switch (action.type) {
        case 'ADD_LOCATION_FORECASTS': {
            return { ...state, ...action.location };
        }
        case 'CLEAR_ALL_LOCATION_FORECASTS': {
            return defaultLocationForecast;
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
            let locationData = getState().forecast[locationId];
            if (locationData && !options.forceFetch) {
                console.log("updateWeatherData locationData exists return the same: ");
                return locationData;
            }
            const response = await getWeatherData(locationId, { options });
            console.log("updateWeatherData RESPONSE: ", response.data);
            locationData = response.data.countries[0].locations[0];
            const location: any = {};
            location[locationId] = locationData;
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
   return (dispatch: any) => {
       if (!locationId) {
           dispatch({ type: "CLEAR_ALL_LOCATION_FORECASTS" });
       }
   }
};

const rootReducer = combineReducers({ forecast, graphForecast });

export default createStore(rootReducer, composeWithDevTools(
    applyMiddleware(thunk),
));

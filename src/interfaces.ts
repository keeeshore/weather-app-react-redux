export interface ForecastDetail {
    timestamp: number;
    utc_time: string;
    local_time: string;
    tz: string;
    time_zone: string;
    temperature: number;
    feels_like_c: number;
    precis: string;
    dew_point: number;
    relative_humidity: number;
    wind_direction: number;
    wind_direction_compass: string;
    wind_speed: number;
    pressure: number;
    cloud_cover_oktas: number;
    cloud_cover_percent: number;
    rain_prob: number;
    rate: number;
    icon_phrase: string;
    icon_filename: string;
    forceFetch: boolean;
}

export interface MetaData {
    sector: string;
    title: string;
    provider_name: string;
    provider_url: string;
    project_version: string;
    revision: string;
    last_commit: string;
    create_time: string;
    create_tz: string;
    create_time_utc: string;
    validity: string;
}

export interface GraphForecastObj {
    name: string;
    temp: number;
    feelsLike: number;
    speed?: number;
    humidity?: number;
}

export interface LocationForecasts {
    [key: string]: Forecast
}

export interface Forecast {
    type?: string;
    name?: string,
    code?: string,
    state?: string;
    time_zone?: string;
    part_day_forecasts: PartDayForecast;
}

export interface PartDayForecast {
    related_location: any;
    forecasts: Array<ForecastDetail>;
}

export interface WeatherOptions {
    forceFetch?: boolean;
    period?: number;
    detail?: number;
}


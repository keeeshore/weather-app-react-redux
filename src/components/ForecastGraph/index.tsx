import React, {useEffect, useState, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import {  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';


function ForecastGraph(props: any) {
    const graphRef: any = useRef();

    const [graphWidth, setGraphWidth] = useState(0);

    const graphForecast = useSelector((store: any) => {
        return store.graphForecast;
    });

    const [temp, showTemp] = useState(true);

    const [humidity, showHumidity] = useState(true);

    const toggleTemperature = () => {
        showTemp(!temp);
    };

    const toggleHumidity = () => {
        showHumidity(!humidity);
    };

    useEffect(() => {
        setGraphWidth(graphRef.current.offsetWidth - 10);
    }, []);

    return (
        <div className="App">
            <div className={"buttons-container"}>
                <input type={"button"} onClick={toggleTemperature} value={`${temp ? "Hide" : "Show"} Temp`}/>
                <input type={"button"} onClick={toggleHumidity} value={`${humidity ? "Hide" : "Show"} Humidity`}/>
            </div>
            <div id={"graph-container"} ref={graphRef}>
                <LineChart width={graphWidth} height={300} data={graphForecast}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis dataKey="humidity" />
                    <Tooltip />
                    <Legend />
                    {temp && <Line type="monotone" dataKey="temp" stroke="#CC0000" activeDot={{ r: 8 }} />}
                    {humidity && <Line type="monotone" dataKey="humidity" stroke="#993333" />}
                    <Line type="monotone" dataKey="feelsLike" stroke="#cccc00" />
                    <Line type="monotone" dataKey="speed" stroke="#33ccff" />
                </LineChart>
            </div>
        </div>
    );
}

export default ForecastGraph;

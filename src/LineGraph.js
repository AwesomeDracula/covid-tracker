import React, { useEffect, useState } from 'react';
import {Line} from 'react-chartjs-2';
import numeral from 'numeral';

function LineGraph({casesType = 'cases'}) {
    const [data, setData] = useState({});

    const options = {
        legend: {
            display: false
        },
        elements: {
            point: {
                radius: 0
            },
        },
        maintainAspectRatio: false,
        tooltips: {
            mode: 'index',
            intersect: false,
            callbacks: {
                label: function(tooltipItem, data){
                    return numeral(tooltipItem.value).format('+0,0');
                },
            },
        },
        scales: {
            xAxes: [
                {
                    type: 'time',
                    time: {
                        format: 'MM/DD/YY',
                        tooltipFormat: 'll',
                    },
                },
            ],
            yAxes: [
                {
                    gridLines: {
                        display: false,
                    },
                    ticks: {
                        callback: function(value, index, values){
                            return numeral(value).format("0.0a");
                        }
                    }
                }
            ]
        }
    }

    const buildChartData = (data, casesType = 'cases') => {
        const chartData = [];
        let lastDataPoint;
        for(let date in data[casesType]) {
            if(lastDataPoint){
                const newDataPoint = {
                    x: date,
                    y: data[casesType][date] - lastDataPoint
                };
                chartData.push(newDataPoint);
            }
            lastDataPoint = data[casesType][date];
        }
        return chartData;
    }

    useEffect(() => {
        fetch('https://disease.sh/v3/covid-19/historical/all?lastdays=30').then(res => res.json())
        .then(data => {
            console.log(data);
            const chartData = buildChartData(data,casesType);
            setData(chartData);
        })
    }, [casesType]);

    return (
        <div>
            {
                data?.length > 0 && (
                    <Line
                        data={
                            {
                                datasets: [
                                    casesType === 'recovered'
                                    ? {
                                        backgroundColor: 'rgba(125, 215, 29, 0.5)',
                                        borderColor: '#7DD71D',
                                        data: data
                                    }
                                    : {
                                        backgroundColor: 'rgba(204, 16, 52, 0.5)',
                                        borderColor: '#cc1034',
                                        data: data
                                    }
                                ]
                            }
                        }
                        options={options}
                    />
                )
            }  
        </div>
    )
}

export default LineGraph

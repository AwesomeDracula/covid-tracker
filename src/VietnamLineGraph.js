import React, { useEffect, useState } from 'react';
import {Line} from 'react-chartjs-2';
import numeral from 'numeral';

function VietnamLineGraph({isDeaths,casesType = 'cases'}) {
    const [data, setData] = useState({});

    const options = {
        legend: {
            display: false
        },
        elements: {
            point: {
                radius: 5
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
                        displayFormats: {
                            day: 'MMM D',
                        },
                        tooltipFormat: 'll',
                        unit: 'day',
                        unitStepSize: 1,
                    },
                },
            ],
            yAxes: [
                {
                    gridLines: {
                        display: false,
                    },
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
        fetch('https://disease.sh/v3/covid-19/historical/vn?lastdays=10').then(res => res.json())
        .then(data => {
            const chartData = buildChartData(data?.timeline,casesType);
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
                                        borderColor: '#7DD71D',
                                        backgroundColor: 'transparent',
                                        data: data
                                    }
                                    : {
                                        borderColor: '#cc1034',
                                        backgroundColor: 'transparent',
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

export default VietnamLineGraph

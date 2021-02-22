import { Card, CardContent, Typography } from '@material-ui/core';
import React from 'react';
import numeral from 'numeral';
import './InfoBox.css';

function InfoBox({isRed, active, title, cases, total, onClick}) {
    return (
        <Card className={`infobox ${active && 'infobox--selected'} ${isRed && 'infobox--red'}`} onClick={onClick}>
            <CardContent>
                <Typography className="infobox__title" color="textSecondary">{title}</Typography>
                <h2 className={`infobox__cases ${!isRed && 'infobox__cases--green'}`}>+{numeral(cases).format('0,0')}</h2>
                <Typography className="infobox__total" color="textSecondary">Tổng: {numeral(total).format('0,0')}</Typography>
            </CardContent>
        </Card>
    )
}

export default InfoBox

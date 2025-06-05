import React from "react";
import "./TrackingTimeline.css";

const formattedDateTime=(isoString)=>{
    const date=new Date(isoString);
    return{
        date: date.toLocaleDateString("en-GB",{day:"2-digit",month:"short"}),
        time: date.toLocaleTimeString("en-US",{hour:"2-digit",minute:"2-digit",})
    }
}
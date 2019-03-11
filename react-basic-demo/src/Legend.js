import React, { Component } from 'react';
const LEGEND_STYLE = {
    backgroundColor: "#fff", 
    borderRadius: "3px", 
    "bottom": "30px", 
    "padding": "10px", 
    "position": "absolute", 
    "right": "10px", 
    zIndex: 1
}

class Legend extends React.Component{
    render() {
        return (
            <div style={LEGEND_STYLE}>
                <div><h2>Click trail for information</h2></div>
                <div><span style={{borderRadius: "50%", display: "inline-block", height: "10px", marginRight: "10px", width: "10px", backgroundColor: "hsl(33, 100%, 64%)"}}></span>Walk</div>
                <div><span style={{borderRadius: "50%", display: "inline-block", height: "10px", marginRight: "10px", width: "10px", backgroundColor: "hsl(0, 100%, 69%)"}}></span>Bike</div>
                <div><span style={{borderRadius: "50%", display: "inline-block", height: "10px", marginRight: "10px", width: "10px", backgroundColor: "hsl(82, 100%, 41%)"}}></span>Shared</div>
                <div><span style={{borderRadius: "50%", display: "inline-block", height: "10px", marginRight: "10px", width: "10px", backgroundColor: "hsl(46, 98%, 30%)"}}></span>Unknown</div>
                <div><span style={{display: "inline-block", height: "10px", marginRight: "10px", width: "10px"}}><img src="./icons/shelter-15.png" /></span>Shelter</div>
            </div>
        );
    }
}

export default Legend;

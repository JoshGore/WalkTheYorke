// import React, { Component } from 'react';
import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';

const LEGEND_AREA_ENTRY = {borderRadius: "50%", display: "inline-block", height: "10px", marginRight: "10px", width: "10px", };

// button to view info
// bar with "tap for info"
// transition to info
// open to 2/3 on scroll
const InfoButton = (props) => {
    return (
        <div 
            onClick={() => props.setMenuState({...props.menuState, show: true})} 
            style={{padding: "3px", lineHeight: "29px", color: "grey"}}>
            &nbsp;&nbsp;
            <i style={{
                border: "solid grey",
                borderWidth: "0 3px 3px 0",
                display: "inline-block",
                padding: "3px",
                transform: "rotate(-135deg)",
            }}/>
            &nbsp;&nbsp;
            Tap for info
        </div>
    )
}

const Legend = () => {
    return (
        <div>
            <div><span style={{...LEGEND_AREA_ENTRY, backgroundColor: "hsl(33, 100%, 64%)"}}></span>Walk</div>
            <div><span style={{...LEGEND_AREA_ENTRY, backgroundColor: "hsl(0, 100%, 69%)"}}></span>Bike</div>
            <div><span style={{...LEGEND_AREA_ENTRY, backgroundColor: "hsl(82, 100%, 41%)"}}></span>Shared</div>
            <div><span style={{...LEGEND_AREA_ENTRY, backgroundColor: "hsl(46, 98%, 30%)"}}></span>Unknown</div>
            <div><span style={{display: "inline-block", height: "10px", marginRight: "10px", width: "10px"}}><img src="./icons/shelter-15.png" /></span>Shelter</div>
        </div>
    )
}

const InformationPresentation = (props) => {
    // stage title
    // stage warnings
    // stage description
    return (
        <div>
            <h3>{props.stageDescriptions[props.stage].title}</h3>
            <div style={{backgroundColor: "lightgrey", padding: "3px"}}>
                <ul>{props.stageDescriptions[props.stage].notes.map((note, key)=> <li key={key}>{note}</li>)}</ul>
            </div>
            <p style={{color: "grey"}}><b><i>{props.stageDescriptions[props.stage].subtitle}</i></b></p>
            <p dangerouslySetInnerHTML={{ __html: props.stageDescriptions[props.stage].description }}></p>
        </div>
    )
}

const TrailInfo = (props) => {
    const toggleMenuAnimation = useSpring({
        height: props.menuState.show ? "66%" : "0%",
        backgroundColor: props.menuState.show ? "white" : "lightgrey",
        marginTop: props.menuState.show ? "-7px" : "0px",
        borderRadius: props.menuState.show ? "7px 7px 0px 0px" : "0px 0px 0px 0px",
        onRest: () => props.map && props.map.resize(),
        config: {
            mass: 2,
            friction: 30
        }
    });
    return (
        <animated.div style={{
            ...toggleMenuAnimation,
            minHeight: "35px",
            zIndex: 2, 
            boxShadow: "0px 0px 3px 3px rgba(0, 0, 0, 0.2)", 
            overflow: "auto",
            padding: "3px",
        }}>
        {!props.menuState.show && <InfoButton menuState={props.menuState} setMenuState={props.setMenuState}/>}
        {props.menuState.show && 
            <div style={{padding: "3px"}}>
                <div style={{width: "100%"}}>
                    <div style={{display: "inline-block", borderRadius: "5px", backgroundColor: "lightgrey", width: "44%", margin: "0 4% 0 2%"}}>Legend</div>
                    <div style={{display: "inline-block", borderRadius: "5px", backgroundColor: "lightgrey", width: "44%", margin: "0 4% 0 2%"}}>Issue</div>
                </div>
                <div style={{color: "grey"}}>
                    Tap stages for info
                </div>
                <Legend />
                <InformationPresentation stageDescriptions={props.stageDescriptions} stage={props.stage}/>
            </div>
        }
        </animated.div>
    )
}

/*
function TrailInfo (props) {
    return (
        <div style={props.style} >
            <div>
                <h1>{props.stageDescriptions[props.stage].title}</h1>
                <p style={{color: "grey"}}><b><i>{props.stageDescriptions[props.stage].subtitle}</i></b></p>
                <p dangerouslySetInnerHTML={{ __html: props.stageDescriptions[props.stage].description }}></p>
                <ul>{props.stageDescriptions[props.stage].notes.map((note, key)=> <li key={key}>{note}</li>)}</ul>
            </div>
        </div>
    );
}
*/

export default TrailInfo;

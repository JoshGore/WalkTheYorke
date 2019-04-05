// import React, { Component } from 'react';
import React, { useState } from 'react';
import TrailMap from './TrailMap.js';
import TrailInfo from './TrailInfo.js';
import './App.css';

const STAGE_DESCRIPTIONS = require('./data/stage_descriptions.json');

function App() {
    // active stage could re-added for hover effect
    const [selectedStage, setSelectedStage] = useState(0);
    const [menuState, setMenuState] = useState({show: false, addPoint: false});
    const [mapHeight, setMapHeight] = useState("100%");
    const [map, setMap] = useState(undefined);
    const [points, setPoints]  = useState([]);
    const [issue, setIssue]  = useState(undefined);
    return (
        // <div style = {{ height: "100vh", width: "100vw", display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style = {{ height: "100%", width: "100vw", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <TrailMap 
                style={{ flexGrow: 1, width: "100vw", backgroundColor: "rgb(235,234,213)" }}
                stage={selectedStage} 
                handleSelectedStageChange={setSelectedStage}
                menuState={menuState}
                setMenuState={setMenuState}
                map={map}
                setMap={setMap}
                issue={issue}
                setIssue={setIssue}
            ></TrailMap>
            <TrailInfo 
                stage={selectedStage} 
                handleStageChange={setSelectedStage}
                stageDescriptions = {STAGE_DESCRIPTIONS}
                menuState={menuState}
                setMenuState={setMenuState}
                map={map}
                setMap={setMap}
            ></TrailInfo>
        </div>
    );
}

export default App;

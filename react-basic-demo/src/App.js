// import React, { Component } from 'react';
import React, { useState } from 'react';
import TrailMap from './TrailMap.js';
import TrailInfo from './TrailInfo.js';

const STAGE_DESCRIPTIONS = require('./data/stage_descriptions.json');

function App() {
    const [activeStage, setActiveStage] = useState(0);
    const [selectedStage, setSelectedStage] = useState(0);
    return (
        <div style = {{ height: "100vh", width: "100vw", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <TrailInfo 
                style = {{ order: 2, flex: "0 0 33%", zIndex: 2, boxShadow: "0px 0px 3px 3px rgba(0, 0, 0, 0.2)", overflow: "auto" }}
                stage = {selectedStage} 
                show = {1}
                stageDescriptions = {STAGE_DESCRIPTIONS}
                handleStageChange={setSelectedStage}
            ></TrailInfo>
            <TrailMap 
                style = {{ order: 1, flexGrow: 1 }}
                activeStage = {activeStage} 
                selectedStage = {selectedStage} 
                handleActiveStageChange={setActiveStage}
                handleSelectedStageChange={setSelectedStage}
            ></TrailMap>
        </div>
    );
}

export default App;

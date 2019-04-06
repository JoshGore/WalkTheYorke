import React, { useState, useEffect } from 'react';
import Measure from 'react-measure';
import TrailMap from './TrailMap.js';
import TrailInfo from './TrailInfo.js';
import './App.css';

const STAGE_DESCRIPTIONS = require('./data/stage_descriptions.json');

const App = () => {
    // active stage could re-added for hover effect
    const [selected, setSelected] = useState({type: "stage", id: "0"});
    const [menuState, setMenuState] = useState({show: false, tempHide: false, addPoint: false});
    const [mapHeight, setMapHeight] = useState(null);
    const [map, setMap] = useState(undefined);
    const [points, setPoints]  = useState([]);
    const [issueMode, setIssueMode] = useState(false);
    const [dimensions, setDimensions] = useState({width: -1, height: -1});
    const [issue, setIssue]  = useState({type: 'Suggestion', details: '' , name: '', contact: '', lngLat: undefined, id: 0});
    const [issues, setIssues] = useState([
        {id: 0, type: 'Damaged Asset', details: 'tank has hole and tap is broken so no water', name: "John Smith", contact: "0410 123 456", lngLat: {lng: 137.501825016608, lat: -34.23413869183976}},
        {id: 1, type: 'Hazard', details: "looks like a shortcut but don't try crossing the mud here!", lngLat: {lng: 137.508753057619, lat: -34.12546572692556}},
        {id: 2, type: 'Missing Asset', details: "had some trouble finding my way here... marker missing?", name: "Kevin", contact: "kev@gmail.com", lngLat: {lng: 137.78166596929742, lat: -34.939216678479475}},
    ]);
    return (
        <Measure 
            bounds
            onResize={contentRect => {
                setDimensions(contentRect.bounds)
            }}>
        {({measureRef}) => (<div ref={measureRef} style = {{ height: "100%", width: "100vw", display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <TrailMap 
                style={{ flexGrow: 1, width: "100vw", backgroundColor: "rgb(235,234,213)", ...(mapHeight && {height: mapHeight, position: "absolute"}) }}
                // style={{ flexGrow: 1, width: "100vw", backgroundColor: "rgb(235,234,213)", }}
                selected={selected} 
                setSelected={setSelected}
                menuState={menuState}
                setMenuState={setMenuState}
                map={map}
                setMap={setMap}
                issue={issue}
                setIssue={setIssue}
                issues={issues}
                setIssues={setIssues}
            />
            <TrailInfo 
                selected={selected} 
                setSelected={setSelected}
                stageDescriptions = {STAGE_DESCRIPTIONS}
                menuState={menuState}
                setMenuState={setMenuState}
                map={map}
                setMap={setMap}
                setMapHeight={setMapHeight}
                issue={issue}
                setIssue={setIssue}
                issueMode={issueMode}
                setIssueMode={setIssueMode}
                parentDimensions={{...dimensions}}
                issues={issues}
                setIssues={setIssues}
            />
            </div>)}
        </Measure>
    );
}

export default App;

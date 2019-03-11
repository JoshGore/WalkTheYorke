// import React, { Component } from 'react';
import React, { useState } from 'react';

function TrailInfo (props) {
    return (
        <div style={props.style} >
            <h1>{props.stageDescriptions[props.stage].title}</h1>
            <p style={{color: "grey"}}><b><i>{props.stageDescriptions[props.stage].subtitle}</i></b></p>
            <p dangerouslySetInnerHTML={{ __html: props.stageDescriptions[props.stage].description }}></p>
            <ul>{props.stageDescriptions[props.stage].notes.map((note, key)=> <li key={key}>{note}</li>)}</ul>
        </div>
    );
}

export default TrailInfo;

// import React, { Component } from 'react';
import React, { useState } from 'react';
import { useSpring, animated } from 'react-spring';

const LegendAreaEntry = ({color, description}) => {
    return (
        <div>
            <div style={{width: "20px", display: "inline-block"}}>
                <span style={{display: "inline-block", marginRight: "10px", height: "10px", width: "10px", borderRadius: "50%", backgroundColor: color}}></span>
            </div>
            {description}
        </div>
    )
};
const LegendLineEntry = ({color, description}) => {
    return (
        <div>
            <div style={{width: "20px", display: "inline-block"}}>
                <div style={{display: "inline-block", height: "2px", width: "15px", backgroundColor: color, transform: "rotate(-45deg)", transformOrigin: "0% 0%"}} />
            </div>
            {description}
        </div>
    )
};

// button to view info
// bar with "tap for info"
// transition to info
// open to 2/3 on scroll
const InfoButton = ({setMenuState, menuState}) => {
    return (
        <div 
            onClick={() => setMenuState({...menuState, show: true})} 
            style={{padding: "3px", lineHeight: "calc(45px - 6px)", color: "grey"}}>
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
            <LegendAreaEntry color={"hsl(33, 100%, 64%)"} description={"Issue"} />
            <LegendLineEntry color={"hsl(33, 100%, 64%)"} description={"Walk"} />
            <LegendLineEntry color={"hsl(0, 100%, 69%)"} description={"Bike"} />
            <LegendLineEntry color={"hsl(82, 100%, 41%)"} description={"Shared"} />
            <LegendLineEntry color={"hsl(46, 98%, 30%)"} description={"Unknown"} />
            <div><span style={{display: "inline-block", height: "10px", marginRight: "10px", width: "10px"}}><img src="./icons/shelter-15.png" /></span>Shelter</div>
        </div>
    )
}

const InformationPresentation = ({menuState, setMenuState, stageDescriptions, issues, selected}) => {
    return (
        <>
        {selected.type === "stage" && 
            <>
            <div style={{color: "grey", backgroundColor: "lightgrey", padding: "3px"}}>Tap map features for info</div>
            <div style={{margin: "10px 10px 0px 10px" }}>
                <IssueButton menuState={menuState} setMenuState={setMenuState} />
                <Legend />
            </div>
            <div style={{padding: "0 10px 0 10px"}}>
                <h3>{stageDescriptions[selected.id].title}</h3>
            </div>
            <div style={{backgroundColor: "lightgrey", padding: "3px"}}>
                <ul>{stageDescriptions[selected.id].notes.map((note, key)=> <li key={key}>{note}</li>)}</ul>
            </div>
            <div style={{padding: "0 10px 0 10px"}}>
                <p style={{color: "grey"}}><b><i>{stageDescriptions[selected.id].subtitle}</i></b></p>
                <p dangerouslySetInnerHTML={{ __html: stageDescriptions[selected.id].description }}></p>
            </div>
            </>
        }
        {selected.type === "issue" &&
            <>
                <div style={{color: "grey", backgroundColor: "lightgrey", padding: "3px"}}>Tap map features for info</div>
                <div style={{margin: "10px 10px 0px 10px" }}>
                    <IssueButton menuState={menuState} setMenuState={setMenuState} />
                    <Legend />
                </div>
                <div style={{padding: "0 10px 0 10px"}}>
                    <h3>{issues.filter(issue => issue.id === selected.id)[0].type}</h3>
                </div>
                <div style={{padding: "0 10px 0 10px"}}>
                    <p>{issues.filter(issue => issue.id === selected.id)[0].details}</p>
                </div>
                <div style={{padding: "0 10px 0 10px"}}>
                    <p>{issues.filter(issue => issue.id === selected.id)[0].name}</p>
                </div>
                <div style={{padding: "0 10px 0 10px"}}>
                    <p>{issues.filter(issue => issue.id === selected.id)[0].contact}</p>
                </div>
            </>
        }
        </>
    )
}

const IssueButton = ({menuState, setMenuState, setIssue}) => {
    return <div onClick={() => setMenuState({...menuState, addPoint: true})} style={{display: "inline-block", borderRadius: "5px", backgroundColor: "lightgrey", width: "100%"}}>Issue</div>
}

const IssueForm = ({menuState, setMenuState, issue, setIssue, issues, setIssues}) => {
    const submit = (event) => {
        event.preventDefault();
        if(issue.lngLat) {
            setIssues([...issues, issue]);
            setIssue({type: 'Suggestion', details: '', name: '', contact: '', lngLat: undefined,});
        };
    };
    const cancel = () => {
        setMenuState({...menuState, addPoint: false})
        setIssue({type: '', description: '', lngLat: undefined,});
    };
    const handleTypeChange = (event) => {
        setIssue({...issue, type: event.target.value});
    }
    const handleDetailsChange = (event) => {
        setIssue({...issue, details: event.target.value});
    }
    const handleNameChange = (event) => {
        setIssue({...issue, name: event.target.value});
    }
    const handleContactChange = (event) => {
        setIssue({...issue, contact: event.target.value});
    }

    return (
        <div>
            <div onClick={() => cancel()} style={{display: "inline-block", borderRadius: "5px", backgroundColor: "lightgrey", width: "100%"}}>Cancel</div>
            <form onSubmit={submit} style={{padding: "3px"}}>
                <div style={{width: "100%"}}>
                    <label>
                        Type:&nbsp;
                        <select value={issue.type} onChange={(event) => handleTypeChange(event)}>
                            <option value="Suggestion">Suggestion</option>
                            <option value="Damaged Asset">Damaged Asset</option>
                            <option value="Missing Asset">Missing Asset</option>
                            <option value="Hazard">Hazard</option>
                            <option value="Other">Other</option>
                        </select>
                    </label>
                </div>
                <div style={{width: "100%"}}>
                    <label>
                        Details:
                        <textarea style={{width: "100%"}} value={issue.details} onChange={(event) => handleDetailsChange(event)} />
                    </label>
                </div>
                <div style={{width: "100%"}}>
                    <label>
                        Contact Name:&nbsp;
                        <input type="text" value={issue.name} onChange={(event) => handleNameChange(event)} />
                    </label>
                </div>
                <div style={{width: "100%"}}>
                    <label>
                        Contact Details:&nbsp;
                        <input type="text" value={issue.contact} onChange={(event) => handleContactChange(event)} />
                    </label>
                </div>
                <input type="submit" value="Submit" />
            </form>
        </div>
    )
}

const TrailInfo = ({setMapHeight, menuState, setMenuState, parentDimensions, map, setMap, stageDescriptions, selected, issue, setIssue, issues, setIssues}) => {
    const toggleMenuAnimation = useSpring({
        height: menuState.show ? `${parentDimensions.height * .66}px` : "45px",
        backgroundColor: menuState.show ? "white" : "lightgrey",
        marginTop: menuState.show ? "-7px" : "0px",
        borderRadius: menuState.show ? "7px 7px 0px 0px" : "0px 0px 0px 0px",
        progress: menuState.show ? 0 : 100,
        onRest: () => map && map.resize(),
        onFrame: (param) => (map && (param.progress > 0.5 || param.progress === 0) && (param.progress < 99.5 || param.progress === 100) && map.resize() ),
        // onFrame: () => map && map.resize(),
        config: {
            mass: 1.5,
            tension: 300,
            friction: 30,
        }
    });
    return (
        <animated.div style={{
            ...toggleMenuAnimation,
            ...(menuState.tempHide && {height: "45px"}),
            zIndex: 2, 
            boxShadow: "0px 0px 3px 3px rgba(0, 0, 0, 0.2)", 
            overflow: "auto",
        }}>
        {!menuState.show && <InfoButton menuState={menuState} setMenuState={setMenuState}/>}
        {menuState.show &&  
            <>
                {!menuState.addPoint && <InformationPresentation stageDescriptions={stageDescriptions} issues={issues} selected={selected} menuState={menuState} setMenuState={setMenuState}/>}
                {menuState.addPoint && <IssueForm menuState={menuState} setMenuState={setMenuState} issue={issue} setIssue={setIssue} issues={issues} setIssues={setIssues}/>}
            </>
        }
        </animated.div>
    )
}

export default TrailInfo;

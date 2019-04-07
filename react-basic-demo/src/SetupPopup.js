import React, { useState } from 'react';
    // const [userType, setUserType] = useState({activity: "all", accessible: true});
const SetupPopup = ({userType, setUserType, menuState, setMenuState}) => {
    const setSelection = (options) => {
        options.accessible ? setUserType({...userType, accessible: true}) : setUserType({...userType, accessible: false});
        setMenuState({...menuState, setup: false});
    };

    return (
        menuState.setup && <>
            <div style={{position: "absolute", width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.5)", zIndex: 10, }} />
            <div style={{position: "absolute", width: "75%", height: "75%", top: "12.5%", marginLeft: "12.5%", marginRight: "12.5%", backgroundColor: "white", zIndex: 10}}>
                <div style={{height: "100%", width: "100%", padding: "10px"}}>
                    <button onClick={() => setSelection({accessible: true})}>Large Text</button>
                    <button onClick={() => setSelection({accessible: false})}>Normal Text</button>
                </div>
            </div>
        </>
    )
}
export default SetupPopup;
/*
        */

import React, { useState, useEffect } from 'react';
import ReactMapboxGl, { Layer, Source, Image, Feature } from "react-mapbox-gl";
import MapboxGL from "mapbox-gl";
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import MapboxDraw from "@mapbox/mapbox-gl-draw";

const Map = ReactMapboxGl({
    accessToken: "pk.eyJ1Ijoiam9zaGciLCJhIjoiTFBBaE1JOCJ9.-BaGpeSYz4yPrpxh1eqT2A",
})

// const STAGE_DESCRIPTIONS = require('./data/stage_descriptions.json');

const WTY_LINE_SOURCE = {
    "type": "geojson",
    "data": "./data/walktheyorke_naturemaps_stages.geojson"
};

const WTY_SHELTER_SOURCE = {
    "type": "geojson",
    "data": "./data/walktheyorke_oldcouncil_shelters.geojson"
};

const TRAIL_LINE_COLOR = [
    "case",
    [
        "match",
        ["get", "TRAILTYPE"],
        ["", "WALKING"],
        true,
        false
    ],
    "hsl(33, 100%, 64%)",
    [
        "match",
        ["get", "TRAILTYPE"],
        ["", "CYCLING"],
        true,
        false
    ],
    "hsl(0, 100%, 69%)",
    [
        "match",
        ["get", "TRAILTYPE"],
        ["", "SU:WALK,BIKE"],
        true,
        false
    ],
    "hsl(82, 100%, 41%)",
    "hsl(46, 98%, 30%)"
];

const TRAIL_PAINT = {
    "line-color": TRAIL_LINE_COLOR,
    "line-width": [
        "interpolate",
        ["linear"],
        ["zoom"],
        4,
        1,
        22,
        5
    ]
}
const TRAIL_CASE_PAINT = {
    "line-color": "white",
    "line-width": [
        "interpolate",
        ["linear"],
        ["zoom"],
        4,
        2,
        22,
        10
    ]
}

const TRAIL_HIGHLIGHT_PAINT = {
    "line-color": TRAIL_LINE_COLOR,
    "line-width": [
        "interpolate",
        ["linear"],
        ["zoom"],
        4,
        2,
        22,
        10
    ]
}

const TRAIL_HIGHLIGHT_CASE_PAINT = {
    "line-color": "white",
    "line-width": [
        "interpolate",
        ["linear"],
        ["zoom"],
        4,
        4,
        22,
        20
    ]
}


function TrailMap(props) {
    const [fitBounds, setFitBounds] = useState([[136.585109, -35.314486],[138.366868, -33.990990]]);
    // const [map, setMap] = useState();
    var onStyleLoad = (map) => {
        props.setMap(map);
        map.resize();
        map.fitBounds(fitBounds);
        // set max bound to result + margin if want to fit
        var geolocate = new MapboxGL.GeolocateControl({
            trackUserLocation: true,
            fitBoundsOptions: {
                maxZoom: map.getZoom()
            }
        });
        map.addControl(geolocate);
        /*
        setTimeout(() => {
            geolocate.trigger(); 
        }, 100);
        */
    }
    var trailLineMouseMove = (evt) => {
        var map = evt.target;
        map.getCanvas().style.cursor = 'pointer';
    }
    var trailLineMouseLeave = (evt) => {
        var map = evt.target;
        map.getCanvas().style.cursor = '';
    }
    var mapClick = (map, evt) => {
        // var map = evt.target;
        if (!props.menuState.addPoint) {
            var feature = map.queryRenderedFeatures(evt.point).filter(feature => feature.layer.id === "trail_lines_target")[0];
            if (feature) {
                props.handleSelectedStageChange(feature.properties.STAGE)
            }
            else {
                props.handleSelectedStageChange("0");
                props.setMenuState({...props.menuState, show: false})
            }
        }
        else {
            console.log("setting issue");
            props.setIssue({...props.issue, lngLat: {...evt.lngLat}})
            // add a point at evt.lngLat by updating issue state
            // evt.lngLat
        }
    }
    useEffect(() => {
        // map && setTimeout((() => map.resize()), 600);
        /*
        map && map.setMaxBounds ([
            [ map.getBounds().getWest() - 0.1, map.getBounds().getSouth() - 0.1 ],
            [ map.getBounds().getEast() + 0.1, map.getBounds().getNorth() + 0.1 ]
        ]);
        */
    });
    return (
        <Map
            fitBounds = {fitBounds}
            onStyleLoad = {onStyleLoad}
            onClick = {mapClick}
            style = "mapbox://styles/joshg/cjsv8vxg371cm1fmo1sscgou2"
            containerStyle = {props.style}>
            <Source id="trail_lines" geoJsonSource={WTY_LINE_SOURCE} />
            <Source id="trail_shelters" geoJsonSource={WTY_SHELTER_SOURCE} />
            <Image id={'custom-shelter-icon'} url={"./icons/custom-shelter-15.png"} />
            <Layer 
                id = "issue" 
                type="circle"
                paint={{"circle-radius": 8, "circle-color": "red", "circle-stroke-width": 3, "circle-stroke-color": "white"}}
        >
                {props.issue && <Feature coordinates={[props.issue.lngLat.lng, props.issue.lngLat.lat]}/>}
            </Layer>
            <Layer
                id = "trail_shelters"
                type = "symbol"
                sourceId = "trail_shelters"
                layout = {{ 
                    "icon-image": "custom-shelter-icon",
                    "icon-size": .8,
                    "icon-allow-overlap": true,
                    "text-allow-overlap": false,
                    "text-optional": true,
                    "text-field": "{NAME}",
                    "text-font": [
                        "Open Sans Italic",
                        "Arial Unicode MS Regular"
                    ],
                    "text-size": 10,
                    "text-anchor": "right",
                    "text-justify": "right",
                    "text-max-width": 12,
                    "text-offset": [-1, 0]
                }}
                paint = {{
                    "icon-opacity": 1,
                    "text-color": "hsl(131, 83%, 19%)"
                }}
            ></Layer>
            <Layer 
                id = "trail_lines_target"
                before = "contour-label"
                type = "line"
                sourceId = "trail_lines"
                onMouseMove = {trailLineMouseMove}
                onMouseLeave = {trailLineMouseLeave}
                paint = {{
                    "line-width": 40,
                    "line-opacity": 0
                }}
            ></Layer>
            <Layer 
                id = "trail_lines_highlight"
                before = "trail_lines_target"
                type = "line"
                sourceId = "trail_lines"
                layout = {{
                    "line-join": "round",
                    "line-cap": "round"
                }}
                paint = {TRAIL_HIGHLIGHT_PAINT}
                filter = {["in", "STAGE", props.stage]}
            ></Layer>
            <Layer 
                id = "trail_lines_highlight_case"
                before = "trail_lines_highlight"
                type = "line"
                sourceId = "trail_lines"
                layout = {{
                    "line-join": "round",
                    "line-cap": "round"
                }}
                paint = {TRAIL_HIGHLIGHT_CASE_PAINT}
                filter = {["in", "STAGE", props.stage]}
            ></Layer>
            <Layer 
                id = "trail_lines"
                before = "trail_lines_highlight_case"
                type = "line"
                sourceId = "trail_lines"
                layout = {{
                    "line-join": "round",
                    "line-cap": "round"
                }}
                paint = {TRAIL_PAINT}
            ></Layer>
            <Layer 
                id = "trail_lines_case"
                before = "trail_lines"
                type = "line"
                sourceId = "trail_lines"
                layout = {{
                    "line-join": "round",
                    "line-cap": "round"
                }}
                paint = {TRAIL_CASE_PAINT}
            ></Layer>
        </Map>
    );
}

export default TrailMap;

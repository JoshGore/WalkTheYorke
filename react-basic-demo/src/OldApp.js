import React, { Component } from 'react';
import './App.css';
import ReactMapboxGl, { Layer, Source } from "react-mapbox-gl";
import MapboxGL from "mapbox-gl";
import Legend from "./Legend.js";

const Map = ReactMapboxGl({
    accessToken: "pk.eyJ1Ijoiam9zaGciLCJhIjoiTFBBaE1JOCJ9.-BaGpeSYz4yPrpxh1eqT2A",
})

const STAGE_DESCRIPTIONS = require('./data/stage_descriptions.json');

const WTY_SOURCE = {
    "type": "geojson",
    "data": "./data/walktheyorke_naturemaps_stages.geojson"
};

const TRAIL_LINE_COLOR =  
    [
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
    ]
;

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

/*
const LEGEND_STYLE = {
    backgroundColor: "#fff", 
    borderRadius: "3px", 
    "bottom": "30px", 
    "padding": "10px", 
    "position": "absolute", 
    "right": "10px", 
    zIndex: 1
}
*/

class App extends Component {
    onMapLoad = (map) => {
        map.setMaxBounds (map.getBounds());
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
    trailLineMouseMove(evt) {
        var map = evt.target
        var feature = map.queryRenderedFeatures(evt.point).filter(feature => feature.layer.id === "trail_lines_target")[0];
        map.setFilter('trail_lines_highlight', ['in', 'STAGE', feature.properties.STAGE]);
        map.setFilter('trail_lines_highlight_case', ['in', 'STAGE', feature.properties.STAGE]);
        map.getCanvas().style.cursor = 'pointer';
    }
    trailLineMouseLeave(evt) {
        var map = evt.target
        map.setFilter('trail_lines_highlight', ['in', 'STAGE', ""]);
        map.setFilter('trail_lines_highlight_case', ['in', 'STAGE', ""]);
        map.getCanvas().style.cursor = '';
    }
    trailClick(evt) {
        var map = evt.target
        var feature = map.queryRenderedFeatures(evt.point).filter(feature => feature.layer.id === "trail_lines_target")[0];
        new MapboxGL.Popup()
            .setLngLat(evt.lngLat)
            .setHTML('<h3>' + STAGE_DESCRIPTIONS[feature.properties.STAGE].title + "</h3>" + STAGE_DESCRIPTIONS[feature.properties.STAGE].description)
            .addTo(map);
    }
    render() {
        return (
            <Map
            fitBounds={[[136.585109, -35.314486],[138.366868, -33.990990]]}
            onStyleLoad={this.onMapLoad}
            style="mapbox://styles/joshg/cjsv8vxg371cm1fmo1sscgou2"
            containerStyle={{
                height: "100vh",
                width: "100vw"
            }}>
            <Legend>
            </Legend>
            <Source id="trail_lines" geoJsonSource={WTY_SOURCE} />
            <Layer 
                id = "trail_lines_target"
                before = "contour-label"
                type = "line"
                sourceId = "trail_lines"
                onMouseMove = {this.trailLineMouseMove}
                onMouseLeave = {this.trailLineMouseLeave}
                onClick = {this.trailClick}
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
                filter = {["in", "STAGE", ""]}
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
                filter = {["in", "STAGE", ""]}
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
}

export default App;

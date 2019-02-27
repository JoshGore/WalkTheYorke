import React, { Component } from 'react';
import './App.css';
// import ReactMapboxGl, { Layer, Feature } from "react-mapbox-gl";
import ReactMapboxGl, { Layer, GeoJSONLayer } from "react-mapbox-gl";
import MapboxGL from "mapbox-gl";

const Map = ReactMapboxGl({
    accessToken: "pk.eyJ1Ijoiam9zaGciLCJhIjoiTFBBaE1JOCJ9.-BaGpeSYz4yPrpxh1eqT2A",
})

const geojson = require('./data/walktheyorke_naturemaps_stages.geojson')

class App extends Component {
    onMapLoad = (map) => {
        map.addControl(new MapboxGL.GeolocateControl());
    }
    onMouseMove(map, evt) {
        // console.log(map.queryRenderedFeatures(evt.point));
    }
    wtyLineMouseMove(evt) {
        var feature = evt.target.queryRenderedFeatures(evt.point)[0];
        var related = evt.target.querySourceFeatures('WTY', {
            sourceLayer: 'WTY-line',
            filter: ['in', 'STAGE', feature.properties.STAGE]
        })
        console.log(related);
    }
    render() {
        return (
            <Map
            fitBounds={[[136.585109, -35.314486],[138.366868, -33.990990]]}
            // maxBounds={[[136.585109, -35.314486],[138.366868, -33.990990]]} 
            onStyleLoad={this.onMapLoad}
            // style="mapbox://styles/joshg/cjsmplt1d0cgv1fqmdzwntor7"
            style="mapbox://styles/mapbox/outdoors-v11"
            onMouseMove={this.onMouseMove}
            containerStyle={{
                height: "100vh",
                width: "100vw"
            }}>
            <GeoJSONLayer 
            // name = "WTY"
            id = "WTY"
            data = { geojson }
            lineOnMouseMove = {this.wtyLineMouseMove}
            linePaint = {
                { "line-color": [
                    "case",
                    [
                        "match",
                        ["get", "TRAILTYPE"],
                        ["", "WALKING"],
                        true,
                        false
                    ],
                    "hsl(33, 98%, 56%)",
                    [
                        "match",
                        ["get", "TRAILTYPE"],
                        ["", "CYCLING"],
                        true,
                        false
                    ],
                    "hsl(0, 94%, 48%)",
                    [
                        "match",
                        ["get", "TRAILTYPE"],
                        ["", "SU:WALK,BIKE"],
                        true,
                        false
                    ],
                    "hsl(131, 96%, 34%)",
                    "hsl(33, 0%, 0%)"
                ] }
            }
            />
            {/*
            <Layer>
            id="WTY-Highlight"
            type="line"
            linePaint = {
                { "line-color": [
                    "case",
                    [
                        "match",
                        ["get", "TRAILTYPE"],
                        ["", "WALKING"],
                        true,
                        false
                    ],
                    "hsl(33, 98%, 56%)",
                    [
                        "match",
                        ["get", "TRAILTYPE"],
                        ["", "CYCLING"],
                        true,
                        false
                    ],
                    "hsl(0, 94%, 48%)",
                    [
                        "match",
                        ["get", "TRAILTYPE"],
                        ["", "SU:WALK,BIKE"],
                        true,
                        false
                    ],
                    "hsl(131, 96%, 34%)",
                    "hsl(33, 0%, 0%)"
                ],
                "line-width": 2}
            }
            
            </Layer>
            */}
            </Map>
        );
    }
}

export default App;

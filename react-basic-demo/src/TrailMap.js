import React, { useState, useEffect } from 'react';
import ReactMapboxGl, { Layer, Source, Image, Feature } from "react-mapbox-gl";
import MapboxGL from "mapbox-gl";

const Map = ReactMapboxGl({
    accessToken: "pk.eyJ1Ijoiam9zaGciLCJhIjoiTFBBaE1JOCJ9.-BaGpeSYz4yPrpxh1eqT2A",
})

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

const TestDiv = ({onClick}) => {
    return (
        <div onClick={onClick} style={{position: "absolute", width: "100px", height: "20px", backgroundColor: "grey", zIndex: 10}}></div>
    )
}

const TrailMap = ({selected, setSelected, menuState, setMenuState, map, setMap, issue, setIssue, issues, setIssues, style}) => {
    const [fitBounds, setFitBounds] = useState([[136.585109, -35.314486],[138.366868, -33.990990]]);
    const [mapClickCoordinates, setMapClickCoordinates] = useState({lngLat: undefined, point: undefined});
    var onStyleLoad = (map) => {
        setMap(map);
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
    const mapClick = (map, evt) => {
        setMap(map);
        setMapClickCoordinates({point: [evt.point.x, evt.point.y], lngLat: evt.lngLat});
    };

    useEffect(() => {
        mapClickCoordinates.point && menuState.addPoint ? addIssue() : updateHighlight();
    }, [mapClickCoordinates]);

    const addIssue = () => {
        setIssue({...issue, lngLat: mapClickCoordinates.lngLat, id: (issues.length > 0 ? issues.slice(-1)[0].id + 1 : 0)})
    };

    const updateHighlight = () => {
        if (map) {
            var feature = map.queryRenderedFeatures(mapClickCoordinates.point).filter(feature => feature.layer.id === "trail_lines_target" || feature.layer.id === "issues")[0];
            setMenuState({...menuState, show: true});
            if (feature) {
                feature.layer.id === "trail_lines_target" && setSelected({type: "stage", id: feature.properties.STAGE});
                feature.layer.id === "issues" && setSelected({type: "issue", id: feature.properties.id});
                setMenuState({...menuState, show: true})
            }
            else {
                setSelected({type: "stage", id: 0});
                setMenuState({...menuState, show: false});
            }
        }
    };
    return (
        <>
            {menuState.addPoint && <div style={{position: "absolute", zIndex: 4, backgroundColor: "rgba(0,0,0,0.2)"}}>Tap to add or move issue</div>}
        <Map
            fitBounds = {fitBounds}
            onStyleLoad = {onStyleLoad}
            onClick = {(map, evt) => mapClick(map, evt)}
            style = "mapbox://styles/joshg/cjsv8vxg371cm1fmo1sscgou2"
            containerStyle = {style}>
            <Source id="trail_lines" geoJsonSource={WTY_LINE_SOURCE} />
            <Source id="trail_shelters" geoJsonSource={WTY_SHELTER_SOURCE} />
            <Source id="issues" geoJsonSource={{
                "type": "geojson",
                "data": {
                    "type": "FeatureCollection",
                    "name": "issues",
                    "crs": {
                        "type": "name",
                        "properties": {
                            "name": "urn:ogc:def:crs:OGC:1.3:CRS84"
                        }
                    },
                    "features": issues.map(issue => ({
                        "type": "Feature",
                        "geometry": {
                            "type": "Point",
                            "coordinates": [issue.lngLat.lng, issue.lngLat.lat]
                        },
                        "properties": {
                            "issueType": issue.type,
                            "description": issue.description,
                            "id": issue.id
                        }
                    }))
                }
            }} />
            <Image id={'custom-shelter-icon'} url={"./icons/custom-shelter-15.png"} onError={() => console.log("image loading error")} />
            <Layer
                id = "trail_shelters"
                type = "symbol"
                sourceId = "trail_shelters"
                layout = {{ 
                    "icon-image": "custom-shelter-icon",
                    "icon-size": .8,
                    "icon-allow-overlap": true,
                    "text-allow-overlap": false,
                    "icon-optional": false,
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
                id = "issue" 
                type="circle"
                paint={{"circle-radius": 8, "circle-color": "red", "circle-stroke-width": 3, "circle-stroke-color": "white"}}
            >
                {issue.lngLat && <Feature coordinates={[issue.lngLat.lng, issue.lngLat.lat]}/>}
            </Layer>
            <Layer 
                id = "issues" 
                type="circle"
                paint={{"circle-radius": 5, "circle-color": "orange", "circle-stroke-width": 2, "circle-stroke-color": "white"}}
                sourceId="issues"
            >
            </Layer>
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
                filter = {["in", "STAGE", (selected.type == "stage" ? selected.id : '')]}
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
                filter = {["in", "STAGE", (selected.type == "stage" ? selected.id : '')]}
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
        </>
    );
}


export default TrailMap;

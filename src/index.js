import "./styles.css";
import "mapbox-gl/dist/mapbox-gl.css";
import * as mapboxgl from "mapbox-gl";
import settings from "./settings.json";

let map;

async function init() {
    const custom = await import("./custom-style.json");
    const neighborhoods = await import("../data/output.json");
    const style = map.getStyle();

    map.addControl(new mapboxgl.ScaleControl({unit: 'imperial'}), 'bottom-right');

    style.sources = {
        ...style.sources,
        ...custom.sources
    };
    style.layers.push(...custom.layers);
    map.setStyle(style);

    map.getSource("neighborhoods").setData(neighborhoods);
}

mapboxgl.accessToken = settings.accessToken;
map = new mapboxgl.Map(settings);
map.on("load", init);

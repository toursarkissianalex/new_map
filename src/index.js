import "./styles.css";
import "mapbox-gl/dist/mapbox-gl.css";
import * as mapboxgl from "mapbox-gl";
import settings from "./settings.json";
import custom from "./custom-style.json";

let map;
let hovered;
const popup = document.querySelector("#popup");

async function init() {
    const output = await import("../data/output.json");
    const style = map.getStyle();

    style.sources = {
        ...style.sources,
        ...custom.sources
    };
    style.layers.push(...custom.layers);
    map.setStyle(style);

    map.getSource("output").setData(output);
    initPopup();
    initLegend();
}

function initPopup() {
    const nameEl = popup.querySelector(".name");
    const countEl = popup.querySelector(".count");

    map.on("mousemove", "output", function(e){
        clearHover();
        if (e.features.length > 0) {
            hovered = e.features[0]
            map.setFeatureState(hovered, {
                hover: true
            });
            popup.style.display = "block";
            nameEl.textContent = hovered.properties.name;
            countEl.textContent = hovered.properties.count;
        }
    });

    map.on("mouseleave", "output", clearHover);
}

function clearHover() {
    if (hovered) {
        map.setFeatureState(hovered, {
            hover: false
        });
        hovered = null;
    }
    popup.style.display = "none";
}

function initLegend() {
    const legend = document.querySelector("#legend");
    const template = document.querySelector("#legend-entry");
    const colors = map.getPaintProperty("output", "fill-extrusion-color").stops;

    colors.forEach(function(color, i) {
        const entry = document.importNode(template.content, true);
        const spans = entry.querySelectorAll("span");
        spans[0].style.backgroundColor = color[1];
        if (colors.length === i+1) {
            spans[1].textContent = `>=${color[0]}`;
        } else {
            spans[1].textContent = `${color[0]}-${colors[i+1][0]-1}`;
        }
        legend.appendChild(entry);
    });
}

mapboxgl.accessToken = settings.accessToken;
map = new mapboxgl.Map(settings);
map.on("load", init);

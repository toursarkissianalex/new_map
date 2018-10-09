import "./styles.css";
import "mapbox-gl/dist/mapbox-gl.css";
import * as mapboxgl from "mapbox-gl";
import settings from "./settings.json";

let map;

async function init() {
    const custom = await import("./custom-style.json");

    const neighborhoods = await import("../data/output.json");

    const style = map.getStyle();

    style.sources = {
        ...style.sources,
        ...custom.sources
    };
    style.layers.push(...custom.layers);
    map.setStyle(style);

    map.getSource('neighborhoods').setData(neighborhoods);


    initLegend();
    initPopup();
}

let hovered;
const popup = document.querySelector('#popup');
function initPopup() {
    const nameSpan = document.querySelector('#name');
    const countSpan = document.querySelector('#count');

    map.on('mousemove', 'neighborhoods', function(e) {
        clearHover();
        if (e.features.length > 0) {
            hovered = e.features[0];
            map.setFeatureState(hovered, {
                'hover': true
            });
            popup.style.display = 'block';

            nameSpan.textContent = hovered.properties.name;
            countSpan.textContent = hovered.properties.count;
        }
    });

    map.on('mouseleave', 'neighborhoods', clearHover)
}

function clearHover() {
    if (hovered) {
        map.setFeatureState(hovered, {
            'hover': false
        });
    }
    popup.style.display = 'none';
    hovered = null;
}

function initLegend() {
    const legend = document.querySelector('#legend');
    const template = document.querySelector('#legend-entry');

    const colors = map.getPaintProperty(
        'neighborhoods',
        'fill-extrusion-color'
    ).stops;

    colors.forEach(function(color, i) {
        const entry = document.importNode(template.content, true);
        const colorSpan = entry.querySelector('.color');
        const valueSpan = entry.querySelector('.value');

        colorSpan.style.backgroundColor = color[1]

        if (colors.length === i+1) {
            valueSpan.textContent = `>=${color[0]}`;
        } else {
            valueSpan.textContent = `${color[0]}-${colors[i+1][0]-1}`;
        }

        legend.appendChild(entry);
    });
}

mapboxgl.accessToken = settings.accessToken;

settings.customAttribution = document.querySelector('#attribution').innerHTML;

map = new mapboxgl.Map(settings);
map.on("load", init);

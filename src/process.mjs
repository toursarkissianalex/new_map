import fs from "fs";
import turf from "@turf/turf";
import neighborhoods from "../data/neighborhoods.json";
import historicPlaces from "../data/historic-places.json";

historicPlaces.features.forEach(function(feature) {
    feature.properties = {
        count: 1
    };
});

let output = turf.collect(neighborhoods, historicPlaces, 'count', 'count');

output.features = output.features.filter(function(feature, i) {
    feature.id = i;
    feature.properties.count = feature.properties.count.reduce(function(value, count) {
        return count + value;
    }, 0);
    return feature.properties.count > 0;
});

output = JSON.stringify(output, null, "\t");

fs.writeFile("../data/output.json", output, function(err) {
    if (err) throw err;

    console.log("success. 👍");
});

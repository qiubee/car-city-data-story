<template>
	<div id="map"></div>
</template>

<script>
import { select, max, scaleSequential, axisBottom, scaleLinear, schemeBuPu, interpolateBuPu, geoMercator, geoPath, json } from "d3";
import { feature } from "topojson";
import { addToLocalStorage, checkInLocalStorage, getFromLocalStorage, removeFromLocalStorage } from "../helpers/storage.js"

export default {
	name: "ChroplethMap",
	mounted() {
		this.createChroplethMap();
	},
	methods: {
		async createChroplethMap() {
			const descriptions = ["Totaal aantal parkeerplaatsen", "Totaal aantal parkeerplaatsen die het hele jaar open zijn", "Totaal aantal parkeerplaatsen met de uitgang altijd open"];
			const path = setupMap(600, 600);
			const provinces = await getParkingData("parkingData", "data/parking_provinces_topo.json");
			addSelectForm(provinces.features, descriptions);
			drawMap(path, provinces);

			function setupMap(width, height) {
				const legend = {
					width: width * 0.8,
					height: 10,
					title: "Parkeerplaatsen"
				};

				const svg = select("#map")
					.insert("svg", ":first-child")
					.attr("viewBox", "0 0 " + 600 + " " + 600)
					.attr("width", width)
					.attr("height", height);

				svg.append("g")
					.attr("class", "map");

				createLegend(svg, legend.width, legend.height, legend.title);

				const scale = width * height / 50;

				const projection = geoMercator()
					.rotate([5.38763888888889, 0])
					.center([0, 52.15616055555555])
					.scale(scale)
					.translate([-990, height / 2]);
				const path = geoPath().projection(projection);
				return path;
			}

			function drawMap(path, data, node = null) {
				const selected = node ?
					node.selectedOptions.item(0).dataset.key :
					"parkingTotal";

				const selectedData = dataFromKey(data.features, selected);

				const svg = select("#map svg");
				const map = select("#map svg g.map");
				const formSelect = select("#map form select");

				const maximum = max(selectedData);
				const n = 10 ** (maximum.toString().length - 1);
				const ceil = Math.ceil(maximum / n) * n;
				const scale = [0, ceil];
				const color = scaleSequential(scale, interpolateBuPu);

				updateLegend(svg, scale);

				map.selectAll("path")
					.data(data.features)
					.join(function (enter) {
						// add path and color scale of province
						enter.append("path")
							.attr("class", "province")
							.attr("d", path)
							.attr("stroke", "#ffffff")
							.attr("fill", function (d) {
								return color(d.properties[selected]);
							})
							// show information on hover
							.append("title")
							.text(function (d) {
								const info = d.properties;
								return `Provincie ${info.province} \n${info[selected]} parkeerplaatsen`;
							});
					}, function (update) {
						// update color and information of province
						update.attr("fill", function (d) {
								return color(d.properties[selected]);
							})
							.selectAll("title")
							.text(function (d) {
								const info = d.properties;
								return `Provincie ${info.province}\n${info[selected]} parkeerplaatsen`;
							});
					}, function (exit) {
						// remove province(s)
						exit.remove();
					});

				// uncomment to see exit pattern:
				// data.features = data.features.slice(0, data.features.length - 1);

				formSelect.on("change", function (event) {
					drawMap(path, data, event.target);
				});
			}

			function createLegend(parentSVG, width, height, title) {
				const legend = parentSVG.append("g")
					.attr("class", "legend")
					.attr("transform", `translate(${height}, ${height * 2})`);

				parentSVG.insert("defs", ":first-child")
					.append("linearGradient")
					.attr("id", "linear-gradient")
					.selectAll("stop")
					.data(schemeBuPu[5])
					.enter()
					.append("stop")
					.attr("offset", function (d, i) {
						return i / 4;
					})
					.attr("stop-color", function (d) {
						return d;
					});

				legend.append("rect")
					.attr("x", -width / 2)
					.attr("y", 0)
					.attr("width", width / 2)
					.attr("height", height)
					.attr("transform", `translate(${width / 2}, ${height})`)
					.attr("fill", "url(#linear-gradient)");

				legend.append("text")
					.text(title)
					.style("font-weight", "500")
					.style("font-size", "0.85rem");

				legend.append("g")
					.attr("class", "scale");
			}

			function updateLegend(parentSVG, scale) {axisBottom
				const width = parseInt(parentSVG.select(".legend rect").attr("width")) + 9;
				const height = parseInt(parentSVG.select(".legend rect").attr("height"));
				const legendScale = scaleLinear(scale, [height, width]);

				parentSVG.select(".legend .scale")
					.attr("transform", "translate(-10, 20)")
					.call(axisBottom(legendScale).ticks(3))
					.select(".domain").remove()
					.style("font-size", "0.85rem");
			}

			function addSelectForm(data, descriptions) {
				const keys = listOfKeysWithNumberValue(data);

				const formSelect = select("#map")
					.append("form")
					.append("label")
					.text("De verdeling van het ")
					.append("select")
					.attr("name", "parking");

				formSelect.selectAll("option")
					.data(keys)
					.enter()
					.append("option")
					.attr("value", function (d) {
						return d.toLowerCase();
					})
					.attr("data-key", function (d) {
						return d;
					})
					.data(descriptions)
					.text(function (d) {
						return d.toLowerCase();
					});
			}

			function dataFromKey(data, keyToFilter) {
				return data.map(function (feature) {
					return Object.entries(feature.properties)
						.reduce(function (acc, property) {
							const key = property[0];
							const value = property[1];
							if (key === keyToFilter && typeof value === "number") {
								acc.push(value);
							}
							return acc;
						}, []);
				}).reduce(function (acc, arr) {
					return acc.concat(arr);
				}).filter(function (a, b, arr) {
					return arr.indexOf(a) === b;
				});
			}

			function listOfKeysWithNumberValue(data) {
				return data.map(function (feature) {
					return Object.entries(feature.properties)
						.reduce(function (acc, property) {
							const key = property[0];
							const value = property[1];
							if (typeof value === "number") {
								acc.push(key);
							}
							return acc;
						}, []);
				}).reduce(function (acc, arr) {
					return acc.concat(arr);
				}).filter(function (a, b, arr) {
					return arr.indexOf(a) === b;
				});
			}

			async function getParkingData(key, path) {
				// test if localStorage is available
				try {
					addToLocalStorage("test", "test")
					removeFromLocalStorage("test")
				} catch(err) {
					console.log(err)
					return await loadJSON(path)
				}
				if (checkInLocalStorage(key)) {
					return getFromLocalStorage(key);
				} else {
					const data = await loadJSON(path);
					addToLocalStorage(key, data);
					return data;
				}
			}

			async function loadJSON(path) {
				const data = await json(path);
				return feature(data, data.objects);
			}
		}
	}
};
</script>

<style>
</style>
<template>
	<div id="provinces">
		<svg></svg>
		<p>Bron: <i>CBS, RDW</i>.</p>
		<form>
			<label>De verdeling van het
				<select @change="updateMap" name="parking">
					<option v-for="item in options" :value="item.value" :data-key="item.key" :key="item.id"
						:selected="mapSelection === item.key">
						{{ item.text }}
					</option>
				</select>
			</label>
		</form>
	</div>
</template>

<script>
import { select, max, scaleSequential, axisBottom, scaleLinear, schemeBuPu, interpolateBuPu, geoMercator, geoPath, json } from "d3";
import { feature } from "topojson";
import { addToLocalStorage, getFromLocalStorage } from "../helpers/storage.js"

export default {
	name: "ProvinceMap",
	data() {
		return {
			mapSelection: String,
			options: Array,
			provinces: Array,
			drawMap: Function
		}
	},
	async mounted() {
		const selectedOptionName = "mapSelection";
		const descriptions = ["Totaal aantal parkeerplaatsen", "Totaal aantal parkeerplaatsen die het hele jaar open zijn", "Totaal aantal parkeerplaatsen met de uitgang altijd open"];
		const path = setupMap(600, 600);
		const provinces = await loadJSON("data/parking_provinces_topo.json");
		this.options = createOptions(provinces.features, descriptions);
		drawMap(path, provinces);

		function setupMap(width, height) {
				const legend = {
					width: width * 0.8,
					height: 10,
					title: "Parkeerplaatsen"
				};

				const svg = select("svg")
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
				let selected = "parkingTotal";

				try {
					if (node) {
						selected = node.selectedOptions.item(0).dataset.key;
						addToLocalStorage(selectedOptionName, selected);
					} else if (getFromLocalStorage(selectedOptionName)) {
						selected = getFromLocalStorage(selectedOptionName);
					}
				} catch(err) {
					if (err.name !== "SecurityError" && !err.message.includes("insecure")) {
						console.error(err);
					}
				}

				const selectedData = dataFromKey(data.features, selected);

				const svg = select("svg");
				const map = select("svg g.map");
				
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
			}

			function createLegend(svg, width, height, title) {
				const legend = svg.append("g")
					.attr("class", "legend")
					.attr("transform", `translate(${height}, ${height * 2})`);

				svg.insert("defs", ":first-child")
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

			function updateLegend(svg, scale) {
				const width = parseInt(svg.select(".legend rect").attr("width")) + 9;
				const height = parseInt(svg.select(".legend rect").attr("height"));
				const legendScale = scaleLinear(scale, [height, width]);

				svg.select(".legend .scale")
					.attr("transform", "translate(-10, 20)")
					.call(axisBottom(legendScale).ticks(3))
					.select(".domain").remove()
					.style("font-size", "0.85rem");
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

			function createOptions(data, descriptions) {
				return listOfKeysWithNumberValue(data).map(function (option, index) {
					return {
						value: option.toLowerCase(),
						text: descriptions[index],
						key: option,
						id: index
					}
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
		
			async function loadJSON(path) {
				const data = await json(path);
				return feature(data, data.objects);
			}

			this.provinces = provinces;
			this.drawMap = drawMap;
			try {
				this.mapSelection = getFromLocalStorage(selectedOptionName);
			} catch(err) {
				if (err.name !== "SecurityError" && !err.message.includes("insecure")) {
					console.error(err);
				}
			}
	},
	methods: {
		updateMap(event) { 
			const data = this.provinces;
			const selectedOption = event.target;
			const drawMap = this.drawMap;
			drawMap(null, data, selectedOption)
		}
	}
};
</script>

<style>
</style>
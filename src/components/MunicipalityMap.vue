<template>
  <div id="municipalities">
		<svg></svg>
		<p>Bron: <i>CBS, RDW</i>.</p>
		<form>
			<label>Kies provincie
				<select @change="updateView" name="provinces">
					<option v-for="item in provinceOptions" :value="item.value" :data-key="item.key" :key="item.id"
						:selected="provinceSelection === item.key">
						{{ item.text }}
					</option>
				</select>
			</label>
			<label>De verdeling van het
				<select @change="updateView" name="parking">
					<option v-for="item in parkingOptions" :value="item.value" :data-key="item.key" :key="item.id"
						:selected="parkingSelection === item.key">
						{{ item.text }}
					</option>
				</select>
			</label>
		</form>
	</div>
</template>

<script>
import { select, geoMercator, geoPath, scaleSequential, max, interpolateBuPu, schemeBuPu, scaleLinear, axisBottom, json } from "d3";
import { feature } from "topojson";
import { addToLocalStorage, getFromLocalStorage } from "../helpers/storage.js"

export default {
	name: "MunicipalityMap",
	data() {
		return {
			provinceSelection: String,
			parkingSelection: String,
			provinceOptions: Array,
			parkingOptions: Array
		}
	},
	async mounted() {
		const parkingInfoDescriptions = ["Totaal aantal parkeergelegenheden", "Totaal aantal parkeergelegenheden die het hele jaar open zijn", "Totaal aantal parkeergelegenheden met de uitgang altijd open"];
		const noDataColor = "rgb(131, 135, 141)";
		const provinceDefaultOption = {
			value: "all",
			text: "Alle provincies",
			key: "all"
		};
		const legend = {
				width: 600 * 0.8,
				height: 10,
				title: "parkeergelegenheden",
				noDataColor: noDataColor
		};
		const vm = this;
		const path = setupMap(600, 600, legend);
		const municipalities = await loadJSON("data/parking_municipalities_topo.json");
		const zoomCoordinates = await json("data/zoom_coordinates.json");
		this.parkingOptions = createOptions(municipalities.features, {
			descriptions: parkingInfoDescriptions
		});
		this.provinceOptions = createOptions(municipalities.features, {
			selection: /province/g,
			default: provinceDefaultOption
		})
		drawMap(path, municipalities);

		function setupMap(width, height, legend) {
			const svg = select("#municipalities svg")
				.attr("viewBox", "0 0 " + 600 + " " + 600)
				.attr("width", width)
				.attr("height", height);

			svg.append("g")
				.attr("class", "map");

			createLegend(svg, legend);

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
			const parkingLSKey = "municipalityParkingSelection";
			const provinceLSKey = "provinceSelection";

			const parkingSelectNode = document.querySelector("#municipalities select[name=\"parking\"]");
			const provinceSelectNode = document.querySelector("#municipalities select[name=\"provinces\"]");

			let parkingSelection = getSelectedOption(parkingSelectNode, parkingLSKey);
			let provinceSelection = getSelectedOption(provinceSelectNode, provinceLSKey);

			if (!parkingSelection) {
				parkingSelection = "parkingTotal";
			}
			if (!provinceSelection) {
				provinceSelection = "all";
			}
			
			vm.provinceSelection = provinceSelection;
			vm.parkingSelection = parkingSelection;

			const selectedProvince = filterProvince(data.features, provinceSelection);

			const parkingData = dataFromKey(selectedProvince, parkingSelection);
			
			const svg = select("#municipalities svg");
			const map = select("#municipalities svg g.map");
			
			const maximum = max(parkingData);
			const n = 10 ** (maximum.toString().length - 2);
			const ceil = Math.ceil(maximum / n) * n;
			const scale = [0, ceil];
			const color = scaleSequential(scale, interpolateBuPu);

			updateLegend(svg, scale);

			if (node && node.name === "provinces") {
				map.selectAll("path")
					.remove();
			}
			
			map.selectAll("path")
				.data(selectedProvince)
				.join(function (enter) {
					// add path and color scale of municipality
					enter.append("path")
						.attr("class", "municipality")
						.attr("d", path)
						.attr("stroke", "rgb(178, 172, 171")
						.attr("fill", function (d) {
							const data = d.properties[parkingSelection];
							if (data === null) {
								return noDataColor;
							} else {
								return color(data);
							}
						})
						// show information on hover
						.append("title")
						.text(function (d) {
							const info = d.properties;
							if (info[parkingSelection] === null) {
								return `Gemeente ${info.municipality} \nGegevens onbekend`;
							} else {
								return `Gemeente ${info.municipality} \n${info[parkingSelection]} parkeergelegenheden`;
							}
						});
				}, function (update) {
					// update color and information of municipality
					update.attr("fill", function (d) {
							const data = d.properties[parkingSelection];
							if (data === null) {
								return noDataColor;
							} else {
								return color(d.properties[parkingSelection]);
							}
						})
						.selectAll("title")
						.text(function (d) {
							const info = d.properties;
							if (info[parkingSelection] === null) {
								return `Gemeente ${info.municipality} \nGegevens onbekend`;
							} else {
								return `Gemeente ${info.municipality}\n${info[parkingSelection]} parkeergelegenheden`;
							}
						});
				}, function (exit) {
					// remove municipality
					exit.remove();
			});

		// zoom in on selected province
		map.call(zoom);

		function zoom(selection) {
			let scale = 1;
			let x = 0
			let y = 0;
			if (provinceSelection && provinceSelection !== "all") {
				for (const item of zoomCoordinates.provinces) {
					if (item.province === provinceSelection) {
						x = item.coordinates.x;
						y = item.coordinates.y;
						scale = item.scale;
					}
				}
			}
			selection.transition()
				.duration(750)
				.attr("transform", `translate(${x}, ${y}) scale(${scale})`);
			}
		}

		function createLegend(svg, options) {
			const height = options.height ? options.height : 500;
			const width = options.width ? options.width : 500;
			const title = options.title ? options.title : "Legend";

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

			if (options.noDataColor) {
				const unknownData = legend.append("g")
					.attr("class", "unknown")
				
				unknownData.append("rect")
					.attr("x", -width / 4)
					.attr("y", height * 4)
					.attr("width", height)
					.attr("height", height)
					.attr("transform", `translate(${width / 4}, ${height * 1.025})`)
					.attr("fill", options.noDataColor);
				
				unknownData.append("text")
					.text("onbekend")
					.attr("transform", `translate(${height * 1.5}, 60)`)
					.style("font-weight", "400")
					.style("font-size", "0.8rem");
			}

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
				.transition()
				.duration(750)
				.call(axisBottom(legendScale).ticks(3))
				.select(".domain").remove()
				.style("stroke", "none")
				.style("font-size", "0.85rem");
		}

		function createOptions(data, options) {
			let keys = [];
			if (!options.selection) {
				keys = listOfKeysWithNumberValue(data)
			} else {
				keys = getDataFromSelection(data, options.selection)
			}
			const result = keys.map(function (option, index) {
				const content = options.descriptions 
					? options.descriptions[index] 
					: option;
				return {
					value: option.toLowerCase(),
					text: content,
					key: option,
					id: index
				}
			});
			if (options.default) {
				result.splice(0, 0, options.default);
				result.map(function (item, i) {
					return item.id = i;
				});
			}
			return result;
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

		function getDataFromSelection(data, selection) {
			return data.map(function (feature) {
				return Object.entries(feature.properties)
					.reduce(function (acc, property) {
						const key = property[0];
						const value = property[1];
						if (key.match(selection)) {
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

		function getSelectedOption(node, localStorageKey) {
			try {
				if (node && node.length > 0) {
					const data = node.selectedOptions.item(0).dataset.key;
					addToLocalStorage(localStorageKey, data);
					return data;
				} else if (node && node.length < 1) {
					return getFromLocalStorage(localStorageKey);
				} else {
					return null;
				}
			} catch(err) {
				if (err.name !== "SecurityError" && !err.message.includes("insecure")) {
					console.error(err);
				} else if (node && node.length > 0) {
					return node.selectedOptions.item(0).dataset.key;
				} else {
					return null;
				}
			}
		}

		function filterProvince(data, province) {
			if (province === "all" || !province) {
					return data;
			} else {
				return data.filter(function (feature) {
					return feature.properties.province === province;
				});
			}
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
			});
		}
		
		async function loadJSON(path) {
			const data = await json(path);
			return feature(data, data.objects);
		}

		this.municipalities = municipalities;
		this.path = path;
		this.drawMap = drawMap;
	},
	methods: {
		updateView(event) { 
			const data = this.municipalities;
			const path = this.path;
			const drawMap = this.drawMap;
			drawMap(path, data, event.target)
		}
	}
}
</script>

<style>

</style>
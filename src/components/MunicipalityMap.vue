<template>
  <div id="municipalities">
		<svg></svg>
		<p>Bron: <i>CBS, RDW</i>.</p>
		<form>
			<label>Kies provincie
				<select @change="updateView" name="provinces">
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
import { json } from "d3";
import { feature } from "topojson";

export default {
	name: "MunicipalityMap",
	data() {
		return {
			provinceSelection: String,
			options: Array,
			municipalities: Array,
			updateView: Function
		}
	},
	async mounted() {
		const municipalities = await loadJSON("data/parking_municipalities_topo.json");
		
		async function loadJSON(path) {
			const data = await json(path);
			return feature(data, data.objects);
		}

		this.municipalities = municipalities
	}
}
</script>

<style>

</style>
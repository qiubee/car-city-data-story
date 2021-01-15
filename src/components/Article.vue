<template>
	<article>
		<header>
			<h1>Nederland parkeerland?</h1>
		</header>
		<section>
			<Markdown :content="intro" />
		</section>
		<section>
			<Markdown :content="provinces" />
			<ProvinceMap />
		</section>
		<section>
			<Markdown :content="municipalities" />
			<MunicipalityMap />
		</section>
		<footer>
			<Markdown :content="resources" />
		</footer>
	</article>
</template>

<script>
import Markdown from "./Markdown.vue";
import ProvinceMap from "./ProvinceMap.vue"
import MunicipalityMap from "./MunicipalityMap.vue"
import intro from "../assets/story/intro.md"
import provinces from "../assets/story/parkeren-provincies.md"
import municipalities from "../assets/story/parkeren-gemeenten.md"
import resources from "../assets/story/bronnen.md"

export default {
	name: "Article",
	components: {
		Markdown,
		ProvinceMap,
		MunicipalityMap
	},
	data() {
		return {
			intro: String,
			provinces: String,
			municipalities: String,
			resources: String
		}
	},
	created() {
		this.intro = intro;
		this.provinces = provinces;
		this.municipalities = municipalities;
		this.resources = resources;

	}
}
</script>

<style>

</style>
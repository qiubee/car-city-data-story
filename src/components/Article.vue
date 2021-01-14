<template>
	<article>
		<header>
			<Markdown :content="intro" />
		</header>
		<ProvinceMap />
		<MunicipalityMap />
	</article>
</template>

<script>
import Markdown from "./Markdown.vue";
import ProvinceMap from "./ProvinceMap.vue"
import MunicipalityMap from "./MunicipalityMap.vue"
import intro from "../assets/story/intro.md"

export default {
	name: "Article",
	components: {
		Markdown,
		ProvinceMap,
		MunicipalityMap
	},
	data() {
		return {
			intro: String
		}
	},
	created() {
		this.intro = intro;
	}
}
</script>

<style>

</style>
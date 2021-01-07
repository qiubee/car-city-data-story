<template>
	<article>
		<ArticleHeader />
		<ProvinceMap />
		<MunicipalityMap />
	</article>
</template>

<script>
import ArticleHeader from "./ArticleHeader.vue";
import ProvinceMap from "./ProvinceMap.vue"
import MunicipalityMap from "./MunicipalityMap.vue"

export default {
	name: "Article",
	components: {
		ArticleHeader,
		ProvinceMap,
		MunicipalityMap
	}
}
</script>

<style>

</style>
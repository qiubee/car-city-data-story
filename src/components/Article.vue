<template>
	<article>
		<ArticleHeader />
		<ChoroplethMap />
	</article>
</template>

<script>
import ChoroplethMap from "./ChoroplethMap.vue"
import ArticleHeader from "./ArticleHeader.vue";

export default {
	name: "Article",
	components: {
		ChoroplethMap,
		ArticleHeader
	}
}
</script>

<style>

</style>
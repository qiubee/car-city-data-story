<template>
	<div v-html="html"></div>
</template>

<script>
import * as showdown from "showdown";
import * as axios from "axios";

export default {
	name: "Markdown",
	props: {
		content: String,
		url: String
	},
	data () {
		return {
			html: String
		}
	},
	async created() {
		const url = this.url;
		const content = this.content;
		if (content) {
			this.html = convertMarkdownToHtml(content);
		} else if (url) {
			const markdown = await get(url);
			this.html = convertMarkdownToHtml(markdown);
		}

		async function get(url) {
			try {
				const { data } = await axios.get(url, {
					responseType: "text"
				});
				if (data) {
					return data;
				}
			} catch (err) {
				return "Could not load content";
			}
		}

		function convertMarkdownToHtml(text) {
			const converter = new showdown.Converter({
			noHeaderId: true
			});
			return converter.makeHtml(text);
		}
	}
}
</script>

<style>
</style>
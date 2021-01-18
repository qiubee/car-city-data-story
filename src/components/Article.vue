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
:root {
	--main-blue: #90DBE0;
	--dark-blue: #92B0F7;
	--light: #BDFBFF;
	--grey-blue: #215D61;
	--dark-grey: #184447;
	--light-blue: #DFD5F0;
	--light-green: #92F7B9;
	--green: #B0ED8C;
	--red: #E0A379;
}

@font-face {
    font-family: Neufreit;
    font-weight: 900;
    src: url("../assets/fonts/neufreit-extrabold.otf") format("opentype");
}

@font-face {
    font-family: Tommy Soft;
    font-weight: 700;
    src: url("../assets/fonts/tommy-soft-bold.otf") format("opentype");
}

@font-face {
    font-family: Tommy Soft;
    font-weight: 600;
    src: url("../assets/fonts/tommy-soft-medium.otf") format("opentype");
}

@font-face {
    font-family: Tommy Soft;
    font-weight: 400;
    src: url("../assets/fonts/tommy-soft-regular.otf") format("opentype");
}

body, * {
	margin: 0;
	padding: 0;
	font-family: Avenir, Helvetica, Roboto, Ubuntu, Arial, sans-serif;
}

ul, ol {
    list-style-type: none;
}

a {
    text-decoration: none;
}

h1, h2, h3, h4, h5, h6 {
	font-family: Neufreit;
	font-weight: 900;
}

h1 {
	font-size: 2rem;
	margin: 1.5rem 0;
}

h2 {
	font-size: 1.75rem;
}

p, a, form *, text, option, li, em {
	font-family: Tommy Soft;
	font-weight: 400;
	color: var(--grey-blue);
}

strong {
	font-family: Tommy Soft;
	font-weight: 700;
}

em {
	font-style: italic;
}

body {
	display: flex;
	justify-content: center;
	background-color: var(--red);
	background-image: url("../assets/images/confetti-pattern.svg");
	background-repeat: repeat;
	background-size: 200%;
}

article {
	margin: 1rem 0.5rem;
	max-width: 30rem;
}

header {
	margin: 3rem 0 7.5rem 0;
	background-color: white;
	border: 0.75rem solid var(--light-blue);
	border-radius: 0.2rem;
	transition: margin ease-in-out 0.5s;
}

header h1 {
	text-align: center;
	color: var(--dark-blue);
}

h2 {
	color: var(--grey-blue);
	background-color: var(--red);
	background-image: url("../assets/images/confetti-pattern.svg");
	background-repeat: repeat;
	background-position: -0.5rem -2.5rem;
	background-size: 200%;
	text-align: center;
	padding: 2.5rem 0;
	text-shadow: 0.1rem 0.1rem var(--light-green);
}

section p {
	margin: 1.1rem 0.75rem 1.5rem 0.75rem;
	line-height: 1.5rem;
	hyphens: manual;
}

section {
	padding: 0.5rem 0;
	background-color: var(--light);
	border-radius: 0.25rem;
}

section:first-child {
	margin-top: 1.5rem;
}

section:nth-child(n+3) {
	padding-top: 0;
}

svg {
	width: 100%;
	height: 100%;
	background-color: var(--red);
	padding: 1rem 0 0.5rem 0;
	border: double var(--main-blue);
	border-width: 0.5rem 0;
}

svg path {
	stroke: var(--red);
}

svg .legend .title {
	font-size: 1rem;
	fill: #232324;
}

svg g.tick, svg .tick text, svg .unknown text {
	font-size: 0.75rem;
	fill: #232324;
}

section svg ~ p {
	font-size: 0.85rem;
	font-weight: 600;
	margin: 0 0.5rem 1rem 0.5rem;
}

svg ~ p i {
	font-weight: 400;
	font-size: 0.8rem;
}

form {
	margin-bottom: 0.5rem;
	padding: 0 0.5rem;
	display: flex;
	flex-direction: column;
	max-width: 26rem;
	margin: 0 auto;
}

section:last-of-type label:first-of-type {
	margin-bottom: 1.5rem;
}
select {
	margin-top: 0.25rem;
	width: 100%;
	max-width: 26rem;
	text-overflow: ellipsis;
}

footer {
	margin: 2.5rem 0 1rem 0;
}

footer p:first-of-type {
	background-color: var(--grey-blue);
	padding: 1rem 1.25rem;
	margin-bottom: 2.5rem;
	border-radius: 0.25rem;
}

footer p:first-of-type em {
	color: white;
}

footer p:first-of-type em {
	font-weight: 600;
}

footer h3, footer h4 {
	font-size: 1.5rem;
	text-align: center;
	color: var(--dark-grey);
	background-color: var(--red);
	padding: 0.5rem;
	max-width: 7.5rem;
	margin: 0 auto;
}

footer h4:last-of-type {
	font-size: 1.3rem;
	color: var(--grey-blue);
	margin-top: 2rem;
}

footer p:not(:first-of-type) {
	margin-top: 1.5rem;
	padding-bottom: 0.5rem;
	font-size: 1rem;
	font-weight: 600;
	background-color: var(--red);
}

footer ul {
	margin-top: 1rem;
	padding: 0.5rem 1rem 1rem 1.5rem;
	background-color: var(--red);
}

footer ul li {
	hyphens: auto;
	margin: 1.5rem 0;
}

footer ul li:first-of-type {
	margin: 0 0 1.5rem 0;
}

footer ul li a {
	text-shadow: 0.1rem 0.1rem var(--dark-blue);
}

footer ul:last-of-type {
	margin: 1.25rem;
	padding: 0.75rem;
}

footer ul:last-of-type li:last-of-type {
	margin: 1.5rem 0 0 0;
}

@media (min-width: 30rem) {
	header {
		margin: 7.5em 0;
	}

	section svg ~ p {
		margin: 0 1rem 1rem 1rem;
	}

	form {
		margin-bottom: 1rem;
		padding: 0 1rem;
	}

	section p {
		margin: 1.1rem 1rem 1.5rem 1rem;
	}
}

@media (min-width: 30rem) and (max-width: 60rem) {
	body {
		background-size: 100%;
	}

	h2 {
		background-size: 175%;
	}
}

@media (min-width: 60rem) {
	body {
		background-size: 50%;
	}

	header {
		position: relative;
		left: 50%;
		transform: translateX(-50%);
		width: 50vw;
	}

	h2 {
		background-size: 165%;
	}

	svg {
		position: relative;
		left: 50%;
		transform: translateX(-50%);
		width: 75vw;
		max-width: 37.5rem;
		height: 100%;
	}
}
</style>
module.exports = {
	chainWebpack: function (config) {
		config.module
			.rule("md")
			.test(/\.md$/)
			.use("raw-loader")
				.loader("raw-loader")
				.end();
	}
};
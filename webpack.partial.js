const webpack = require("webpack");
module.exports = {
  module: {    
    rules: [
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: {
              minimize: true,
            },
          },
        ],
      },
      // {
      //   test: require.resolve('jquery'),
      //   loader: 'expose-loader',
      //   options: {
      //     exposes: {
      //       globalName: 'jQuery',
      //     },
      //   },
      // },
      // {
      //   test: require.resolve('jquery'),
      //   loader: 'expose-loader',
      //   options: {
      //     exposes: {
      //       globalName: '$',
      //     },
      //   },
      // }
    ],
  },
  // plugins: [
  //   new webpack.ProvidePlugin({
	// 		jQuery: "jquery",
	// 	}),
	// 	new webpack.ProvidePlugin({
	// 		moment: "moment",
	// 	})
  //   ,
	// 	new webpack.ProvidePlugin({
	// 		bootstrap: "bootstrap",
	// 	}),
  //   new webpack.ProvidePlugin({
  //     d3: 'd3'
  //   }),
  // ],
};

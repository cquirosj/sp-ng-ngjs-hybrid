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
      {
        test: require.resolve('jquery'),
        loader: 'expose-loader',
        options: {
          exposes: {
            globalName: 'jQuery',
          },
        },
      },
      {
        test: require.resolve('jquery'),
        loader: 'expose-loader',
        options: {
          exposes: {
            globalName: '$',
          },
        },
      },
      {
        test: require.resolve('Rx'),
        loader: 'expose-loader',
        options: {
          exposes: {
            globalName: 'Rx',
          },
        },
      },
    ],
  },
};

# How To

## Setup

### Node

- Install Node: `brew install node`
- Initiate a npm package: `npm init`
- In `package.json`, set private to true to prevent accidentally publishing the package: `"private": true,`
- Remove `"main": "index.js"` from `package.json` if it was added

### Webpack

- Install webpack: `npm install webpack webpack-cli --save-dev`
- Add the HtmlWebpackPlugin: `npm install html-webpack-plugin --save-dev`
- Add the CopyWebpackPlugin: `npm install copy-webpack-plugin --save-dev`
- Add the CSS loader: `npm install style-loader css-loader --save-dev`
- Add the dev server: `npm install webpack-dev-server --save-dev`
- Add webpack-merge: `npm install webpack-merge --save-dev`
- Add TypeScript loader: `npm install ts-loader --save-dev`
- Create a folder called `webpack`
- Add a file called `config.common.js` to the `webpack` folder with the following content:

  ```
  const path = require("path")
  const HtmlWebpackPlugin = require("html-webpack-plugin")
  const CopyWebpackPlugin = require("copy-webpack-plugin")

  module.exports = {
    entry: path.resolve(__dirname, "../src/script.ts"),
    output: {
      filename: "bundle.js",
      path: path.resolve(__dirname, "../dist"),
      clean: true,
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "../src/index.html"),
        minify: false,
      }),
      new CopyWebpackPlugin({
        patterns: [{ from: path.resolve(__dirname, "../static") }],
      }),
    ],
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: "ts-loader",
          exclude: /node_modules/,
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
  }
  ```

- Add a file called `config.dev.js` to the `webpack` folder with the following content:

  ```
  const path = require("path")

  const { merge } = require("webpack-merge")
  const common = require("./config.common.js")

  module.exports = merge(common, {
    mode: "development",
    devtool: "inline-source-map",
    devServer: {
      static: path.resolve(__dirname, "../dist"),
      watchFiles: ["src/**/*"],
    },
  })
  ```

- Add a file called `config.prod.js` to the `webpack` folder with the following content:

  ```
  const { merge } = require("webpack-merge")
  const common = require("./config.common.js")

  module.exports = merge(common, {
    mode: "production",
  })
  ```

- Add the following scripts to `package.json`:

  ```
  "scripts": {
    "build": "webpack --config ./webpack/config.prod.js",
    "dev": "webpack serve --config ./webpack/config.dev.js"
  },
  ```

- Create a folder called `src` and add the following files:
  - `index.html`
  - `script.ts`
  - `style.css`

### TypeScript

- Install TypeScript: `npm install typescript --save-dev `
- Create a file called `tsconfig.json` with the following content:
  ```
  {
    "compilerOptions": {
      "target": "es6",
      "module": "commonjs",
      "esModuleInterop": true,
      "forceConsistentCasingInFileNames": true,
      "strict": true,
      "strictPropertyInitialization": false,
      "skipLibCheck": true,
      "noImplicitAny": true,
      "allowJs": false,
      "outDir": "dist",
    }
  }
  ```

### Three.js

- Install three: `npm install three --save`
- Add TypeScript for three.js: `npm install --save-dev @types/three`
- Install GUI: `npm install lil-gui --save`
- Install GUI types: `npm install @types/dat.gui --save-dev`

## Update

- Check if the npm packages are outdated: `npm outdated`
- Upgrade outdated packages: `npm upgrade`

## Usage

- Run `npm `

import resolve from "rollup-plugin-node-resolve"
import babel from 'rollup-plugin-babel'
// import commonjs from 'rollup-plugin-commonjs'

export default {
	input: "./src/index.js",
	plugins: [resolve(), babel()],
	output: {
		file: "build/Plot.js",
		format: "iife",
		name: "Plot"
	}
};
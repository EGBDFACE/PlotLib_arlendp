import Plot from '../index.js';
var canvas = document.getElementsByTagName('canvas')[0];
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;
import {
	scaleQuantize
} from 'd3-scale';
new Plot.circular(document.getElementsByTagName('canvas')[0], {
	bgColor: 0xF4F4F4
}).chords({
	fileUrl: '/dist/chords/10GRCh37.json',
	fileType: 'json',
	configs: {
		innerRadius: 320 * 0.95,
		outerRadius: 320,
		labels: true,
		ticks: true,
		labelSuffix: 'M',
		labelSpacing: 10
	}
}, [{
		circularType: 'heatmap',
		name: 'CHG',
		fileUrl: '/dist/chords/CHG.v3.bed',
		fileType: 'tsv',
		configs: {
			innerRadius: 0.75 / 0.95,
			outerRadius: 0.9 / 0.95,
			color: function (d, min, max) {
				return scaleQuantize().domain([min, max]).range(['#3247A6', '#4A46AE', '#6E6BBE', '#8F6BBE', '#CD78C0', '#E0619D', '#ED6086', '#E35E73', '#E56060', '#DF5349', '#DC4035', '#ED2E21'])(d.value)
			},
			tips: function (d) {
				return [{
					title: 'Chrom',
					value: d.chrom
				}, {
					title: 'value',
					value: d.value
				}]
			}
		}
	}, {
		circularType: 'heatmap',
		name: 'CpG',
		fileUrl: '/dist/chords/CpG.v3.bed',
		fileType: 'tsv',
		configs: {
			innerRadius: 0.55 / 0.95,
			outerRadius: 0.7 / 0.95,
			color: function (d, min, max) {
				return scaleQuantize().domain([min, max]).range(['#3247A6', '#4A46AE', '#6E6BBE', '#8F6BBE', '#CD78C0', '#E0619D', '#ED6086', '#E35E73', '#E56060', '#DF5349', '#DC4035', '#ED2E21'])(d.value)
			},
			tips: function (d) {
				return [{
					title: 'Chrom',
					value: d.chrom
				}, {
					title: 'value',
					value: d.value
				}]
			}
		}
	},
	// {
	// 	circularType: 'heatmap',
	// 	name: 'CHG1',
	// 	fileUrl: '/dist/chords/CHG.v3.bed',
	// 	fileType: 'tsv',
	// 	configs: {
	// 		innerRadius: 0.65 / 0.95,
	// 		outerRadius: 0.7 / 0.95,
	// 		color: function (d, min, max) {
	// 			return scaleQuantize().domain([min, max]).range(['#fc9999', '#fd8bb5', '#ff88d9', '#e288ff', '#c488ff', '#ab88ff', '#8f88ff', '#889fff', '#6487ff', '#64bdff', '#64daff', '#4df2ff'])(d.value)
	// 		},
	// 		tips: function (d) {
	// 			return [{
	// 				title: 'Chrom',
	// 				value: d.chrom
	// 			}, {
	// 				title: 'value',
	// 				value: d.value
	// 			}]
	// 		}
	// 	}
	// },
	//  {
	// 	circularType: 'heatmap',
	// 	name: 'CHG2',
	// 	fileUrl: '/dist/chords/CHG.v3.bed',
	// 	fileType: 'tsv',
	// 	configs: {
	// 		innerRadius: 0.55 / 0.95,
	// 		outerRadius: 0.6 / 0.95,
	// 		color: function (d, min, max) {
	// 			return scaleQuantize().domain([min, max]).range(['#fc9999', '#fd8bb5', '#ff88d9', '#e288ff', '#c488ff', '#ab88ff', '#8f88ff', '#889fff', '#6487ff', '#64bdff', '#64daff', '#4df2ff'])(d.value)
	// 		},
	// 		tips: function (d) {
	// 			return [{
	// 				title: 'Chrom',
	// 				value: d.chrom
	// 			}, {
	// 				title: 'value',
	// 				value: d.value
	// 			}]
	// 		}
	// 	}
	// }, 
	{
		circularType: 'scatter',
		name: 'lncRNA',
		fileUrl: '/dist/chords/lncRNA.bed',
		fileType: 'tsv',
		configs: {
			innerRadius: 0.35 / 0.95,
			outerRadius: 0.5 / 0.95,
			color: '#E0619D',
			stroke: '#D3498B',
			thickness: 0.5,
			size: 2 * Math.PI,
			// fillOpacity: function (d) {
			// 	var i = scaleLinear().domain([0, 0.01]).range([0.5, 1]).clamp(true)(d.value)
			// 	return i;
			// },
			// min: 0,
			// max: 6,
			// axes: [{
			// 	position: 0.000001,
			// 	thickness: 1,
			// 	color: '#FFAFE3',
			// 	opacity: 0.3
			// }, {
			// 	position: 0.005,
			// 	thickness: 1,
			// 	color: '#FFAFE3',
			// 	opacity: 0.5
			// }, {
			// 	position: 0.01,
			// 	thickness: 1,
			// 	color: '#FFAFE3',
			// 	opacity: 0.7
			// }],
			// backgrounds: [{
			// 	start: 0,
			// 	end: 0.01,
			// 	color: '#FFAFE3',
			// 	opacity: 0.15
			// }],
			tips: function (d, i) {
				return [{
					title: 'Chrom',
					value: d.chrom
				}, {
					title: 'Value',
					value: d.value
				}]
			}
		}
	}, {
		circularType: 'chords',
		name: 'interchr',
		fileUrl: '/dist/chords/interchr.json',
		fileType: 'json',
		configs: {
			stroke: '#3247A6',
			strokeWidth: 1,
			radius: 0.3 / 0.95
		}
	}, {
		circularType: 'chords',
		name: 'intrachr',
		fileUrl: '/dist/chords/intrachr.json',
		fileType: 'json',
		configs: {
			stroke: '#DC4035',
			strokeWidth: 1,
			radius: 0.3 / 0.95
		}
	}
]);
import Plot from '../index.js';
var canvas = document.getElementsByTagName('canvas')[0];
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;
import {
	scaleQuantize
} from 'd3-scale';
new Plot.circular(document.getElementsByTagName('canvas')[0], {
	bgColor: 0xF4F4F4
// }).chords({
   }).visShare({
	fileUrl: '/dist/vepResultDemo/GRCh37.json',
	fileType: 'json',
	configs: {
		innerRadius: 300,
		outerRadius: 320,
		labels: false,
		ticks: true,
		tips: function (d) {
			return d.label
		}
	}
}, [{
	circularType: 'highlight',
	name: 'cytobands',
	fileUrl: '/dist/vepResultDemo/cytobands.csv',
	fileType: 'csv',
	configs: {
		innerRadius: 300,
        outerRadius: 320,
        opacity: 1,
        tips: function (d, i) {
			return [{
				title: 'Name',
				value: d.name
			}, {
				title: 'Chrom',
				value: d.chrom
			}, {
				title: 'Gie Stain',
				value: d.gieStain
			}]
		}
	}
},{
	circularType: 'scatter',
	name: 'lncRNA',
	fileUrl: '/dist/vepResultDemo/vep_homo_result.txt',
	fileType: 'tsv',
	configs: {
		innerRadius: 0.3 / 0.95,
		outerRadius: 0.45 / 0.95,
		color: '#3247A6',
		stroke: '#3247A6',
		thickness: 0.1,
        size: 1.2 * Math.PI,
        min: 0,
		max: 0.01,
		axes: [{
			position: 0.000001,
			thickness: 0.5,
			color: '#DC4035',
			opacity: 0.3
		}, {
			position: 0.005,
			thickness: 0.5,
			color: '#DC4035',
			opacity: 0.5
		}, {
			position: 0.01,
			thickness: 0.5,
			color: '#DC4035',
			opacity: 0.8
		}],
		backgrounds: [{
			start: 0,
			end: 0.01,
			color: '#DC4035',
			/* Rectangle Copy: */
			opacity: 0.06
		}],
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
	circularType: 'heatmap',
	name: 'CHG',
	fileUrl: '/dist/vepResultDemo/vep_homo_result.txt',
	fileType: 'tsv',
	configs: {
		innerRadius: 0.715 / 0.95,
		outerRadius: 0.805 / 0.95,
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
	circularType: 'histogram',
	name: 'his',
	fileUrl: '/dist/vepResultDemo/vep_homo_result.txt',
	fileType: 'tsv',
	configs: {
		innerRadius: 0.5,
		outerRadius: 0.99,
		direction: 'in'
	}
}, {
	circularType: 'line',
	name: 'CHH',
	fileUrl: '/dist/vepResultDemo/vep_homo_result.txt',
	fileType: 'tsv',
	configs: {
		innerRadius: 0.85,
		outerRadius: 0.95,
		maxGap: 1000000,
		min: 0.02,
		max: 0.04,
		color: '#222222',
		axes: [{
			spacing: 0.01,
			thickness: 1,
			color: '#4caf50'
		}],
		backgrounds: [{
			start: 0.02,
			end: 0.04,
			color: '#b0cde2'
		}]
	}
}]);
import Plot from '../index.js';
var canvas = document.getElementsByTagName('canvas')[0];
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;
new Plot.circular(document.getElementsByTagName('canvas')[0], {
	bgColor: 0xF4F4F4
}).scatter({
	fileUrl: '/dist/scatter/GRCh37.json',
	fileType: 'json',
	configs: {
		innerRadius: 320 * 0.95,
		outerRadius: 320,
		labels: true,
		ticks: true,
		labelSuffix: 'M',
		opacity: 0
	}
}, [{
	circularType: 'highlight',
	name: 'cytobands',
	fileUrl: '/dist/scatter/cytobands.csv',
	fileType: 'csv',
	configs: {
		innerRadius: 320 * 0.95,
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
}, {
	circularType: 'scatter',
	name: 'snp_250kb',
	fileUrl: '/dist/scatter/snp1.txt',
	fileType: 'json',
	configs: {
		innerRadius: 0.55 / 0.95,
		outerRadius: 0.9 / 0.95,
		color: '#DC4035',
		opacity: 0.8,
		stroke: '#FFFFFF',
		thickness: 0.5,
		size: 6 * Math.PI,
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
	circularType: 'scatter',
	name: 'snp_1mb',
	fileUrl: '/dist/scatter/snp3.txt',
	fileType: 'json',
	configs: {
		color: '#E0619D',
		opacity: 0.8,
		stroke: '#FFFFFF',
		size: 6 * Math.PI,
		thickness: 0.5,
		min: 0.001,
		max: 0.002,
		innerRadius: 0.25 / 0.95,
		outerRadius: 0.5 / 0.95,
		axes: [{
				position: 0.001,
				thickness: 0.5,
				color: '#E0619D',
				opacity: 0.3
			},
			{
				position: 0.0015,
				thickness: 0.5,
				color: '#E0619D',
				opacity: 0.5
			}, {
				position: 0.002,
				thickness: 0.5,
				color: '#E0619D',
				opacity: 0.8
			}
		],
		backgrounds: [{
			start: 0.001,
			end: 0.002,
			color: '#E0619D',
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
	circularType: 'scatter',
	name: 'snp',
	fileUrl: '/dist/scatter/snp2.txt',
	fileType: 'json',
	configs: {
		color: '#3247A6',
		opacity: 0.8,
		stroke: '#FFFFFF',
		thickness: 0.5,
		size: 6 * Math.PI,
		min: 0.007,
		max: 0.01,
		innerRadius: 0.05 / 0.95,
		outerRadius: 0.2 / 0.95,
		axes: [{
				position: 0.007,
				thickness: 0.5,
				color: '#3247A6',
				opacity: 0.3
			},
			{
				position: 0.0085,
				thickness: 0.5,
				color: '#3247A6',
				opacity: 0.5
			}, {
				position: 0.01,
				thickness: 0.5,
				color: '#3247A6',
				opacity: 0.8
			}
		],
		backgrounds: [{
			start: 0.007,
			end: 0.01,
			color: '#3247A6',
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
}]);
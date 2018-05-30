import Plot from '../index.js';
var canvas = document.getElementsByTagName('canvas')[0];
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;
new Plot.circular(document.getElementsByTagName('canvas')[0], {bgColor: 0xffffff}).stack({
	fileUrl: '/dist/stack/GRCh37.json',
	fileType: 'json',
	configs: {
		innerRadius: 300,
		outerRadius: 320,
		labels: true,
		ticks: true,
		tips: function (d) {
			return d.label
		}
	}
}, [{
	circularType: 'highlight',
	name: 'cytobands',
	fileUrl: '/dist/stack/cytobands.csv',
	fileType: 'csv',
	configs: {
		innerRadius: 300,
		outerRadius: 320
	}
}, {
	circularType: 'stack',
	name: 'stack',
	fileUrl: '/dist/stack/stack.json',
	fileType: 'json',
	configs: {
		innerRadius: 0.7,
		outerRadius: 1,
		thickness: 4,
		margin: 80000,
		direction: 'out',
		strokeWidth: 0,
		color: function (d) {
			if (d.end - d.start > 150000) {
				return 'red'
			} else if (d.end - d.start > 120000) {
				return '#333'
			} else if (d.end - d.start > 90000) {
				return '#666'
			} else if (d.end - d.start > 60000) {
				return '#999'
			} else if (d.end - d.start > 30000) {
				return '#BBB'
			}
		},
		tips: function (d) {
			return `${d.chrom}:${d.start}-${d.end}`
		}
	}
}]);
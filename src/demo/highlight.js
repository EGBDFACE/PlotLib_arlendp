import Plot from '../index.js';
var canvas = document.getElementsByTagName('canvas')[0];
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;
new Plot.circular(document.getElementsByTagName('canvas')[0]).highlight({
	fileUrl: '/dist/highlight/GRCh37.json',
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
	fileUrl: '/dist/highlight/cytobands.csv',
	fileType: 'csv',
	configs: {
		innerRadius: 300,
		outerRadius: 320
	}
}]);
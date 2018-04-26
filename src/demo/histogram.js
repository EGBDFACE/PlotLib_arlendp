import Plot from '../index.js';
new Plot.circular(document.getElementsByTagName('canvas')[0]).histogram({
	fileUrl: '/dist/histogram/GRCh37.json',
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
	fileUrl: '/dist/histogram/cytobands.csv',
	fileType: 'csv',
	configs: {
		innerRadius: 300,
		outerRadius: 320
	}
}, {
	circularType: 'histogram',
	name: 'his',
	fileUrl: '/dist/histogram/his.json',
	fileType: 'json',
	configs: {
		innerRadius: 0.5,
		outerRadius: 0.99,
		direction: 'in'
	}
}]);
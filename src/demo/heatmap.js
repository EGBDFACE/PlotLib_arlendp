import Plot from '../index.js';
new Plot.circular(document.getElementsByTagName('canvas')[0]).chords({
	fileUrl: '/dist/heatmap/10GRCh37.json',
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
	circularType: 'heatmap',
	name: 'CHG',
	fileUrl: '/dist/heatmap/CHG.v3.bed',
	fileType: 'tsv',
	configs: {
		innerRadius: 0.8,
		outerRadius: 0.95
	}
}, {
	circularType: 'heatmap',
	name: 'CHH',
	fileUrl: '/dist/heatmap/CHH.v3.bed',
	fileType: 'tsv',
	configs: {
		innerRadius: 0.5,
		outerRadius: 0.75
	}
}]);
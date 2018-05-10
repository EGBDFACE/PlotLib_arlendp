import Plot from '../index.js';
new Plot.circular(document.getElementsByTagName('canvas')[0], {bgColor: 0xffffff}).chords({
	fileUrl: '/dist/chords/10GRCh37.json',
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
	fileUrl: '/dist/chords/CHG.v3.bed',
	fileType: 'tsv',
	configs: {
		innerRadius: 0.8,
		outerRadius: 0.98
	}
}, {
	circularType: 'heatmap',
	name: 'CpG',
	fileUrl: '/dist/chords/CpG.v3.bed',
	fileType: 'tsv',
	configs: {
		innerRadius: 0.7,
		outerRadius: 0.79
	}
}, {
	circularType: 'chords',
	name: 'interchr',
	fileUrl: '/dist/chords/interchr.json',
	fileType: 'json',
	configs: {
		stroke: '#FF9900',
		strokeWidth: 1,
		radius: function (d) {
			return 0.7;
		},
		tips: function (d) {
			return d.source.id + ' => ' + d.target.id
		}
	}
}, {
	circularType: 'chords',
	name: 'intrachr',
	fileUrl: '/dist/chords/intrachr.json',
	fileType: 'json',
	configs: {
		stroke: '#666600',
		strokeWidth: 1,
		radius: function (d) {
			return 0.7;
		}
	}
}]);
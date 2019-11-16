import Plot from '../index.js';
var canvas = document.getElementsByTagName('canvas')[0];
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;
// console.log('width canvas',canvas.width);
// console.log('height canvas',canvas.height);
import {
    scaleQuantize
} from 'd3-scale';

new Plot.circular(document.getElementsByTagName('canvas')[0], {
    bgColor: 0xffffff
}).visShare({
    fileUrl: '/dist/cancerClassifierDemo/layout.json',
    fileType: 'json',
    configs: {
        innerRadius: 300,
        outerRadius: 320,
        labels: false,
        ticks: false,
    }
}, [
    // {
    //     circularType: 'highlight',
    //     name: 'cytobands',
    //     fileUrl: '/dist/cancerClassifierDemo/sample-0-BLCA-cytobands',
    //     fileType: 'tsv',
    //     configs: {
    //         innerRadius: 280,
    //         outerRadius: 300,
    //         opacity: 1,
    //         strokeWidth: 0.5,
    //         strokeColor: '#000'
    //     }
    // }
    {
        circularType: 'scatter',
        name: 'sample-1',
        fileUrl: '/dist/cancerClassifierDemo/sample-0-BLCA',
        fileType: 'tsv',
        configs: {
            innerRadius: 0.77/0.95,
            outerRadius: 0.8/0.95,
            size: 1.2*Math.PI,
            tips: function (d, i) {
                return [
                    {
                        title: 'score',
                        value: d.score
                    }
                ]
            },
            strokeWidth: 0,
            color: function(d) {
                if (d.score === 0) {
                    return '#225AE3';
                } else {
                    return '#ff0000';
                }
            },
            fillOpacity: function(d) {
                if (d.score === 0) {
                    return 1;
                } else {
                    return d.score;
                }
            }
        }
    }
])
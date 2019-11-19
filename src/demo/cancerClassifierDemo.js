import Plot from '../index.js';
var canvas = document.getElementsByTagName('canvas')[0];
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;
// console.log('width canvas',canvas.width);
// console.log('height canvas',canvas.height);
import {
    scaleQuantize
} from 'd3-scale';

const cancerType = ['BLCA', 'BLCA', 'HNSC', 'HNSC', 'PAAD', 
                    'PAAD', 'PRAD', 'PRAD', 'STAD', 'STAD', 
                    'UCS', 'UCS', 'CESC', 'CESC', 'LUAD', 
                    'LUAD', 'KIRP', 'KIRP', 'ACC', 'ACC', 
                    'BRCA', 'BRCA', 'LGG', 'LGG'];
let configArray = [];

const circleGap = 0.03;
for (let i=0; i<cancerType.length-1; i+=2) {
    configArray[i/2] = {
        circularType: 'scatter',
        name: `sample-${i+1}`,
        fileUrl: `/dist/cancerClassifierDemo/sample-${i}-${cancerType[i]}`,
        fileType: 'tsv',
        configs: {
            innerRadius: (0.8-(i/2+1)*circleGap)/0.95,
            outerRadius: (0.8-(i/2)*circleGap)/0.95,
            size: 1.2*Math.PI,
            strokeWidth: 0,
            tips: function (d, i) {
                return [
                    {
                        title: 'score',
                        value: d.score
                    }
                ]
            },
            color: '#ff0000',
            fillOpacity: function(d) {
                return d.score;
            }
        }
    }
}

configArray.push({
    circularType: 'line',
    name: 'sample-0_line',
    fileUrl: '/dist/cancerClassifierDemo/sample-0-BLCA',
    fileType: 'tsv',
    configs: {
        innerRadius: 0.8/0.95,
        outerRadius: 0.9/0.95,
        min: 0,
        max: 1,
        color: '#000'
    }
});
configArray.push({
    circularType: 'histogram',
    name: 'sample-0_histogram',
    fileUrl: '/dist/cancerClassifierDemo/sample-0-BLCA',
    fileType: 'tsv',
    configs: {
        innerRadius: 0.2/0.95,
        outerRadius: 0.4/0.95,
        direction: 'out',
        color: function(d) {
            if (d.value === 0) {
                // return '#225AE3';
                return '#ffffff';
            } else {
                return '#ff0000';
            }
        },
    }
});

new Plot.circular(document.getElementsByTagName('canvas')[0], {
    bgColor: 0xffffff
}).visShare({
    fileUrl: '/dist/cancerClassifierDemo/layout.json',
    fileType: 'json',
    configs: {
        innerRadius: 300,
        outerRadius: 320,
        labels: {
            display: false,
            size: 0.1,
        },
        ticks: {
            spacing: 100,
            labelDisplay0: false,
            labelSpacing: 2,
            display: true,
            tickScale: 2,
            labelSuffix: 1000,
            labels: false
        }
    }
},configArray);

// new Plot.circular(document.getElementsByTagName('canvas')[0], {
//     bgColor: 0xffffff
// }).visShare({
//     fileUrl: '/dist/cancerClassifierDemo/layout.json',
//     fileType: 'json',
//     configs: {
//         innerRadius: 300,
//         outerRadius: 320,
//         labels: false,
//         ticks: false,
//     }
// }, [
//     // {
//     //     circularType: 'highlight',
//     //     name: 'cytobands',
//     //     fileUrl: '/dist/cancerClassifierDemo/sample-0-BLCA-cytobands',
//     //     fileType: 'tsv',
//     //     configs: {
//     //         innerRadius: 280,
//     //         outerRadius: 300,
//     //         opacity: 1,
//     //         strokeWidth: 0.5,
//     //         strokeColor: '#000'
//     //     }
//     // }
//     {
//         circularType: 'scatter',
//         name: 'sample-1',
//         fileUrl: '/dist/cancerClassifierDemo/sample-0-BLCA',
//         fileType: 'tsv',
//         configs: {
//             innerRadius: 0.77/0.95,
//             outerRadius: 0.8/0.95,
//             size: 1.2*Math.PI,
//             tips: function (d, i) {
//                 return [
//                     {
//                         title: 'score',
//                         value: d.score
//                     }
//                 ]
//             },
//             strokeWidth: 0,
//             color: function(d) {
//                 if (d.score === 0) {
//                     // return '#225AE3';
//                     return '#ffffff';
//                 } else {
//                     return '#ff0000';
//                 }
//             },
//             fillOpacity: function(d) {
//                 if (d.score === 0) {
//                     return 1;
//                 } else {
//                     return d.score;
//                 }
//             }
//         }
//     },
//     {
//         circularType: 'line',
//         name: 'sample-0_line',
//         fileUrl: '/dist/cancerClassifierDemo/sample-0-BLCA',
//         fileType: 'tsv',
//         configs: {
//             innerRadius: 0.8/0.95,
//             outerRadius: 0.9/0.95,
//             min: 0,
//             max: 1,
//             color: '#000'
//         }
//     },
//     {
//         circularType: 'histogram',
//         name: 'sample-0_histogram',
//         fileUrl: '/dist/cancerClassifierDemo/sample-0-BLCA',
//         fileType: 'tsv',
//         configs: {
//             innerRadius: 0.6/0.95,
//             outerRadius: 0.7/0.95,
//             direction: 'out',
//             color: function(d) {
//                 if (d.value === 0) {
//                     // return '#225AE3';
//                     return '#ffffff';
//                 } else {
//                     return '#ff0000';
//                 }
//             },
//         }
//     }
// ])
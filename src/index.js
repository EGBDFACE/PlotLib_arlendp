import bokeh from './Renderer/BokehRenderer';
import circos from './Renderer/CircosRenderer';
const Plot = window.Plot || {};
Plot.bokeh = bokeh;
Plot.circos = circos;
export default Plot;
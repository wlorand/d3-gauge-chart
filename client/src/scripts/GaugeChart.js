const d3 = require('d3');
window.d3 = d3; // allow console log access to the d3 object

/**
 * renderGaugeChart -- declaritive D3 style - direct DOM manip
 * @param {Object} chartObj
 */

function renderGaugeChart(chartObj) {
  // 1- d3 select the chart element and get the width
  const chart = d3.select(chartObj.el);
  const width = chart.attr('width');

  // 2- set chart dimensions based on this width
  const center = width / 2;

  // bezel circles
  const outerBezelWidth = width * 0.009;
  const outerBezelRadius = center - outerBezelWidth;
  const innerBezelWidth = width * 0.072;
  const innerBezelRadius = outerBezelRadius - innerBezelWidth / 2;

  // ticks
  const tickHeight = outerBezelWidth + innerBezelWidth + width * 0.027;
  const tickWidth = width * 0.009;
  const tickHiderRadius = width * 0.345;

  // labels
  const labelY = center / 1.3;
  const valueLabelY = width * 0.75;
  const labelFontSize = width * 0.13;

  // needle
  const needleWidth = width * 0.054;
  const needleCapRadius = width * 0.059;

  // 3- set some tick values
  let angle = -135; // start angle
  const lastTickAngle = 135; // end angle
  const tickSpacing = 13.5;

  // 4- create d3 scale for needle, set data-driven angle to pixel space of .range()
  const needleScale = d3
    .scaleLinear()
    .domain([chartObj.min || 0, chartObj.max || 100])
    .range([angle, lastTickAngle]);

  const needleAngle = needleScale(chartObj.value);

  // 5- render the chart element layers
  // (order matters as no z-index in svg coord space - last coded on top)

  // 5a: Outer Bezel
  const outerBezel = chart
    .append('circle')
    .attr('class', 'gauge-bezel-outer')
    .attr('cx', center)
    .attr('cy', center)
    .attr('stroke-width', outerBezelWidth)
    .attr('r', outerBezelRadius);

  // 5b: Gauge Face
  const face = chart
    .append('circle')
    .attr('class', 'gauge-face')
    .attr('cx', center)
    .attr('cy', center)
    .attr('r', outerBezelRadius - 1);

  // 5c: Inner Bezel (grey)
  const innerBezel = chart
    .append('circle')
    .attr('class', 'gauge-bezel-inner')
    .attr('cx', center)
    .attr('cy', center)
    .attr('stroke-width', innerBezelWidth)
    .attr('r', innerBezelRadius);

  // 5d: Ticks
  while (angle <= lastTickAngle) {
    chart
      .append('line')
      .attr('class', 'gauge-tick')
      .attr('x1', center)
      .attr('y1', center)
      .attr('x2', center)
      .attr('y2', tickHeight)
      .attr('stroke-width', tickWidth)
      .attr('transform', `rotate(${angle} ${center} ${center})`);

    angle += tickSpacing;
  }

  // 5e: Tick Hider
  const tickHider = chart
    .append('circle')
    .attr('class', 'gauge-tick-hider')
    .attr('cx', center)
    .attr('cy', center)
    .attr('r', tickHiderRadius);

  // 5f: Gauge Text Label
  const label = chart
    .append('text')
    .attr('class', 'gauge-label')
    .attr('x', center)
    .attr('y', labelY)
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .attr('font-size', labelFontSize)
    .text(chartObj.label);

  // 5g: Gauge Value (#) Label
  const valueLabel = chart
    .append('text')
    .attr('class', 'gauge-label-value')
    .attr('x', center)
    .attr('y', valueLabelY)
    .attr('text-anchor', 'middle')
    .attr('alignment-baseline', 'middle')
    .attr('font-size', labelFontSize)
    .text(chartObj.value);

  // 5h: Needle - very in the weeds with path drawing instructions (M,L,Z)
  const needle = chart
    .append('path')
    .attr('class', 'gauge-needle')
    .attr('stroke-width', outerBezelWidth)
    .attr(
      'd',
      `M ${center - needleWidth / 2} ${center}
              L ${center} ${tickHeight}
              L ${center + needleWidth / 2} ${center} Z`
    )
    .attr('transform', `rotate(${needleAngle} ${center} ${center})`);

  // 5i: Needle Cap
  const needleCap = chart
    .append('circle')
    .attr('class', 'gauge-needle-cap')
    .attr('cx', center)
    .attr('cy', center)
    .attr('stroke-width', outerBezelWidth)
    .attr('r', needleCapRadius);
}

// invoke the rendering of gauge charts - pass in config object
function render() {
  renderGaugeChart({
    el: '#setlistChart',
    label: 'Setlist',
    value: 85,
  });

  renderGaugeChart({
    el: '#jamsChart',
    label: 'Jams',
    value: 92,
  });

  renderGaugeChart({
    el: '#fidelityChart',
    label: 'Sound',
    value: 78,
  });
}

// Render Charts when DOM is loaded
document.addEventListener('DOMContentLoaded', render);

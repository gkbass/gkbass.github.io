const SAT_SIZE_REL = 35; // degrees per 1/height(sqkm)

const Satellites = Kapsule({
  props: {
    satellites: { default: null }
  },

  stateInit: () => ({
    groupColor: d3.scaleOrdinal(d3.schemeCategory10),
    geoCircle: d3.geoCircle()
      .center(({ latitude, longitude }) => [longitude, latitude].map(r2d))
      .radius(({ height }) => SAT_SIZE_REL / Math.sqrt(height))
      .precision(30),
  
      //comment out prevents geoVoronoi to show up! 
      
      // geoVoronoi: d3.geoVoronoi()
     // .x(d => r2d(d.coords.longitude))
      //.y(d => r2d(d.coords.latitude)),
    tip: d3.tip()
      .attr('class', 'tooltip')
      .direction('s')
      .offset([30, 10])
      .html(({ properties: { site: d } }) => `
        <div><b>${d.name}</b></div>
        <div>${d.group}</div>
        <div>Altitude: <em>${Math.round(d.coords.height)}</em>km</div>
      `)
  }),

  init(svg, state, projection) {
    state.voronoiG = svg.append('g');
    state.satG = svg.append('g');

    state.geoPath = d3.geoPath()
      .projection(projection)
      .pointRadius(2);

    // Tooltip
    svg.call(state.tip);
    state.followCursor = svg.append('circle').style('pointer-events', 'none'); // helper to make tip follow cursor
    svg.on('mousemove', () => state.followCursor.attr('cx', d3.event.pageX).attr('cy', d3.event.pageY));
  },

  update(state) {
    // voronoi polygons
    try {
      const voronoiPolygons = state.voronoiG.selectAll('.voronoi')
        .data(
        state.geoVoronoi(state.satellites).polygons().features,
          d => d.properties.site.name
      );

      voronoiPolygons.exit().remove();

      const newPolygons = voronoiPolygons
        .enter().append('path')
        .attr('class', 'voronoi')
        .on('mousemove', d => state.tip.show(d, state.followCursor.node()))
        .on('mouseout', state.tip.hide);

      voronoiPolygons.merge(newPolygons)
        .attr('d', state.geoPath)
    } catch(e) {} // skip render cycle if voronoi computation errors (due to overlapping nodes)

    // satellite markers
    const sats = state.satG.selectAll('.satellite')
      .data(state.satellites, d => d.name);

    sats.exit().remove();

    const newSats = sats.enter().append('path')
      .attr('class', 'satellite')
      .attr('fill', d => state.groupColor(d.group))
      .attr('fill-opacity', 0.7);

    sats.merge(newSats)
      .attr('d', d => state.geoPath(state.geoCircle(d.coords)));
  }
});

// radians to degrees
function r2d(rad) {
  return rad * 180 / Math.PI;
}
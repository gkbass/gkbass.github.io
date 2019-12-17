
const SatellitesFrame = Kapsule({

  props: { satellites: { default: [] }},

  init(domNode, state) {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const svg = d3.select(domNode).append('svg')
      .attr('width', width)
      .attr('height', height);

    const canvas = svg.append('g');

    const projection = d3.geoOrthographic()
      .scale((height - 10) / 2)
      .translate([width / 2, height / 2])
      .rotate([0, -35, 0])
      .precision(0.1);

    //const projection = d3.geoMercator()
    //  .scale(width / (2 * Math.PI))
    //  .translate([width / 2, height / 2 + 100]);

    const earth = Earth(projection)(canvas.append('g'));

    state.satellitesLayer = Satellites(projection)
      (canvas.append('g'));

    d3.geoZoom()
      .projection(projection)
      .onMove(() => {
        state.satellitesLayer.satellites(state.satellites); // update satellites positions
        earth.redraw();
      })
      (svg.node());

    /*
    const zoomUnityScale = projection.scale();
    const zoom = d3.zoom()
      .on('zoom', () => {
        const transform = d3.event.transform;
        projection.scale(transform.k * zoomUnityScale);
        projection.translate([transform.x, transform.y]);

        earth.redraw();
      });

    zoom(svg);
    zoom.translateBy(svg, ...projection.translate());
    */

    //d3.zoom()
    //  .on('zoom', () => canvas.attr('transform', d3.event.transform))
    //  (svg);
  },

  update(state) {
    state.satellitesLayer.satellites(state.satellites);
  }

});
const Earth = Kapsule({

  methods: {
    redraw: function(state) {
      state.terrainRender && state.terrainRender();
      return this;
    }
  },

  init(svg, state, projection) {
    const path = d3.geoPath()
      .projection(projection);

    state.terrainRender = () => svg.selectAll('path.geo').attr('d', path);

    d3.json('110m.json', world => {
      // water
      svg.append('path').attr('class', 'geo sphere')
        .datum({ type: 'Sphere' });

      // land
      svg.append('path').attr('class', 'geo land')
        .datum(topojson.feature(world, world.objects.land).features[0]);

      // graticules
      svg.append('path').attr('class', 'geo graticule')
        .datum(d3.geoGraticule10());

      state.terrainRender();
    });
  }
});
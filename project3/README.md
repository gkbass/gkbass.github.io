Artificial satellites orbiting the Earth. Data provided by [Space Track](https://www.space-track.org/) in [TLE](https://en.wikipedia.org/wiki/Two-line_element_set) format, propagated to space-time coordinates using [satellite-js](https://github.com/shashwatak/satellite-js).

Each satellite is projected at the location on Earth where it's directly at the zenith. The area of each circle is inversely proportional to the satellite's altitude from the surface, so closer (and faster orbiting) satellites will exhibit a larger radius.

The Voronoi cells are computed iteratively according to the satellite layers in view, using [d3-geo-voronoi](https://github.com/Fil/d3-geo-voronoi).
[d3-geo-zoom](https://github.com/vasturiano/d3-geo-zoom) is used to handle the globe zoom/pan interaction.

See also [Earth Satellites](https://bl.ocks.org/vasturiano/818f5fa0f91f9f3d8a29efe9bf66f8b3) and [Geostationary Satellites](https://bl.ocks.org/vasturiano/9bdeddb97d5c71f425743442761d5384).

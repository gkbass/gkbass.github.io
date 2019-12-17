const START_DATE = '2018-04-26';
const INIT_SHOW_GROUPS = new Set([
  'Chinese Satellites'
//  'United States Satellites'
]);

const SatellitesView = Kapsule({
  props: {
    satData: { default: [] },
    onTimeChange: { default: () => {}}
  },

  stateInit: () => ({
    gui: new dat.GUI(),
    groupControls: {}
  }),

  init(domNode, state) {
    const frameView = SatellitesFrame()(domNode);

    const timeStep = 10 * 1000;
    let time = new Date(START_DATE);
    const ticker = new FrameTicker.default();
    ticker.onTick.add(() => {
      time = new Date(+time + timeStep);
      state.onTimeChange(time);
      frameView.satellites(getSatPositions(state.satData, time));
    });

    state.groupsFolder = state.gui.addFolder('Types');
    state.groupsFolder.open();

    //

    function getSatPositions(sats, posTime) {
      const gmst = satellite.gstime(posTime); // Get sidereal time
      return sats
        .filter(sat => state.groupControls[sat.group])
        .map(sat => {
          // x,y,z position / velocity
          const location = satellite.propagate(sat.satrec, posTime);

          if (!location.position) return null; // can't compute satellite pos

          // lat, lng, height
          sat.coords = satellite.eciToGeodetic(location.position, gmst);
          return sat;
        })
        .filter(d => d); // filter out nulls
    }
  },

  update(state) {
    // Gui options
    new Set(state.satData.map(sat => sat.group)).forEach(group => {
      if (state.groupControls.hasOwnProperty(group)) return; // Group option already exists

      state.groupControls[group] = INIT_SHOW_GROUPS.has(group);
      state.groupsFolder.add(state.groupControls, group);
    });
  }
});

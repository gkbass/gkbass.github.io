const datasets = [
  { name: 'Chinese Satellites', url: '_china.txt' },
  { name: 'United States Satellites', url: '_ustates.txt' },
//  { name: 'Navigation (GPS)', url: '_space-track-gps.txt' },
  { name: 'China Operator/Owner', url: '_chinacomp.txt' },
  { name: 'US Operator/Owner', url: '_uscomp.txt' }
//  { name: 'Highly Eliptical Orbit (HEO)', url: '_uscomp.txt' }  
//  { name: 'Low Earth Orbit (MEO)', url: '_space-track-leo.txt'}
];


const timeLog = document.getElementById('time-log');

Promise.all(datasets.map(d => fetch(d.url).then(r => r.text())))
  .then(data => {

    const satNames = new Set();

    const sats = [].concat(...data.map((groupData, idx) => {
      const group = datasets[idx].name;
      const tles = groupData.split('\n0').map(tle => tle.split('\n'));

      return tles.map(([name, ...tle]) => ({
        satrec: satellite.twoline2satrec(...tle),
        name: name.split(' ').slice(1).join(' '),
        group
      }));
    }))
//      .filter(({ name }) => {
//        if (satNames.has(name)) return false; // remove duplicates
//        satNames.add(name);
//        return true;
//      });

    SatellitesView()
      (document.getElementById('chart'))
      .satData(sats)
      .onTimeChange(t => timeLog.innerText = t.toString());
  });

// Plot a time series of a band's value in Stuttgart regions.

var COLOR = {
  CITY: 'ff0000',
  FOREST: '00ff00'
};

var city = ee.Feature(city, {label: 'City'});
var forest = ee.Feature(forest, {label: 'Forest'});

var str = new ee.FeatureCollection([city, forest])

// Function to mask clouds using the quality band of Landsat 8.
// Reference: https://landsat.usgs.gov/collectionqualityband
var cloudmaskL8 = function(image) {
   var qa = image.select('BQA');
   var pattern = ee.Number(2).pow(4).toInt();
   var mask = qa.bitwise_and(pattern).rightShift(4);
   return image.updateMask(mask.not());
}


// Get brightness temperature data.
var landsat8Toa = ee.ImageCollection('LANDSAT/LC08/C01/T1_TOA');
var temps2018 = landsat8Toa.filterBounds(str)
    .filterDate('2018-01-01', '2019-03-31')
    .map(cloudmaskL8)
    .select('B10');

// Convert temperature to Celsius.
temps2018 = temps2018.map(function(image) {
  return image.addBands(image.subtract(273.15).select([0], ['Temp']));
});

var tempTimeSeries = ui.Chart.image.seriesByRegion({
  imageCollection: temps2018,
  regions: str,
  reducer: ee.Reducer.mean(),
  band: 'Temp',
  scale: 200,
  xProperty: 'system:time_start',
  seriesProperty: 'label'
});
tempTimeSeries.setChartType('ScatterChart');
tempTimeSeries.setOptions({
  title: 'Temperature over time in Stuttgart',
  vAxis: {
    title: 'Temperature (Celsius)'
  },
  lineWidth: 1,
  pointSize: 4,
  series: {
    0: {color: COLOR.CITY},
    1: {color: COLOR.FOREST},
  }
});

print(tempTimeSeries);

Map.addLayer(forest, {color: COLOR.FOREST});
Map.addLayer(city, {color: COLOR.CITY});
// Map.addLayer(stuttgart, {color: 'red'}, 'Stuttgart')
Map.centerObject(stuttgart)

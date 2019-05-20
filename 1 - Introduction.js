// Loading Sentinel 2 Dataset
var s2_dataset = ee.ImageCollection('COPERNICUS/S2')
                  .filterDate('2019-04-01', '2019-05-20')
                  .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
                  .filterBounds(str)
                  .map(function(image){return image.clip(stuttgart)});

print(s2_dataset);
var first_image = ee.Image(s2_dataset.first());
print(first_image);
var rgb = first_image.select(['B4', 'B3', 'B2'])
          // Rescale image
          .multiply(ee.Image([0.0001, 0.0001, 0.0001]));

var visParams = {min: 0, max: 0.3};
Map.centerObject(stuttgart);
Map.addLayer(rgb, visParams, 'Sentinel 2 RGB');




// Loading Landsat 8 Dataset
var l8_dataset = ee.ImageCollection('LANDSAT/LC08/C01/T2')
                  .filterDate('2019-03-05', '2019-05-01')
                  .filterBounds(str);
print(l8_dataset)
var trueColor432 = l8_dataset.select(['B4', 'B3', 'B2']);
var trueColor432Vis = {
  min: 0.0,
  max: 30000.0,
};
Map.addLayer(trueColor432, trueColor432Vis, 'Landsat 8 RGB');
                  
                  
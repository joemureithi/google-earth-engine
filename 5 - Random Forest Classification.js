Map.centerObject(stuttgart)
// Load Sentinel-2 surface reflectance data.
var dataset = ee.ImageCollection('COPERNICUS/S2_SR')
                  .filterDate('2019-01-01', '2019-05-30')
                  .filterMetadata('CLOUDY_PIXEL_PERCENTAGE', 'less_than', 70)
                  .filterBounds(str)
                  .map(function(image){return image.clip(stuttgart)});
print(dataset)
var image = ee.Image(dataset.min());
print(image)
Map.addLayer(image, {bands:['B4', 'B3', 'B2'], min:0, max:3000}, 'S2 Level 2A');  

// Training areas
var newfc = water.merge(urban).merge(forest);
print(newfc, 'newfc')

// Select the bands for training
var bands = ['B2', 'B3', 'B4', 'B5', 'B6', 'B7'];

// Sample the input imagery to get a FeatureCollection of training data.
var training = image.select(bands).sampleRegions({
  collection: newfc,
  properties: ['landcover'],
  scale: 10
});

// Make a Random Forest classifier and train it.
var classifier = ee.Classifier.randomForest().train({
  features: training,
  classProperty: 'landcover',
  inputProperties: bands
});

// Classify the input imagery.
var classified = image.select(bands).classify(classifier);
print(classified)

// Define a palette for the Land Use classification.
var palette = [
  'D3D3D3', // urban (0)  // grey
  '0000FF', // water (1)  // blue
  '008000' //  forest (2) // green
];

// Display the classification result and the input image.
Map.addLayer(classified, {min: 0, max: 2, palette: palette}, 'Land Use Classification');

// Get a confusion matrix representing resubstitution accuracy.
print('RF error matrix: ', classifier.confusionMatrix());
print('RF accuracy: ', classifier.confusionMatrix().accuracy());


// // Calculate the number of pixels of each classification in our polygon
// print('class pixel count within region');
// var waterpx = classified.lt(2).and(classified.gt(0));
// print(waterpx)
// Map.addLayer(waterpx, {min: 0, max: 2, palette: palette }, 'Water');
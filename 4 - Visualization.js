Map.centerObject(stuttgart)

// Define an SLD style color ramp to apply to the image.
var sld_ramp =
  '<RasterSymbolizer>' +
    '<ColorMap type="ramp" extended="false" >' +
      '<ColorMapEntry color="#0000ff" quantity="0" label="0"/>' +
      '<ColorMapEntry color="#2b83ba" quantity="0.1" label="0.1" />' +
      '<ColorMapEntry color="#abdda4" quantity="0.2" label="0.2" />' +
      '<ColorMapEntry color="#ffffbf" quantity="0.3" label="0.3" />' +
      '<ColorMapEntry color="#fdae61" quantity="0.4" label="0.4" />' +
      '<ColorMapEntry color="#d7191c" quantity="0.8" label="0.5" />' +
    '</ColorMap>' +
  '</RasterSymbolizer>';

// Add the image to the map using  the color ramp and interval schemes.
Map.addLayer(image.sldStyle(sld_ramp), {Opacity: 0.6}, 'AOT 04022019');

// Add boundary from shape
Map.addLayer(stuttgart, {palette: 'FF0000'}, 'Stuttgart');
// Map.addLayer(outline, {palette: 'FF0000'}, 'edges');
Map.addLayer(stuttgart.draw({color: '000000', strokeWidth: 1, }), {}, 'drawn');
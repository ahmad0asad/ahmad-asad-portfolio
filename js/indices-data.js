/**
 * Ahmad Asad - Geospatial Spectral Index & Sensor Dataset
 * Powers the interactive spectral tool on spectral-tool.html
 * Grounded in empirical remote sensing literature (IJRS 2026, Elsevier, IEEE).
 */

var RS_DATA = {
  sensors: {
    'sentinel2': {
      id: 'sentinel2',
      name: 'Sentinel-2 MSI',
      fullName: 'Sentinel-2 MultiSpectral Instrument (Copernicus / ESA)',
      platform: 'Sentinel-2A & Sentinel-2B',
      nativeResolutions: '10m, 20m, 60m',
      bands: {
        'Coastal': { band: 'B1', name: 'Coastal Aerosol', wave: 443, width: 27, res: '60m' },
        'Blue': { band: 'B2', name: 'Blue', wave: 490, width: 98, res: '10m' },
        'Green': { band: 'B3', name: 'Green', wave: 560, width: 45, res: '10m' },
        'Red': { band: 'B4', name: 'Red', wave: 665, width: 38, res: '10m' },
        'RedEdge1': { band: 'B5', name: 'Vegetation Red Edge 1', wave: 705, width: 19, res: '20m' },
        'RedEdge2': { band: 'B6', name: 'Vegetation Red Edge 2', wave: 740, width: 18, res: '20m' },
        'RedEdge3': { band: 'B7', name: 'Vegetation Red Edge 3', wave: 783, width: 28, res: '20m' },
        'NIR': { band: 'B8', name: 'NIR Broad', wave: 842, width: 145, res: '10m' },
        'NIR_Narrow': { band: 'B8A', name: 'NIR Narrow', wave: 865, width: 33, res: '20m' },
        'WaterVapour': { band: 'B9', name: 'Water Vapour', wave: 945, width: 26, res: '60m' },
        'SWIR1': { band: 'B11', name: 'SWIR 1', wave: 1610, width: 143, res: '20m' },
        'SWIR2': { band: 'B12', name: 'SWIR 2', wave: 2190, width: 242, res: '20m' }
      },
      geeCollection: 'COPERNICUS/S2_SR_HARMONIZED',
      geePrefix: '',
      hasThermal: false
    },
    'landsat89': {
      id: 'landsat89',
      name: 'Landsat 8/9 OLI',
      fullName: 'Operational Land Imager / TIRS (USGS / NASA)',
      platform: 'Landsat 8 & Landsat 9',
      nativeResolutions: '15m (Pan), 30m (VNIR/SWIR), 100m (Thermal)',
      bands: {
        'Coastal': { band: 'SR_B1', name: 'Coastal Aerosol', wave: 443, width: 16, res: '30m' },
        'Blue': { band: 'SR_B2', name: 'Blue', wave: 482, width: 60, res: '30m' },
        'Green': { band: 'SR_B3', name: 'Green', wave: 561, width: 57, res: '30m' },
        'Red': { band: 'SR_B4', name: 'Red', wave: 655, width: 37, res: '30m' },
        'NIR': { band: 'SR_B5', name: 'NIR', wave: 865, width: 28, res: '30m' },
        'SWIR1': { band: 'SR_B6', name: 'SWIR 1', wave: 1609, width: 85, res: '30m' },
        'SWIR2': { band: 'SR_B7', name: 'SWIR 2', wave: 2201, width: 187, res: '30m' },
        'Thermal': { band: 'ST_B10', name: 'Thermal Infrared 1', wave: 10895, width: 590, res: '100m (resampled to 30m)' }
      },
      geeCollection: 'LANDSAT/LC09/C02/T1_L2',
      geePrefix: '',
      hasThermal: true
    },
    'landsat57': {
      id: 'landsat57',
      name: 'Landsat 5/7 TM/ETM+',
      fullName: 'Thematic Mapper / Enhanced Thematic Mapper Plus (USGS)',
      platform: 'Landsat 5 TM & Landsat 7 ETM+',
      nativeResolutions: '30m (VNIR/SWIR), 60m/120m (Thermal)',
      bands: {
        'Blue': { band: 'SR_B1', name: 'Blue', wave: 485, width: 70, res: '30m' },
        'Green': { band: 'SR_B2', name: 'Green', wave: 560, width: 80, res: '30m' },
        'Red': { band: 'SR_B3', name: 'Red', wave: 660, width: 60, res: '30m' },
        'NIR': { band: 'SR_B4', name: 'NIR', wave: 830, width: 140, res: '30m' },
        'SWIR1': { band: 'SR_B5', name: 'SWIR 1', wave: 1650, width: 200, res: '30m' },
        'Thermal': { band: 'ST_B6', name: 'Thermal', wave: 11450, width: 2100, res: '60m/120m' },
        'SWIR2': { band: 'SR_B7', name: 'SWIR 2', wave: 2215, width: 270, res: '30m' }
      },
      geeCollection: 'LANDSAT/LE07/C02/T1_L2',
      geePrefix: '',
      hasThermal: true
    }
  },

  indices: [
    {
      id: 'sui',
      acronym: 'SUI',
      name: 'Sealed Urban Index',
      category: 'urban',
      featured: true,
      citationBadge: 'Asad et al. (IJRS 2026)',
      formulaDisplay: 'Green - SWIR1',
      description: 'Formulated by Ahmad Asad et al. (2026) in the International Journal of Remote Sensing. Overcomes the chronic spectral confusion between impervious surfaces and dry bare agricultural soil by exploiting the distinct absorption drop of sealed materials in SWIR1 relative to green reflectance.',
      citation: 'Asad, A., Capolupo, A., & Tarantino, E. (2026). A cross-sensor spectral index for soil sealing detection with improved impervious-bare soil discrimination. International Journal of Remote Sensing, DOI: 10.1080/01431161.2026.2715141.',
      requiredBands: ['Green', 'SWIR1'],
      resolutionWarning: 'For Sentinel-2, Green (B3) is native 10m while SWIR1 (B11) is native 20m. In GEE and Rasterio, resample SWIR1 to 10m via bilinear interpolation before subtraction for sub-pixel boundary fidelity.',
      calc: (bands) => `${bands.Green} - ${bands.SWIR1}`,
      geeCode: (bands) => `// Sealed Urban Index (SUI) - Asad et al. (IJRS 2026)
var sui = image.select('${bands.Green}').subtract(image.select('${bands.SWIR1}')).rename('SUI');

// Visualization palette: High SUI highlights impervious surfaces
var suiVis = { min: -0.4, max: 0.3, palette: ['#3b82f6', '#f8fafc', '#dc2626'] };
Map.addLayer(sui, suiVis, 'Sealed Urban Index (SUI)');`,
      qgisFormula: (bands, layer = 'raster') => `("${layer}@${bands.Green}" - "${layer}@${bands.SWIR1}")`,
      pythonCode: (bands) => `# Sealed Urban Index (SUI) - Asad et al. (IJRS 2026)
# Green: ${bands.Green}, SWIR1: ${bands.SWIR1}
with np.errstate(divide='ignore', invalid='ignore'):
    sui = green_arr.astype(np.float32) - swir1_arr.astype(np.float32)
    sui[~valid_mask] = -9999.0`
    },
    {
      id: 'ndbi',
      acronym: 'NDBI',
      name: 'Normalized Difference Built-Up Index',
      category: 'urban',
      featured: false,
      formulaDisplay: '(SWIR1 - NIR) / (SWIR1 + NIR)',
      description: 'Classic index developed by Zha et al. (2003) for mapping built-up urban footprints. Frequently suffers from false positives in dry fallow soil due to high SWIR reflectance in dry agricultural terrain.',
      citation: 'Zha, Y., Gao, J., & Ni, S. (2003). Use of normalized difference built-up index in automatically mapping urban areas from TM imagery. IJRS, 24(3), 583-594.',
      requiredBands: ['SWIR1', 'NIR'],
      resolutionWarning: 'On Sentinel-2, SWIR1 is 20m and NIR (B8) is 10m. Standardize pixel grid to 10m.',
      calc: (bands) => `(${bands.SWIR1} - ${bands.NIR}) / (${bands.SWIR1} + ${bands.NIR})`,
      geeCode: (bands) => `var ndbi = image.normalizedDifference(['${bands.SWIR1}', '${bands.NIR}']).rename('NDBI');
Map.addLayer(ndbi, {min: -0.3, max: 0.3, palette: ['#059669', '#f8fafc', '#ef4444']}, 'NDBI');`,
      qgisFormula: (bands, layer = 'raster') => `(("${layer}@${bands.SWIR1}" - "${layer}@${bands.NIR}") / ("${layer}@${bands.SWIR1}" + "${layer}@${bands.NIR}"))`,
      pythonCode: (bands) => `with np.errstate(divide='ignore', invalid='ignore'):
    denom = (swir1_arr.astype(np.float32) + nir_arr.astype(np.float32))
    ndbi = np.where(denom != 0, (swir1_arr.astype(np.float32) - nir_arr.astype(np.float32)) / denom, -9999.0)
    ndbi[~valid_mask] = -9999.0`
    },
    {
      id: 'ui',
      acronym: 'UI',
      name: 'Urban Index',
      category: 'urban',
      featured: false,
      formulaDisplay: '(SWIR2 - NIR) / (SWIR2 + NIR)',
      description: 'Exploits the reflectance contrast between SWIR2 and NIR to identify artificial impervious surfaces, with sensitivity to concrete and asphalt.',
      citation: 'Kawamura, M., Jayamana, S., & Tsujiko, Y. (1996). Relation between social and environmental condition in Colombo Sri Lanka and urban index estimated by satellite data. Proc. of ACRS.',
      requiredBands: ['SWIR2', 'NIR'],
      resolutionWarning: 'On Sentinel-2, SWIR2 (B12) is 20m while NIR (B8) is 10m.',
      calc: (bands) => `(${bands.SWIR2} - ${bands.NIR}) / (${bands.SWIR2} + ${bands.NIR})`,
      geeCode: (bands) => `var ui = image.normalizedDifference(['${bands.SWIR2}', '${bands.NIR}']).rename('UI');
Map.addLayer(ui, {min: -0.4, max: 0.4, palette: ['#2563eb', '#ffffff', '#dc2626']}, 'Urban Index');`,
      qgisFormula: (bands, layer = 'raster') => `(("${layer}@${bands.SWIR2}" - "${layer}@${bands.NIR}") / ("${layer}@${bands.SWIR2}" + "${layer}@${bands.NIR}"))`,
      pythonCode: (bands) => `with np.errstate(divide='ignore', invalid='ignore'):
    denom = swir2_arr.astype(np.float32) + nir_arr.astype(np.float32)
    ui = np.where(denom != 0, (swir2_arr.astype(np.float32) - nir_arr.astype(np.float32)) / denom, -9999.0)`
    },
    {
      id: 'ebbi',
      acronym: 'EBBI',
      name: 'Enhanced Built-Up and Bare Soil Index',
      category: 'urban',
      featured: false,
      formulaDisplay: '(SWIR1 - NIR) / (10 * sqrt(SWIR1 + Thermal))',
      description: 'Uses NIR, SWIR, and Thermal channels to differentiate built-up from bare soil areas through emissivity-temperature dynamics.',
      citation: 'As-syakur, A. R. et al. (2012). Enhanced Built-Up and Bare Soil Index (EBBI) for Mapping Built-Up and Bare Land in an Urban Area. Remote Sensing, 4(10), 2957-2970.',
      requiredBands: ['SWIR1', 'NIR', 'Thermal'],
      resolutionWarning: 'Requires thermal sensor band (Landsat 8/9 B10, Landsat 5/7 B6). Not natively calculable on Sentinel-2 without external thermal inputs.',
      calc: (bands) => bands.Thermal ? `(${bands.SWIR1} - ${bands.NIR}) / (10 * sqrt(${bands.SWIR1} + ${bands.Thermal}))` : 'Requires Thermal band',
      geeCode: (bands) => bands.Thermal ? `var ebbi = image.expression(
  '(SWIR1 - NIR) / (10 * sqrt(SWIR1 + Thermal))', {
    'SWIR1': image.select('${bands.SWIR1}'),
    'NIR': image.select('${bands.NIR}'),
    'Thermal': image.select('${bands.Thermal}')
  }
).rename('EBBI');
Map.addLayer(ebbi, {min: 0, max: 0.5, palette: ['blue', 'yellow', 'red']}, 'EBBI');` : `// EBBI requires a thermal sensor. Use Landsat 8/9 or Landsat 5/7.`,
      qgisFormula: (bands, layer = 'raster') => bands.Thermal ? `(("${layer}@${bands.SWIR1}" - "${layer}@${bands.NIR}") / (10 * sqrt("${layer}@${bands.SWIR1}" + "${layer}@${bands.Thermal}")))` : 'Requires Thermal band',
      pythonCode: (bands) => bands.Thermal ? `with np.errstate(divide='ignore', invalid='ignore'):
    rad = np.sqrt(np.maximum(swir1_arr + thermal_arr, 0))
    ebbi = np.where(rad > 0, (swir1_arr - nir_arr) / (10.0 * rad), -9999.0)` : `# EBBI requires thermal channel`
    },
    {
      id: 'ndvi',
      acronym: 'NDVI',
      name: 'Normalized Difference Vegetation Index',
      category: 'vegetation',
      featured: false,
      formulaDisplay: '(NIR - Red) / (NIR + Red)',
      description: 'The global standard index for quantifying photosynthetic vegetation biomass, health, and canopy cover. High values indicate healthy, dense chlorophyll canopy.',
      citation: 'Rouse, J. W. et al. (1974). Monitoring the vernal advancement and retrogradation (Green wave effect) of nature vegetation. NASA/GSFC Final Report.',
      requiredBands: ['NIR', 'Red'],
      resolutionWarning: 'Sentinel-2 NIR (B8) and Red (B4) are both native 10m resolution, providing high-fidelity vegetation mapping.',
      calc: (bands) => `(${bands.NIR} - ${bands.Red}) / (${bands.NIR} + ${bands.Red})`,
      geeCode: (bands) => `var ndvi = image.normalizedDifference(['${bands.NIR}', '${bands.Red}']).rename('NDVI');
Map.addLayer(ndvi, {min: -0.1, max: 0.85, palette: ['#78350f', '#fde047', '#15803d']}, 'NDVI');`,
      qgisFormula: (bands, layer = 'raster') => `(("${layer}@${bands.NIR}" - "${layer}@${bands.Red}") / ("${layer}@${bands.NIR}" + "${layer}@${bands.Red}"))`,
      pythonCode: (bands) => `with np.errstate(divide='ignore', invalid='ignore'):
    denom = nir_arr.astype(np.float32) + red_arr.astype(np.float32)
    ndvi = np.where(denom != 0, (nir_arr.astype(np.float32) - red_arr.astype(np.float32)) / denom, -9999.0)
    ndvi[~valid_mask] = -9999.0`
    },
    {
      id: 'savi',
      acronym: 'SAVI',
      name: 'Soil-Adjusted Vegetation Index',
      category: 'vegetation',
      featured: false,
      formulaDisplay: '((NIR - Red) / (NIR + Red + L)) * (1 + L)',
      description: 'Corrects NDVI for soil brightness influences in arid and semi-arid landscapes where vegetation cover is sparse (< 40%). Uses standard adjustment factor L = 0.5.',
      citation: 'Huete, A. R. (1988). A soil-adjusted vegetation index (SAVI). Remote Sensing of Environment, 25(3), 295-309.',
      requiredBands: ['NIR', 'Red'],
      resolutionWarning: 'Calibrate surface reflectances to 0.0 - 1.0 range prior to applying constant L = 0.5.',
      calc: (bands) => `((${bands.NIR} - ${bands.Red}) / (${bands.NIR} + ${bands.Red} + 0.5)) * 1.5`,
      geeCode: (bands) => `var savi = image.expression(
  '((NIR - RED) / (NIR + RED + 0.5)) * 1.5', {
    'NIR': image.select('${bands.NIR}'),
    'RED': image.select('${bands.Red}')
  }
).rename('SAVI');
Map.addLayer(savi, {min: -0.1, max: 0.8, palette: ['#a16207', '#fef08a', '#15803d']}, 'SAVI');`,
      qgisFormula: (bands, layer = 'raster') => `((("${layer}@${bands.NIR}" - "${layer}@${bands.Red}") / ("${layer}@${bands.NIR}" + "${layer}@${bands.Red}" + 0.5)) * 1.5)`,
      pythonCode: (bands) => `with np.errstate(divide='ignore', invalid='ignore'):
    denom = nir_arr.astype(np.float32) + red_arr.astype(np.float32) + 0.5
    savi = np.where(denom != 0, ((nir_arr.astype(np.float32) - red_arr.astype(np.float32)) / denom) * 1.5, -9999.0)`
    },
    {
      id: 'evi',
      acronym: 'EVI',
      name: 'Enhanced Vegetation Index',
      category: 'vegetation',
      featured: false,
      formulaDisplay: '2.5 * ((NIR - Red) / (NIR + 6*Red - 7.5*Blue + 1))',
      description: 'Optimized for high-biomass regions with high canopy density, reducing background soil signal and atmospheric aerosol scattering.',
      citation: 'Liu, H. Q., & Huete, A. (1995). A feedback based modification of the NDVI to minimize canopy background and atmospheric noise. IEEE TGRS.',
      requiredBands: ['NIR', 'Red', 'Blue'],
      resolutionWarning: 'Requires scaled surface reflectance between 0.0 and 1.0. For Sentinel-2, divide SR integer values by 10000.',
      calc: (bands) => `2.5 * ((${bands.NIR} - ${bands.Red}) / (${bands.NIR} + 6 * ${bands.Red} - 7.5 * ${bands.Blue} + 1))`,
      geeCode: (bands) => `var evi = image.expression(
  '2.5 * ((NIR - RED) / (NIR + 6 * RED - 7.5 * BLUE + 1))', {
    'NIR': image.select('${bands.NIR}').multiply(0.0001),
    'RED': image.select('${bands.Red}').multiply(0.0001),
    'BLUE': image.select('${bands.Blue}').multiply(0.0001)
  }
).rename('EVI');
Map.addLayer(evi, {min: 0.0, max: 0.8, palette: ['#ca8a04', '#bef264', '#166534']}, 'EVI');`,
      qgisFormula: (bands, layer = 'raster') => `(2.5 * (("${layer}@${bands.NIR}" - "${layer}@${bands.Red}") / ("${layer}@${bands.NIR}" + 6 * "${layer}@${bands.Red}" - 7.5 * "${layer}@${bands.Blue}" + 1)))`,
      pythonCode: (bands) => `with np.errstate(divide='ignore', invalid='ignore'):
    denom = nir_arr + 6.0 * red_arr - 7.5 * blue_arr + 1.0
    evi = np.where(denom != 0, 2.5 * (nir_arr - red_arr) / denom, -9999.0)`
    },
    {
      id: 'mndwi',
      acronym: 'MNDWI',
      name: 'Modified Normalized Difference Water Index',
      category: 'water',
      featured: false,
      formulaDisplay: '(Green - SWIR1) / (Green + SWIR1)',
      description: 'Designed by Xu (2006) to extract open water bodies. Replaces the NIR band used in NDWI with SWIR1 to dramatically reduce false-positive water classification over urban built-up surfaces.',
      citation: 'Xu, H. (2006). Modification of normalised difference water index (NDWI) to enhance open water features in remotely sensed imagery. IJRS, 27(14), 3025-3033.',
      requiredBands: ['Green', 'SWIR1'],
      resolutionWarning: 'Notice mathematical relationship with SUI: MNDWI is the normalized form of Green vs SWIR1, whereas SUI leverages direct difference for sensitive bare soil boundary separation.',
      calc: (bands) => `(${bands.Green} - ${bands.SWIR1}) / (${bands.Green} + ${bands.SWIR1})`,
      geeCode: (bands) => `var mndwi = image.normalizedDifference(['${bands.Green}', '${bands.SWIR1}']).rename('MNDWI');
Map.addLayer(mndwi, {min: -0.4, max: 0.4, palette: ['#f8fafc', '#93c5fd', '#1d4ed8']}, 'MNDWI');`,
      qgisFormula: (bands, layer = 'raster') => `(("${layer}@${bands.Green}" - "${layer}@${bands.SWIR1}") / ("${layer}@${bands.Green}" + "${layer}@${bands.SWIR1}"))`,
      pythonCode: (bands) => `with np.errstate(divide='ignore', invalid='ignore'):
    denom = green_arr.astype(np.float32) + swir1_arr.astype(np.float32)
    mndwi = np.where(denom != 0, (green_arr.astype(np.float32) - swir1_arr.astype(np.float32)) / denom, -9999.0)`
    },
    {
      id: 'ndwi',
      acronym: 'NDWI',
      name: 'Normalized Difference Water Index',
      category: 'water',
      featured: false,
      formulaDisplay: '(Green - NIR) / (Green + NIR)',
      description: 'McFeeters (1996) index developed to delineate open surface water bodies from terrestrial vegetation and soil.',
      citation: 'McFeeters, S. K. (1996). The use of the Normalized Difference Water Index (NDWI) in the delineation of open water features. IJRS, 17(7), 1425-1432.',
      requiredBands: ['Green', 'NIR'],
      resolutionWarning: 'For Sentinel-2, Green (B3) and NIR (B8) are both native 10m bands.',
      calc: (bands) => `(${bands.Green} - ${bands.NIR}) / (${bands.Green} + ${bands.NIR})`,
      geeCode: (bands) => `var ndwi = image.normalizedDifference(['${bands.Green}', '${bands.NIR}']).rename('NDWI');
Map.addLayer(ndwi, {min: -0.5, max: 0.5, palette: ['#92400e', '#f8fafc', '#0284c7']}, 'NDWI');`,
      qgisFormula: (bands, layer = 'raster') => `(("${layer}@${bands.Green}" - "${layer}@${bands.NIR}") / ("${layer}@${bands.Green}" + "${layer}@${bands.NIR}"))`,
      pythonCode: (bands) => `with np.errstate(divide='ignore', invalid='ignore'):
    denom = green_arr.astype(np.float32) + nir_arr.astype(np.float32)
    ndwi = np.where(denom != 0, (green_arr.astype(np.float32) - nir_arr.astype(np.float32)) / denom, -9999.0)`
    },
    {
      id: 'nbr',
      acronym: 'NBR',
      name: 'Normalized Burn Ratio',
      category: 'burn',
      featured: false,
      formulaDisplay: '(NIR - SWIR2) / (NIR + SWIR2)',
      description: 'Standard index for mapping wildfire burn scars and evaluating post-fire burn severity through dNBR (pre-fire NBR - post-fire NBR).',
      citation: 'Key, C. H., & Benson, N. C. (2006). Landscape Assessment: Ground measure of severity, the Composite Burn Index; and Remote sensing of severity, the Normalized Burn Ratio. USDA Forest Service.',
      requiredBands: ['NIR', 'SWIR2'],
      resolutionWarning: 'Sentinel-2 SWIR2 is 20m. Resample to 10m to match NIR B8.',
      calc: (bands) => `(${bands.NIR} - ${bands.SWIR2}) / (${bands.NIR} + ${bands.SWIR2})`,
      geeCode: (bands) => `var nbr = image.normalizedDifference(['${bands.NIR}', '${bands.SWIR2}']).rename('NBR');
Map.addLayer(nbr, {min: -0.4, max: 0.7, palette: ['#7f1d1d', '#f97316', '#22c55e']}, 'NBR');`,
      qgisFormula: (bands, layer = 'raster') => `(("${layer}@${bands.NIR}" - "${layer}@${bands.SWIR2}") / ("${layer}@${bands.NIR}" + "${layer}@${bands.SWIR2}"))`,
      pythonCode: (bands) => `with np.errstate(divide='ignore', invalid='ignore'):
    denom = nir_arr.astype(np.float32) + swir2_arr.astype(np.float32)
    nbr = np.where(denom != 0, (nir_arr.astype(np.float32) - swir2_arr.astype(np.float32)) / denom, -9999.0)`
    },
    {
      id: 'bsi',
      acronym: 'BSI',
      name: 'Bare Soil Index',
      category: 'burn',
      featured: false,
      formulaDisplay: '((SWIR1 + Red) - (NIR + Blue)) / ((SWIR1 + Red) + (NIR + Blue))',
      description: 'Identifies bare soil, fallow agricultural fields, and exposed bedrock by combining shortwave infrared and red absorption with blue and NIR reflectance.',
      citation: 'Rikimaru, A. et al. (2002). Tropical forest cover density mapping. New guidelines for landsat imagery. GIS Development.',
      requiredBands: ['SWIR1', 'Red', 'NIR', 'Blue'],
      resolutionWarning: 'Requires four separate bands. On Sentinel-2, SWIR1 is 20m while Blue, Red, and NIR are 10m.',
      calc: (bands) => `((${bands.SWIR1} + ${bands.Red}) - (${bands.NIR} + ${bands.Blue})) / ((${bands.SWIR1} + ${bands.Red}) + (${bands.NIR} + ${bands.Blue}))`,
      geeCode: (bands) => `var bsi = image.expression(
  '((SWIR1 + RED) - (NIR + BLUE)) / ((SWIR1 + RED) + (NIR + BLUE))', {
    'SWIR1': image.select('${bands.SWIR1}'),
    'RED': image.select('${bands.Red}'),
    'NIR': image.select('${bands.NIR}'),
    'BLUE': image.select('${bands.Blue}')
  }
).rename('BSI');
Map.addLayer(bsi, {min: -0.3, max: 0.4, palette: ['#15803d', '#fef08a', '#9a3412']}, 'BSI');`,
      qgisFormula: (bands, layer = 'raster') => `(((("${layer}@${bands.SWIR1}" + "${layer}@${bands.Red}") - ("${layer}@${bands.NIR}" + "${layer}@${bands.Blue}")) / (("${layer}@${bands.SWIR1}" + "${layer}@${bands.Red}") + ("${layer}@${bands.NIR}" + "${layer}@${bands.Blue}"))))`,
      pythonCode: (bands) => `with np.errstate(divide='ignore', invalid='ignore'):
    num = (swir1_arr + red_arr) - (nir_arr + blue_arr)
    denom = (swir1_arr + red_arr) + (nir_arr + blue_arr)
    bsi = np.where(denom != 0, num / denom, -9999.0)`
    }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = RS_DATA;
}

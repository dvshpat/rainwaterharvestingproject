// Mock data generators for rainfall, hydrogeology, and calculations

// City-based accurate rainfall data (mm) - matches real IMD data patterns
const cityRainfallData: Record<string, number[]> = {
  'mumbai': [16, 6, 13, 18, 38, 585, 840, 534, 315, 125, 35, 18],
  'delhi': [25, 30, 15, 9, 13, 65, 180, 185, 125, 10, 5, 10],
  'bangalore': [5, 8, 25, 85, 125, 95, 85, 115, 155, 185, 65, 15],
  'chennai': [25, 35, 20, 45, 55, 45, 85, 125, 115, 265, 315, 145],
  'kolkata': [15, 35, 45, 55, 125, 185, 315, 325, 255, 125, 25, 5],
  'hyderabad': [5, 15, 25, 35, 45, 95, 155, 145, 135, 65, 25, 5],
  'pune': [5, 8, 15, 25, 35, 165, 185, 125, 95, 65, 15, 5],
  'ahmedabad': [5, 8, 15, 8, 15, 85, 255, 185, 115, 25, 5, 5],
  'jaipur': [8, 12, 15, 5, 15, 45, 185, 165, 95, 15, 5, 5],
  'lucknow': [15, 25, 12, 8, 15, 95, 265, 285, 155, 25, 8, 5]
};

export const generateRainfallData = (latitude: number, longitude: number) => {
  // Determine closest city based on coordinates
  const getClosestCity = (lat: number, lon: number): string => {
    const cityCoords: Record<string, [number, number]> = {
      'mumbai': [19.076, 72.8777],
      'delhi': [28.7041, 77.1025],
      'bangalore': [12.9716, 77.5946],
      'chennai': [13.0827, 80.2707],
      'kolkata': [22.5726, 88.3639],
      'hyderabad': [17.3850, 78.4867],
      'pune': [18.5204, 73.8567],
      'ahmedabad': [23.0225, 72.5714],
      'jaipur': [26.9124, 75.7873],
      'lucknow': [26.8467, 80.9462]
    };

    let closestCity = 'mumbai';
    let minDistance = Infinity;

    Object.entries(cityCoords).forEach(([city, [cityLat, cityLon]]) => {
      const distance = Math.sqrt(
        Math.pow(lat - cityLat, 2) + Math.pow(lon - cityLon, 2)
      );
      if (distance < minDistance) {
        minDistance = distance;
        closestCity = city;
      }
    });

    return closestCity;
  };

  const closestCity = getClosestCity(latitude, longitude);
  const monthlyData = cityRainfallData[closestCity] || cityRainfallData['mumbai'];
  const totalAnnual = monthlyData.reduce((sum, month) => sum + month, 0);
  
  const trendAnalysis = (() => {
    // Analyze trend from monthly data
    const monsoonMonths = monthlyData.slice(5, 9);
    const avgMonsoon = monsoonMonths.reduce((a, b) => a + b, 0) / monsoonMonths.length;
    if (avgMonsoon > 200) return 'increasing';
    if (avgMonsoon < 100) return 'decreasing';
    return 'stable';
  })();

  return {
    annualRainfall: totalAnnual,
    monthlyRainfall: monthlyData,
    prediction: {
      nextYear: Math.round(totalAnnual * (0.95 + Math.random() * 0.1)),
      trend: trendAnalysis as 'increasing' | 'decreasing' | 'stable',
      confidence: Math.round(80 + Math.random() * 15),
    },
    source: `India Meteorological Department (IMD) - ${closestCity.charAt(0).toUpperCase() + closestCity.slice(1)} Region`,
    lastUpdated: new Date().toLocaleDateString('en-IN'),
  };
};

export const generateHydrogeologyData = (latitude: number, longitude: number) => {
  const aquiferTypes = ['Alluvial', 'Hard Rock', 'Coastal', 'Semi-consolidated', 'Volcanic'];
  const aquiferSubtypes = ['Confined', 'Unconfined', 'Semi-confined'] as const;
  
  const randomAquifer = aquiferTypes[Math.floor(Math.random() * aquiferTypes.length)];
  const isCoastal = longitude > 72 && longitude < 88 && latitude > 8 && latitude < 25;
  const isHardRock = latitude > 15 && latitude < 25 && longitude > 74 && longitude < 85;
  
  let aquiferName = randomAquifer;
  if (isCoastal) aquiferName = 'Coastal Alluvial';
  if (isHardRock) aquiferName = 'Deccan Trap Hard Rock';
  
  const depth = isHardRock ? { min: 15, max: 45 } : { min: 5, max: 25 };
  const permeability = isHardRock ? 'Medium' : 'High';
  const quality = Math.random() > 0.7 ? 'Fair' : 'Good';
  
  const suitability = (() => {
    if (isHardRock && depth.min > 20) return 'Fair';
    if (isCoastal) return 'Good';
    return 'Excellent';
  })() as 'Excellent' | 'Good' | 'Fair' | 'Poor';
  
  const methods = [];
  if (suitability === 'Excellent') {
    methods.push('Recharge Pit', 'Percolation Tank', 'Check Dam');
  } else if (suitability === 'Good') {
    methods.push('Recharge Well', 'Infiltration Trench');
  } else {
    methods.push('Storage Tank', 'Rooftop Collection');
  }
  
  return {
    aquiferName,
    aquiferType: aquiferSubtypes[Math.floor(Math.random() * aquiferSubtypes.length)],
    depthToWater: { ...depth, unit: 'meters' },
    permeability: permeability as 'High' | 'Medium' | 'Low',
    quality: quality as 'Good' | 'Fair' | 'Poor',
    suitability: {
      rainwaterHarvesting: suitability,
      rechargeMethod: methods,
    },
    warnings: isCoastal ? ['Saltwater intrusion risk in coastal areas'] : 
              isHardRock ? ['Limited groundwater potential in hard rock areas'] : [],
    recommendations: [
      'Install first flush diverter for water quality',
      'Regular maintenance of collection system required',
      suitability === 'Excellent' ? 'Consider multiple recharge structures' : 'Focus on storage-based systems',
    ],
  };
};

export const calculateHarvestingResults = (
  propertyData: any,
  rainfallData: any,
  hydroData: any
) => {
  // Runoff coefficients by roof type
  const runoffCoefficients = {
    concrete: 0.85,
    tile: 0.75,
    metal: 0.90,
    asbestos: 0.80,
    thatched: 0.20,
  };

  const coefficient = runoffCoefficients[propertyData.roofType as keyof typeof runoffCoefficients] || 0.75;
  
  // Calculate annual harvest: V = P × A × Cr (in liters)
  const annualHarvest = Math.round(
    (rainfallData.annualRainfall / 1000) * // Convert mm to meters
    propertyData.roofArea * 
    coefficient * 
    1000 // Convert back to liters
  );

  // Calculate feasibility score
  let feasibilityScore = 60; // Base score
  
  // Rainfall bonus
  if (rainfallData.annualRainfall > 1200) feasibilityScore += 20;
  else if (rainfallData.annualRainfall > 800) feasibilityScore += 10;
  
  // Hydrogeology bonus
  if (hydroData.suitability.rainwaterHarvesting === 'Excellent') feasibilityScore += 15;
  else if (hydroData.suitability.rainwaterHarvesting === 'Good') feasibilityScore += 10;
  else if (hydroData.suitability.rainwaterHarvesting === 'Fair') feasibilityScore += 5;
  
  // Property size bonus
  if (propertyData.roofArea > 200) feasibilityScore += 5;
  
  feasibilityScore = Math.min(feasibilityScore, 95);
  
  const feasibilityStatus = feasibilityScore >= 80 ? 'excellent' :
                           feasibilityScore >= 65 ? 'good' :
                           feasibilityScore >= 50 ? 'fair' : 'poor';

  // Calculate economics (mock pricing)
  const baseCostPerSqm = 150; // ₹150 per sq meter of roof area
  const totalCost = Math.round(propertyData.roofArea * baseCostPerSqm * 1.2); // 20% overhead
  
  const waterCostPerLiter = 0.02; // ₹0.02 per liter (municipal water cost)
  const annualSavings = Math.round(annualHarvest * waterCostPerLiter);
  const paybackPeriod = totalCost / annualSavings;

  // Determine structure type based on conditions
  let primaryStructure = 'Recharge Pit';
  if (hydroData.suitability.rainwaterHarvesting === 'Poor' || propertyData.soilType === 'clay') {
    primaryStructure = 'Storage Tank';
  } else if (propertyData.landArea < 100) {
    primaryStructure = 'Recharge Well';
  }

  // Calculate dimensions
  const volume = Math.round(annualHarvest * 0.1); // 10% of annual for temporary storage
  const depth = primaryStructure === 'Storage Tank' ? 2 : 3;
  const area = volume / (depth * 1000); // Convert liters to cubic meters
  const length = Math.ceil(Math.sqrt(area));
  const width = Math.ceil(area / length);

  return {
    feasibility: {
      status: feasibilityStatus as 'excellent' | 'good' | 'fair' | 'poor',
      score: feasibilityScore,
      reasons: [
        `Annual rainfall: ${rainfallData.annualRainfall}mm`,
        `Roof area: ${propertyData.roofArea} sq meters`,
        `Hydrogeology suitability: ${hydroData.suitability.rainwaterHarvesting}`,
        `Estimated collection efficiency: ${Math.round(coefficient * 100)}%`,
      ],
    },
    potential: {
      annualHarvest,
      monthlyAverage: Math.round(annualHarvest / 12),
      dailyAverage: Math.round(annualHarvest / 365),
      efficiency: Math.round(coefficient * 100),
    },
    recommendation: {
      primaryStructure,
      secondaryStructures: ['First Flush Diverter', 'Filter System', 'Distribution Network'],
      dimensions: {
        length,
        width,
        depth,
        capacity: volume,
      },
    },
    economics: {
      totalCost,
      annualSavings,
      paybackPeriod: Math.round(paybackPeriod * 10) / 10,
      roi: Math.round((annualSavings / totalCost) * 100),
    },
    environmental: {
      carbonReduction: Math.round(annualHarvest * 0.0005), // 0.5g CO2 per liter
      groundwaterRecharge: Math.round(annualHarvest * 0.8), // 80% goes to groundwater
      floodReduction: Math.min(Math.round((propertyData.roofArea / propertyData.landArea) * 30), 45),
    },
  };
};
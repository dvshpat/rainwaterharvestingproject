// Mock data generators for rainfall, hydrogeology, and calculations

export const generateRainfallData = (latitude: number, longitude: number) => {
  // Simulate rainfall data based on coordinates
  const baseRainfall = 800 + Math.sin(latitude * 0.1) * 400 + Math.cos(longitude * 0.05) * 200;
  
  const monthlyData = Array.from({ length: 12 }, (_, i) => {
    const monsoonFactor = i >= 5 && i <= 8 ? 2.5 : 0.3; // Monsoon months
    return Math.round(baseRainfall * monsoonFactor * (0.8 + Math.random() * 0.4) / 12);
  });

  const totalAnnual = monthlyData.reduce((sum, month) => sum + month, 0);
  
  return {
    annualRainfall: totalAnnual,
    monthlyRainfall: monthlyData,
    prediction: {
      nextYear: Math.round(totalAnnual * (0.95 + Math.random() * 0.1)),
      trend: Math.random() > 0.6 ? 'increasing' : Math.random() > 0.3 ? 'stable' : 'decreasing' as const,
      confidence: Math.round(75 + Math.random() * 20),
    },
    source: "India Meteorological Department (IMD)",
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
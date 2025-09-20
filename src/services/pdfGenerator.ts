import jsPDF from 'jspdf';

interface ReportData {
  location: {
    address: string;
    latitude: number;
    longitude: number;
    district: string;
  };
  property: {
    name: string;
    dwellers: number;
    roofArea: number;
    roofType: string;
    soilType: string;
    monthlyWaterConsumption: number;
    budget: number;
  };
  results: {
    feasibility: {
      score: number;
      status: string;
      reason: string;
    };
    potential: {
      annualHarvest: number;
      monthlyAverage: number;
      peakMonthHarvest: number;
      efficiency: number;
    };
    structure: {
      type: string;
      capacity: number;
      dimensions: { length: number; width: number; depth: number };
      materials: string[];
    };
    economics: {
      totalCost: number;
      costPerLiter: number;
      paybackPeriod: number;
      annualSavings: number;
    };
    environmental: {
      co2Reduction: number;
      groundwaterRecharge: number;
      sustainabilityScore: number;
    };
  };
}

export const generatePDFReport = async (data: ReportData): Promise<void> => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  
  // Colors
  const primaryColor = '#2563eb';
  const secondaryColor = '#64748b';
  const accentColor = '#059669';
  
  // Header
  pdf.setFillColor(37, 99, 235); // Primary blue
  pdf.rect(0, 0, pageWidth, 40, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont('helvetica', 'bold');
  pdf.text('RAINWATER HARVESTING ANALYSIS REPORT', pageWidth / 2, 25, { align: 'center' });
  
  // Reset color
  pdf.setTextColor(0, 0, 0);
  
  let yPosition = 55;
  
  // Location Information
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('📍 LOCATION DETAILS', 20, yPosition);
  yPosition += 10;
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Address: ${data.location.address}`, 20, yPosition);
  yPosition += 5;
  pdf.text(`Coordinates: ${data.location.latitude.toFixed(4)}°N, ${data.location.longitude.toFixed(4)}°E`, 20, yPosition);
  yPosition += 5;
  pdf.text(`District: ${data.location.district}`, 20, yPosition);
  yPosition += 15;
  
  // Property Information
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('🏠 PROPERTY INFORMATION', 20, yPosition);
  yPosition += 10;
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Owner: ${data.property.name}`, 20, yPosition);
  yPosition += 5;
  pdf.text(`Residents: ${data.property.dwellers} people`, 20, yPosition);
  yPosition += 5;
  pdf.text(`Roof Area: ${data.property.roofArea} sq.m (${data.property.roofType})`, 20, yPosition);
  yPosition += 5;
  pdf.text(`Soil Type: ${data.property.soilType}`, 20, yPosition);
  yPosition += 5;
  pdf.text(`Monthly Water Consumption: ${data.property.monthlyWaterConsumption.toLocaleString()} L`, 20, yPosition);
  yPosition += 5;
  pdf.text(`Available Budget: ₹${data.property.budget.toLocaleString()}`, 20, yPosition);
  yPosition += 15;
  
  // Feasibility Assessment
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('✅ FEASIBILITY ASSESSMENT', 20, yPosition);
  yPosition += 10;
  
  // Feasibility status box
  const statusColor = data.results.feasibility.score >= 70 ? [5, 150, 105] : 
                     data.results.feasibility.score >= 50 ? [245, 158, 11] : [239, 68, 68];
  pdf.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
  pdf.roundedRect(20, yPosition - 5, 60, 12, 2, 2, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text(`${data.results.feasibility.status}`, 50, yPosition + 2, { align: 'center' });
  
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Score: ${data.results.feasibility.score}%`, 90, yPosition + 2);
  yPosition += 15;
  
  pdf.text(`Assessment: ${data.results.feasibility.reason}`, 20, yPosition);
  yPosition += 15;
  
  // Harvesting Potential
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('💧 HARVESTING POTENTIAL', 20, yPosition);
  yPosition += 10;
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Annual Harvest Potential: ${data.results.potential.annualHarvest.toLocaleString()} liters`, 20, yPosition);
  yPosition += 5;
  pdf.text(`Monthly Average: ${data.results.potential.monthlyAverage.toLocaleString()} liters`, 20, yPosition);
  yPosition += 5;
  pdf.text(`Peak Month Harvest: ${data.results.potential.peakMonthHarvest.toLocaleString()} liters`, 20, yPosition);
  yPosition += 5;
  pdf.text(`System Efficiency: ${data.results.potential.efficiency}%`, 20, yPosition);
  yPosition += 15;
  
  // Recommended Structure
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('🏗️ RECOMMENDED STRUCTURE', 20, yPosition);
  yPosition += 10;
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Structure Type: ${data.results.structure.type}`, 20, yPosition);
  yPosition += 5;
  pdf.text(`Capacity: ${data.results.structure.capacity.toLocaleString()} liters`, 20, yPosition);
  yPosition += 5;
  pdf.text(`Dimensions: ${data.results.structure.dimensions.length}m × ${data.results.structure.dimensions.width}m × ${data.results.structure.dimensions.depth}m`, 20, yPosition);
  yPosition += 5;
  pdf.text(`Materials: ${data.results.structure.materials.join(', ')}`, 20, yPosition);
  yPosition += 15;
  
  // Economic Analysis
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('💰 ECONOMIC ANALYSIS', 20, yPosition);
  yPosition += 10;
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Total Implementation Cost: ₹${data.results.economics.totalCost.toLocaleString()}`, 20, yPosition);
  yPosition += 5;
  pdf.text(`Cost Per Liter: ₹${data.results.economics.costPerLiter.toFixed(2)}`, 20, yPosition);
  yPosition += 5;
  pdf.text(`Payback Period: ${data.results.economics.paybackPeriod.toFixed(1)} years`, 20, yPosition);
  yPosition += 5;
  pdf.text(`Annual Water Bill Savings: ₹${data.results.economics.annualSavings.toLocaleString()}`, 20, yPosition);
  yPosition += 15;
  
  // Environmental Impact
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('🌱 ENVIRONMENTAL IMPACT', 20, yPosition);
  yPosition += 10;
  
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Annual CO₂ Reduction: ${data.results.environmental.co2Reduction} kg`, 20, yPosition);
  yPosition += 5;
  pdf.text(`Groundwater Recharge: ${data.results.environmental.groundwaterRecharge.toLocaleString()} L/year`, 20, yPosition);
  yPosition += 5;
  pdf.text(`Sustainability Score: ${data.results.environmental.sustainabilityScore}%`, 20, yPosition);
  yPosition += 20;
  
  // Footer
  pdf.setFillColor(248, 250, 252);
  pdf.rect(0, pageHeight - 30, pageWidth, 30, 'F');
  
  pdf.setFontSize(8);
  pdf.setTextColor(100, 116, 139);
  pdf.text('Generated by Smart India Hackathon 2024 - Rainwater Harvesting Calculator', pageWidth / 2, pageHeight - 20, { align: 'center' });
  pdf.text(`Report generated on: ${new Date().toLocaleDateString('en-IN')}`, pageWidth / 2, pageHeight - 15, { align: 'center' });
  pdf.text('Data sources: IMD, CGWB, NAQUIM | Calculations based on IS 15797:2008 standards', pageWidth / 2, pageHeight - 10, { align: 'center' });
  
  // Save the PDF
  const fileName = `RWH_Analysis_${data.property.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(fileName);
};
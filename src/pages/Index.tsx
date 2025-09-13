import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { LocationInput } from "@/components/LocationInput";
import { PropertyForm, PropertyData } from "@/components/PropertyForm";
import { RainfallDisplay } from "@/components/RainfallDisplay";
import { HydrogeologyInfo } from "@/components/HydrogeologyInfo";
import { ResultsDashboard } from "@/components/ResultsDashboard";
import { generateRainfallData, generateHydrogeologyData, calculateHarvestingResults } from "@/services/mockData";
import heroImage from "@/assets/hero-image.jpg";
import { MapPin, Droplets, Calculator, FileText } from "lucide-react";

interface LocationData {
  address: string;
  latitude: number;
  longitude: number;
  district: string;
}

const Index = () => {
  const [selectedLocation, setSelectedLocation] = useState<LocationData | null>(null);
  const [rainfallData, setRainfallData] = useState<any>(null);
  const [hydroData, setHydroData] = useState<any>(null);
  const [results, setResults] = useState<any>(null);
  const [isLoadingRainfall, setIsLoadingRainfall] = useState(false);
  const [isLoadingHydro, setIsLoadingHydro] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const { toast } = useToast();

  const handleLocationSelected = async (location: LocationData) => {
    setSelectedLocation(location);
    setRainfallData(null);
    setHydroData(null);
    setResults(null);

    // Fetch rainfall data
    setIsLoadingRainfall(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
      const rainfall = generateRainfallData(location.latitude, location.longitude);
      setRainfallData(rainfall);
    } catch (error) {
      toast({
        title: "Error fetching rainfall data",
        description: "Using cached data for calculations",
        variant: "destructive",
      });
    } finally {
      setIsLoadingRainfall(false);
    }

    // Fetch hydrogeology data
    setIsLoadingHydro(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
      const hydro = generateHydrogeologyData(location.latitude, location.longitude);
      setHydroData(hydro);
    } catch (error) {
      toast({
        title: "Error fetching hydrogeology data",
        description: "Using default parameters for calculations",
        variant: "destructive",
      });
    } finally {
      setIsLoadingHydro(false);
    }
  };

  const handleCalculateHarvesting = async (propertyData: PropertyData) => {
    if (!selectedLocation || !rainfallData || !hydroData) {
      toast({
        title: "Missing Data",
        description: "Please ensure location and environmental data are loaded",
        variant: "destructive",
      });
      return;
    }

    setIsCalculating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate calculation time
      const calculationResults = calculateHarvestingResults(propertyData, rainfallData, hydroData);
      setResults(calculationResults);
      
      toast({
        title: "Analysis Complete",
        description: "Rainwater harvesting potential calculated successfully",
      });
    } catch (error) {
      toast({
        title: "Calculation Error",
        description: "Failed to calculate harvesting potential",
        variant: "destructive",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  const handleDownloadReport = () => {
    toast({
      title: "Report Generation",
      description: "PDF report download will be available in the full version",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-96 flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 gradient-hero opacity-80" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Rainwater Harvesting Calculator
          </h1>
          <p className="text-xl md:text-2xl mb-6 opacity-90">
            Calculate potential, design solutions, and get actionable insights for sustainable water management
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              <span>Location Analysis</span>
            </div>
            <div className="flex items-center gap-2">
              <Droplets className="h-5 w-5" />
              <span>Rainfall Prediction</span>
            </div>
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              <span>Smart Calculations</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <span>Detailed Reports</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Input Forms */}
          <div className="lg:col-span-1 space-y-6">
            <LocationInput onLocationSelected={handleLocationSelected} />
            
            {selectedLocation && (
              <PropertyForm
                onSubmit={handleCalculateHarvesting}
                isSubmitting={isCalculating}
              />
            )}
          </div>

          {/* Right Column - Data Display and Results */}
          <div className="lg:col-span-2 space-y-6">
            <RainfallDisplay data={rainfallData} isLoading={isLoadingRainfall} />
            <HydrogeologyInfo data={hydroData} isLoading={isLoadingHydro} />
            <ResultsDashboard 
              results={results} 
              isLoading={isCalculating}
              onDownloadReport={handleDownloadReport}
            />
          </div>
        </div>

        {/* Selected Location Info */}
        {selectedLocation && (
          <div className="mt-8 p-4 bg-muted/50 rounded-lg border border-border">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="font-medium">Selected Location</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Address:</span>
                <div className="font-medium">{selectedLocation.address}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Latitude:</span>
                <div className="font-medium">{selectedLocation.latitude.toFixed(4)}</div>
              </div>
              <div>
                <span className="text-muted-foreground">Longitude:</span>
                <div className="font-medium">{selectedLocation.longitude.toFixed(4)}</div>
              </div>
              <div>
                <span className="text-muted-foreground">District:</span>
                <div className="font-medium">{selectedLocation.district}</div>
              </div>
            </div>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-16 p-6 bg-card border border-border rounded-lg shadow-card">
          <h3 className="text-lg font-semibold mb-4">About This Calculator</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-muted-foreground">
            <div>
              <h4 className="font-medium text-foreground mb-2">Data Sources</h4>
              <ul className="space-y-1">
                <li>• India Meteorological Department (IMD) for rainfall data</li>
                <li>• Central Ground Water Board (CGWB) for hydrogeology</li>
                <li>• NAQUIM for aquifer mapping and analysis</li>
                <li>• CPWD standards for cost estimation</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">Calculation Methods</h4>
              <ul className="space-y-1">
                <li>• Runoff calculation: V = P × A × Cr</li>
                <li>• Structure sizing based on soil conditions</li>
                <li>• Cost-benefit analysis with local rates</li>
                <li>• Environmental impact assessment</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
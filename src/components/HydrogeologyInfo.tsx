import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layers, AlertTriangle, CheckCircle } from "lucide-react";

interface AquiferData {
  aquiferName: string;
  aquiferType: 'Confined' | 'Unconfined' | 'Semi-confined';
  depthToWater: {
    min: number;
    max: number;
    unit: string;
  };
  permeability: 'High' | 'Medium' | 'Low';
  quality: 'Good' | 'Fair' | 'Poor';
  suitability: {
    rainwaterHarvesting: 'Excellent' | 'Good' | 'Fair' | 'Poor';
    rechargeMethod: string[];
  };
  warnings: string[];
  recommendations: string[];
}

interface HydrogeologyInfoProps {
  data: AquiferData | null;
  isLoading: boolean;
}

export const HydrogeologyInfo = ({ data, isLoading }: HydrogeologyInfoProps) => {
  if (isLoading) {
    return (
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary animate-pulse" />
            Analyzing Hydrogeology...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="shadow-card opacity-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5 text-muted-foreground" />
            Hydrogeology Analysis
          </CardTitle>
          <CardDescription>
            Location data needed to analyze groundwater conditions
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const getSuitabilityColor = (suitability: string) => {
    switch (suitability.toLowerCase()) {
      case 'excellent': return 'success';
      case 'good': return 'success';
      case 'fair': return 'warning';
      case 'poor': return 'destructive';
      default: return 'secondary';
    }
  };

  const getQualityColor = (quality: string) => {
    switch (quality.toLowerCase()) {
      case 'good': return 'success';
      case 'fair': return 'warning';
      case 'poor': return 'destructive';
      default: return 'secondary';
    }
  };

  return (
    <Card className="shadow-card transition-smooth">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-primary" />
          Hydrogeology & Groundwater Analysis
        </CardTitle>
        <CardDescription>
          Based on CGWB and NAQUIM data
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Aquifer Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Aquifer Name</label>
              <div className="font-semibold">{data.aquiferName}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Aquifer Type</label>
              <div className="font-semibold">{data.aquiferType}</div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Permeability</label>
              <Badge variant={data.permeability === 'High' ? 'default' : data.permeability === 'Medium' ? 'secondary' : 'outline'}>
                {data.permeability}
              </Badge>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Depth to Water</label>
              <div className="font-semibold">
                {data.depthToWater.min} - {data.depthToWater.max} {data.depthToWater.unit}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Water Quality</label>
              <Badge variant={getQualityColor(data.quality) as any}>
                {data.quality}
              </Badge>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">RWH Suitability</label>
              <Badge variant={getSuitabilityColor(data.suitability.rainwaterHarvesting) as any}>
                {data.suitability.rainwaterHarvesting}
              </Badge>
            </div>
          </div>
        </div>

        {/* Recommended Recharge Methods */}
        <div>
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-success" />
            Recommended Recharge Methods
          </h4>
          <div className="flex flex-wrap gap-2">
            {data.suitability.rechargeMethod.map((method, index) => (
              <Badge key={index} variant="outline" className="bg-success/10 border-success/20">
                {method}
              </Badge>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        {data.recommendations.length > 0 && (
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-primary" />
              Recommendations
            </h4>
            <ul className="space-y-1">
              {data.recommendations.map((recommendation, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  {recommendation}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Warnings */}
        {data.warnings.length > 0 && (
          <div className="p-4 bg-warning/10 border border-warning/20 rounded-lg">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-warning" />
              Important Considerations
            </h4>
            <ul className="space-y-1">
              {data.warnings.map((warning, index) => (
                <li key={index} className="text-sm text-warning-foreground flex items-start gap-2">
                  <span className="text-warning mt-1">⚠</span>
                  {warning}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
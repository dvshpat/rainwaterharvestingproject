import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Droplets, 
  Calculator, 
  TrendingUp, 
  Download, 
  CheckCircle, 
  AlertCircle,
  IndianRupee,
  Calendar
} from "lucide-react";

export interface HarvestingResults {
  feasibility: {
    status: 'excellent' | 'good' | 'fair' | 'poor';
    score: number;
    reasons: string[];
  };
  potential: {
    annualHarvest: number; // liters
    monthlyAverage: number; // liters
    dailyAverage: number; // liters
    efficiency: number; // percentage
  };
  recommendation: {
    primaryStructure: string;
    secondaryStructures: string[];
    dimensions: {
      length: number;
      width: number;
      depth: number;
      capacity: number;
    };
  };
  economics: {
    totalCost: number;
    annualSavings: number;
    paybackPeriod: number; // years
    roi: number; // percentage
  };
  environmental: {
    carbonReduction: number; // kg CO2/year
    groundwaterRecharge: number; // liters/year
    floodReduction: number; // percentage
  };
}

interface ResultsDashboardProps {
  results: HarvestingResults | null;
  isLoading: boolean;
  onDownloadReport: () => void;
}

export const ResultsDashboard = ({ results, isLoading, onDownloadReport }: ResultsDashboardProps) => {
  if (isLoading) {
    return (
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary animate-pulse" />
            Calculating Rainwater Harvesting Potential...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
            <div className="text-center text-muted-foreground">
              Analyzing rainfall data, soil conditions, and calculating optimal solutions...
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!results) {
    return (
      <Card className="shadow-card opacity-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-muted-foreground" />
            Rainwater Harvesting Analysis
          </CardTitle>
          <CardDescription>
            Complete the property form to see detailed calculations and recommendations
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const getFeasibilityColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'success';
      case 'good': return 'success';
      case 'fair': return 'warning';
      case 'poor': return 'destructive';
      default: return 'secondary';
    }
  };

  const getFeasibilityIcon = (status: string) => {
    switch (status) {
      case 'excellent':
      case 'good':
        return <CheckCircle className="h-4 w-4" />;
      case 'fair':
      case 'poor':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Calculator className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Feasibility Overview */}
      <Card className="shadow-card transition-smooth">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Droplets className="h-5 w-5 text-accent" />
            Feasibility Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Badge variant={getFeasibilityColor(results.feasibility.status) as any} className="flex items-center gap-1">
                {getFeasibilityIcon(results.feasibility.status)}
                {results.feasibility.status.charAt(0).toUpperCase() + results.feasibility.status.slice(1)}
              </Badge>
              <span className="text-2xl font-bold">{results.feasibility.score}%</span>
            </div>
          </div>
          <Progress value={results.feasibility.score} className="mb-4" />
          <ul className="space-y-1 text-sm">
            {results.feasibility.reasons.map((reason, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                {reason}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Water Harvesting Potential */}
      <Card className="shadow-card transition-smooth">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-primary" />
            Water Harvesting Potential
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 bg-gradient-accent/10 rounded-lg">
              <div className="text-2xl font-bold text-primary">{results.potential.annualHarvest.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Liters/Year</div>
            </div>
            <div className="text-center p-4 bg-gradient-accent/10 rounded-lg">
              <div className="text-2xl font-bold text-accent">{results.potential.monthlyAverage.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Liters/Month</div>
            </div>
            <div className="text-center p-4 bg-gradient-accent/10 rounded-lg">
              <div className="text-2xl font-bold text-success">{results.potential.dailyAverage}</div>
              <div className="text-sm text-muted-foreground">Liters/Day</div>
            </div>
            <div className="text-center p-4 bg-gradient-accent/10 rounded-lg">
              <div className="text-2xl font-bold">{results.potential.efficiency}%</div>
              <div className="text-sm text-muted-foreground">Efficiency</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommended Solution */}
      <Card className="shadow-card transition-smooth">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-success" />
            Recommended Solution
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold mb-2">Primary Structure: {results.recommendation.primaryStructure}</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg">
              <div>
                <div className="text-sm text-muted-foreground">Length</div>
                <div className="font-semibold">{results.recommendation.dimensions.length}m</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Width</div>
                <div className="font-semibold">{results.recommendation.dimensions.width}m</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Depth</div>
                <div className="font-semibold">{results.recommendation.dimensions.depth}m</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Capacity</div>
                <div className="font-semibold">{results.recommendation.dimensions.capacity.toLocaleString()}L</div>
              </div>
            </div>
          </div>

          {results.recommendation.secondaryStructures.length > 0 && (
            <div>
              <h4 className="font-semibold mb-2">Additional Structures</h4>
              <div className="flex flex-wrap gap-2">
                {results.recommendation.secondaryStructures.map((structure, index) => (
                  <Badge key={index} variant="outline">{structure}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Economics & Environmental Impact */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-card transition-smooth">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IndianRupee className="h-5 w-5 text-success" />
              Economic Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Total Cost</div>
                <div className="text-lg font-bold">₹{results.economics.totalCost.toLocaleString()}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Annual Savings</div>
                <div className="text-lg font-bold text-success">₹{results.economics.annualSavings.toLocaleString()}</div>
              </div>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Payback Period</div>
                <div className="text-lg font-bold flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {results.economics.paybackPeriod} years
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">ROI</div>
                <div className="text-lg font-bold text-success flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  {results.economics.roi}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card transition-smooth">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-success">🌱</span>
              Environmental Impact
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground">CO₂ Reduction</div>
              <div className="text-lg font-bold text-success">{results.environmental.carbonReduction} kg/year</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Groundwater Recharge</div>
              <div className="text-lg font-bold text-accent">{results.environmental.groundwaterRecharge.toLocaleString()} L/year</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Flood Risk Reduction</div>
              <div className="text-lg font-bold">{results.environmental.floodReduction}%</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Download Report */}
      <Card className="shadow-card transition-smooth">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Detailed Technical Report</h3>
              <p className="text-sm text-muted-foreground">
                Download a comprehensive PDF report with calculations, references, and implementation guidelines
              </p>
            </div>
            <Button onClick={onDownloadReport} className="gradient-primary">
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
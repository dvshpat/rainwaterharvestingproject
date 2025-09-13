import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cloud, Droplets, TrendingUp } from "lucide-react";

interface RainfallData {
  annualRainfall: number;
  monthlyRainfall: number[];
  prediction: {
    nextYear: number;
    trend: 'increasing' | 'decreasing' | 'stable';
    confidence: number;
  };
  source: string;
  lastUpdated: string;
}

interface RainfallDisplayProps {
  data: RainfallData | null;
  isLoading: boolean;
}

export const RainfallDisplay = ({ data, isLoading }: RainfallDisplayProps) => {
  if (isLoading) {
    return (
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5 text-accent animate-pulse" />
            Fetching Rainfall Data...
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
            <Cloud className="h-5 w-5 text-muted-foreground" />
            Rainfall Analysis
          </CardTitle>
          <CardDescription>
            Select a location to view rainfall data and predictions
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'increasing': return 'success';
      case 'decreasing': return 'warning';
      default: return 'secondary';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return '↗️';
      case 'decreasing': return '↘️';
      default: return '→';
    }
  };

  return (
    <Card className="shadow-card transition-smooth">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplets className="h-5 w-5 text-accent" />
          Rainfall Analysis & Prediction
        </CardTitle>
        <CardDescription>
          Based on IMD data and historical patterns
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Year Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-primary">{data.annualRainfall}mm</div>
            <div className="text-sm text-muted-foreground">Annual Rainfall</div>
          </div>
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold text-accent">{data.prediction.nextYear}mm</div>
            <div className="text-sm text-muted-foreground">Predicted Next Year</div>
          </div>
          <div className="text-center p-4 bg-muted/50 rounded-lg">
            <div className="text-2xl font-bold">{data.prediction.confidence}%</div>
            <div className="text-sm text-muted-foreground">Confidence</div>
          </div>
        </div>

        {/* Trend Analysis */}
        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-accent/10 to-primary/10 rounded-lg">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <span className="font-medium">Rainfall Trend</span>
          </div>
          <Badge variant={getTrendColor(data.prediction.trend) as any}>
            {getTrendIcon(data.prediction.trend)} {data.prediction.trend.charAt(0).toUpperCase() + data.prediction.trend.slice(1)}
          </Badge>
        </div>

        {/* Monthly Distribution */}
        <div>
          <h4 className="font-medium mb-3">Monthly Distribution (mm)</h4>
          <div className="grid grid-cols-6 gap-2">
            {data.monthlyRainfall.map((rainfall, index) => (
              <div key={months[index]} className="text-center">
                <div 
                  className="bg-gradient-accent rounded-t mb-1 transition-smooth hover:opacity-80" 
                  style={{ 
                    height: `${Math.max(4, (rainfall / Math.max(...data.monthlyRainfall)) * 60)}px`,
                    minHeight: '4px'
                  }}
                />
                <div className="text-xs text-muted-foreground">{months[index]}</div>
                <div className="text-xs font-medium">{rainfall}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Data Source */}
        <div className="text-xs text-muted-foreground border-t pt-3">
          <div>Data Source: {data.source}</div>
          <div>Last Updated: {data.lastUpdated}</div>
        </div>
      </CardContent>
    </Card>
  );
};
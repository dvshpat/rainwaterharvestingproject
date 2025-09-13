import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cloud, Droplets, TrendingUp } from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

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

        {/* Monthly Distribution Chart */}
        <div>
          <h4 className="font-medium mb-3">Monthly Distribution (mm)</h4>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.monthlyRainfall.map((rainfall, index) => ({
                month: months[index],
                rainfall,
                trend: index > 0 ? rainfall - data.monthlyRainfall[index - 1] : 0
              }))}>
                <defs>
                  <linearGradient id="rainfallGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted-foreground))" opacity={0.3} />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    color: 'hsl(var(--card-foreground))'
                  }}
                  formatter={(value: number) => [`${value}mm`, 'Rainfall']}
                />
                <Area
                  type="monotone"
                  dataKey="rainfall"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  fill="url(#rainfallGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
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
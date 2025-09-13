import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Home, Users, Calculator } from "lucide-react";

export interface PropertyData {
  name: string;
  dwellers: number;
  roofArea: number;
  roofType: string;
  soilType: string;
  landArea: number;
  buildingType: string;
  additionalInfo: string;
}

interface PropertyFormProps {
  onSubmit: (data: PropertyData) => void;
  isSubmitting?: boolean;
}

export const PropertyForm = ({ onSubmit, isSubmitting = false }: PropertyFormProps) => {
  const [formData, setFormData] = useState<PropertyData>({
    name: "",
    dwellers: 4,
    roofArea: 100,
    roofType: "concrete",
    soilType: "loamy",
    landArea: 200,
    buildingType: "residential",
    additionalInfo: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const updateField = (field: keyof PropertyData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="shadow-form transition-smooth">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Home className="h-5 w-5 text-primary" />
          Property Information
        </CardTitle>
        <CardDescription>
          Provide details about your property for accurate rainwater harvesting calculations
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Property Owner Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dwellers">Number of Residents</Label>
              <div className="relative">
                <Users className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="dwellers"
                  type="number"
                  min="1"
                  max="50"
                  value={formData.dwellers}
                  onChange={(e) => updateField("dwellers", parseInt(e.target.value) || 0)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          {/* Area Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="roofArea">Roof Area (sq meters)</Label>
              <div className="relative">
                <Calculator className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="roofArea"
                  type="number"
                  min="10"
                  placeholder="100"
                  value={formData.roofArea}
                  onChange={(e) => updateField("roofArea", parseFloat(e.target.value) || 0)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="landArea">Total Land Area (sq meters)</Label>
              <div className="relative">
                <Calculator className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="landArea"
                  type="number"
                  min="50"
                  placeholder="200"
                  value={formData.landArea}
                  onChange={(e) => updateField("landArea", parseFloat(e.target.value) || 0)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          {/* Property Type & Materials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="buildingType">Building Type</Label>
              <Select value={formData.buildingType} onValueChange={(value) => updateField("buildingType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select building type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="residential">Residential House</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="commercial">Commercial Building</SelectItem>
                  <SelectItem value="institutional">Institutional</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="roofType">Roof Material</Label>
              <Select value={formData.roofType} onValueChange={(value) => updateField("roofType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select roof type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="concrete">Concrete/RCC</SelectItem>
                  <SelectItem value="tile">Clay/Concrete Tiles</SelectItem>
                  <SelectItem value="metal">Metal Sheets</SelectItem>
                  <SelectItem value="asbestos">Asbestos Sheets</SelectItem>
                  <SelectItem value="thatched">Thatched</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="soilType">Soil Type</Label>
              <Select value={formData.soilType} onValueChange={(value) => updateField("soilType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select soil type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sandy">Sandy Soil</SelectItem>
                  <SelectItem value="loamy">Loamy Soil</SelectItem>
                  <SelectItem value="clay">Clay Soil</SelectItem>
                  <SelectItem value="rocky">Rocky/Hard Soil</SelectItem>
                  <SelectItem value="mixed">Mixed Soil</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-2">
            <Label htmlFor="additionalInfo">Additional Information (Optional)</Label>
            <Textarea
              id="additionalInfo"
              placeholder="Any specific requirements, constraints, or additional details about your property..."
              value={formData.additionalInfo}
              onChange={(e) => updateField("additionalInfo", e.target.value)}
              rows={3}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full gradient-primary hover:opacity-90" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Calculating..." : "Calculate Rainwater Harvesting Potential"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
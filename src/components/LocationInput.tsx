import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface LocationData {
  address: string;
  latitude: number;
  longitude: number;
  district: string;
}

interface LocationInputProps {
  onLocationSelected: (location: LocationData) => void;
}

export const LocationInput = ({ onLocationSelected }: LocationInputProps) => {
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleGeocode = async () => {
    if (!address.trim()) {
      toast({
        title: "Address Required",
        description: "Please enter a valid address to search.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Mock geocoding service - in real app, this would call actual geocoding API
      // For demo purposes, we'll simulate with some Indian locations
      const mockLocations = {
        "mumbai": { latitude: 19.0760, longitude: 72.8777, district: "Mumbai" },
        "delhi": { latitude: 28.6139, longitude: 77.2090, district: "New Delhi" },
        "bangalore": { latitude: 12.9716, longitude: 77.5946, district: "Bangalore Urban" },
        "chennai": { latitude: 13.0827, longitude: 80.2707, district: "Chennai" },
        "pune": { latitude: 18.5204, longitude: 73.8567, district: "Pune" },
      };

      const searchKey = address.toLowerCase();
      let location = mockLocations[searchKey as keyof typeof mockLocations];
      
      if (!location) {
        // Generate approximate coordinates for any address
        location = {
          latitude: 20.5937 + (Math.random() - 0.5) * 10,
          longitude: 78.9629 + (Math.random() - 0.5) * 10,
          district: `${address} District`
        };
      }

      const locationData: LocationData = {
        address: address,
        latitude: location.latitude,
        longitude: location.longitude,
        district: location.district,
      };

      onLocationSelected(locationData);
      
      toast({
        title: "Location Found",
        description: `Coordinates: ${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`,
      });
    } catch (error) {
      toast({
        title: "Geocoding Failed",
        description: "Unable to find location. Please try a different address.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCurrentLocation = () => {
    setIsLoading(true);
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const locationData: LocationData = {
            address: "Current Location",
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            district: "Auto-detected District",
          };
          
          onLocationSelected(locationData);
          setIsLoading(false);
          
          toast({
            title: "Location Detected",
            description: `Using your current location`,
          });
        },
        (error) => {
          setIsLoading(false);
          toast({
            title: "Location Access Denied",
            description: "Please enable location access or enter address manually.",
            variant: "destructive",
          });
        }
      );
    } else {
      setIsLoading(false);
      toast({
        title: "Geolocation Not Supported",
        description: "Please enter your address manually.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="shadow-card transition-smooth">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Location Input
        </CardTitle>
        <CardDescription>
          Enter your location to get rainfall data and hydrogeology information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="address">Address or City</Label>
          <Input
            id="address"
            type="text"
            placeholder="Enter your address or city name..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleGeocode()}
          />
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={handleGeocode} 
            disabled={isLoading}
            className="flex-1"
          >
            <Search className="mr-2 h-4 w-4" />
            {isLoading ? "Searching..." : "Search Location"}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={handleCurrentLocation}
            disabled={isLoading}
          >
            <MapPin className="mr-2 h-4 w-4" />
            Use Current
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
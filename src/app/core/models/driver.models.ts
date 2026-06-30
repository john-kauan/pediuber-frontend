export interface Driver {
  id: number;
  name: string;
  vehicle: string;
  available: boolean;
}

export interface DriverAvailabilityRequest {
  available: boolean;
}

export interface DriverCurrentRideResponse {
  driverId: number;
  driverName: string;
  driverAvailable: boolean;
  hasCurrentRide: boolean;
  rideId: number | null;
  rideStatus: string | null;
  origin: string | null;
  destination: string | null;
  coreRideUuid: string | null;
}

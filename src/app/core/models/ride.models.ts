export interface LocationRequest {
  lat: number;
  lng: number;
  street: string;
  number: string;
  city: string;
  state: string;
}

export interface PassengerRideRequest {
  passengerName: string;
  origin: LocationRequest;
  destination: LocationRequest;
}

export interface PassengerRideResponse {
  localRideId: number;
  coreRideUuid: string | null;
  status: string;
  message: string;
}

export interface RideTrackingResponse {
  localRideId: number;
  coreRideUuid: string | null;
  localStatus: string;
  displayStatus: string;
  origin: string;
  destination: string;
  assignedServiceId: string;
  delegated: boolean;
  driverId: number | null;
  driverName: string | null;
  vehicle: string | null;
  etaSeconds: number | null;
  progressPercent: number;
  canStart: boolean;
  canComplete: boolean;
}

export interface RideHistoryResponse {
  id: number;
  coreRideUuid: string | null;
  status: string;
  origin: string;
  destination: string;
  driverName: string | null;
  vehicle: string | null;
  assignedServiceId: string;
  delegated: boolean;
  createdAt: string | null;
}

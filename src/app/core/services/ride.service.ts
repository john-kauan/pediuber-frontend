import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  PassengerRideRequest,
  PassengerRideResponse,
  RideHistoryResponse,
  RideTrackingResponse
} from '../models/ride.models';

@Injectable({
  providedIn: 'root'
})
export class RideService {

  private readonly baseUrl = '/api/rides';

  constructor(private readonly http: HttpClient) {}

  requestRide(request: PassengerRideRequest): Observable<PassengerRideResponse> {
    return this.http.post<PassengerRideResponse>(`${this.baseUrl}/request`, request);
  }

  getTracking(rideId: number): Observable<RideTrackingResponse> {
    return this.http.get<RideTrackingResponse>(`${this.baseUrl}/${rideId}/tracking`);
  }

  getHistory(): Observable<RideHistoryResponse[]> {
    return this.http.get<RideHistoryResponse[]>(`${this.baseUrl}/history`);
  }

  startRide(rideId: number): Observable<unknown> {
    return this.http.patch(`${this.baseUrl}/${rideId}/start`, {});
  }

  completeRide(rideId: number): Observable<unknown> {
    return this.http.patch(`${this.baseUrl}/${rideId}/complete`, {});
  }
}
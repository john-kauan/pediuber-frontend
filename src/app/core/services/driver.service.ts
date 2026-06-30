import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  Driver,
  DriverAvailabilityRequest,
  DriverCurrentRideResponse
} from '../models/driver.models';

@Injectable({
  providedIn: 'root'
})
export class DriverService {

  private readonly baseUrl = '/api/drivers';

  constructor(private readonly http: HttpClient) {}

  getDrivers(): Observable<Driver[]> {
    return this.http.get<Driver[]>(this.baseUrl);
  }

  createDriver(driver: Partial<Driver>): Observable<Driver> {
    return this.http.post<Driver>(this.baseUrl, driver);
  }

  updateAvailability(driverId: number, available: boolean): Observable<Driver> {
    const request: DriverAvailabilityRequest = { available };
    return this.http.patch<Driver>(`${this.baseUrl}/${driverId}/availability`, request);
  }

  getCurrentRide(driverId: number): Observable<DriverCurrentRideResponse> {
    return this.http.get<DriverCurrentRideResponse>(`${this.baseUrl}/${driverId}/current-ride`);
  }
}
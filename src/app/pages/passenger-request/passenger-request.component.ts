import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { RideService } from '../../core/services/ride.service';
import {
  PassengerRideRequest,
  PassengerRideResponse
} from '../../core/models/ride.models';

@Component({
  selector: 'app-passenger-request',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './passenger-request.component.html',
  styleUrl: './passenger-request.component.scss'
})
export class PassengerRequestComponent {

  passengerName = '';

  originStreet = '';
  originNumber = '';
  originCity = 'Rio Paranaíba';
  originState = 'MG';
  originLat: number | null = null;
  originLng: number | null = null;

  destinationStreet = '';
  destinationNumber = '';
  destinationCity = 'Rio Paranaíba';
  destinationState = 'MG';
  destinationLat: number | null = null;
  destinationLng: number | null = null;

  loading = false;
  errorMessage = '';
  successResponse: PassengerRideResponse | null = null;

  constructor(private readonly rideService: RideService) {}

  requestRide(): void {
    this.errorMessage = '';
    this.successResponse = null;

    if (!this.passengerName.trim()) {
      this.errorMessage = 'Informe o nome do passageiro.';
      return;
    }

    if (!this.originStreet.trim()) {
      this.errorMessage = 'Informe a origem da corrida.';
      return;
    }

    if (this.originLat === null || this.originLng === null) {
      this.errorMessage = 'Informe a latitude e longitude da origem.';
      return;
    }

    if (!this.destinationStreet.trim()) {
      this.errorMessage = 'Informe o destino da corrida.';
      return;
    }

    if (this.destinationLat === null || this.destinationLng === null) {
      this.errorMessage = 'Informe a latitude e longitude do destino.';
      return;
    }

    const request: PassengerRideRequest = {
      passengerName: this.passengerName.trim(),
      origin: {
        lat: this.originLat,
        lng: this.originLng,
        street: this.originStreet.trim(),
        number: this.originNumber.trim() || 'S/N',
        city: this.originCity.trim(),
        state: this.originState.trim()
      },
      destination: {
        lat: this.destinationLat,
        lng: this.destinationLng,
        street: this.destinationStreet.trim(),
        number: this.destinationNumber.trim() || 'S/N',
        city: this.destinationCity.trim(),
        state: this.destinationState.trim()
      }
    };

    this.loading = true;

    this.rideService.requestRide(request).subscribe({
      next: (response) => {
        this.successResponse = response;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Não foi possível solicitar a corrida. Verifique se o backend está rodando.';
        this.loading = false;
      }
    });
  }

  get trackingLink(): string | null {
    if (!this.successResponse) {
      return null;
    }

    return `/rides/${this.successResponse.localRideId}/tracking`;
  }
}
import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription, interval } from 'rxjs';

import { RideService } from '../../core/services/ride.service';
import { RideTrackingResponse } from '../../core/models/ride.models';

@Component({
  selector: 'app-ride-tracking',
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './ride-tracking.component.html',
  styleUrl: './ride-tracking.component.scss'
})
export class RideTrackingComponent implements OnInit, OnDestroy {

  rideId: number | null = null;
  tracking: RideTrackingResponse | null = null;

  loading = false;
  actionLoading = false;
  errorMessage = '';

  private pollingSubscription: Subscription | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly rideService: RideService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam) {
      this.errorMessage = 'ID da corrida não informado.';
      return;
    }

    this.rideId = Number(idParam);

    if (Number.isNaN(this.rideId)) {
      this.errorMessage = 'ID da corrida inválido.';
      return;
    }

    this.loadTracking();

    this.pollingSubscription = interval(2000).subscribe(() => {
      this.loadTracking(false);
    });
  }

  ngOnDestroy(): void {
    this.pollingSubscription?.unsubscribe();
  }

  loadTracking(showLoading = true): void {
    if (this.rideId === null) {
      return;
    }

    if (showLoading) {
      this.loading = true;
    }

    this.rideService.getTracking(this.rideId).subscribe({
      next: (response) => {
        this.tracking = response;
        this.errorMessage = '';
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Não foi possível carregar o acompanhamento da corrida.';
        this.loading = false;
      }
    });
  }

  startRide(): void {
    if (this.rideId === null) {
      return;
    }

    this.actionLoading = true;
    this.errorMessage = '';

    this.rideService.startRide(this.rideId).subscribe({
      next: () => {
        this.actionLoading = false;
        this.loadTracking();
      },
      error: () => {
        this.actionLoading = false;
        this.errorMessage = 'Não foi possível iniciar a corrida.';
      }
    });
  }

  completeRide(): void {
    if (this.rideId === null) {
      return;
    }

    this.actionLoading = true;
    this.errorMessage = '';

    this.rideService.completeRide(this.rideId).subscribe({
      next: () => {
        this.actionLoading = false;
        this.loadTracking();
      },
      error: () => {
        this.actionLoading = false;
        this.errorMessage = 'Não foi possível finalizar a corrida.';
      }
    });
  }

  get progressWidth(): string {
    if (!this.tracking) {
      return '0%';
    }

    return `${this.tracking.progressPercent}%`;
  }

  get isCompleted(): boolean {
    return this.tracking?.localStatus === 'COMPLETED';
  }

  get isCancelled(): boolean {
    return this.tracking?.localStatus === 'CANCELLED';
  }
}
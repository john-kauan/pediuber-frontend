import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { RideService } from '../../core/services/ride.service';
import { RideHistoryResponse } from '../../core/models/ride.models';

@Component({
  selector: 'app-history',
  imports: [
    CommonModule,
    RouterLink
  ],
  templateUrl: './history.component.html',
  styleUrl: './history.component.scss'
})
export class HistoryComponent implements OnInit {

  rides: RideHistoryResponse[] = [];

  loading = false;
  errorMessage = '';

  constructor(private readonly rideService: RideService) {}

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.loading = true;
    this.errorMessage = '';

    this.rideService.getHistory().subscribe({
      next: (rides) => {
        this.rides = rides;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Não foi possível carregar o histórico de corridas.';
        this.loading = false;
      }
    });
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'REQUESTED':
        return 'Solicitada';
      case 'MATCHED':
        return 'Motorista selecionado';
      case 'CONFIRMED':
        return 'Confirmada';
      case 'IN_TRANSIT':
        return 'Em trânsito';
      case 'COMPLETED':
        return 'Concluída';
      case 'CANCELLED':
        return 'Cancelada';
      case 'COMPENSATING':
        return 'Compensando';
      default:
        return status;
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'COMPLETED':
        return 'completed';
      case 'CONFIRMED':
      case 'IN_TRANSIT':
      case 'MATCHED':
        return 'active';
      case 'CANCELLED':
      case 'COMPENSATING':
        return 'cancelled';
      default:
        return 'neutral';
    }
  }
}
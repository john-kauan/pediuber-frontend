import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { DriverService } from '../../core/services/driver.service';
import {
  Driver,
  DriverCurrentRideResponse
} from '../../core/models/driver.models';

@Component({
  selector: 'app-drivers',
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './drivers.component.html',
  styleUrl: './drivers.component.scss'
})
export class DriversComponent implements OnInit {

  drivers: Driver[] = [];

  newDriverName = '';
  newDriverVehicle = '';

  loading = false;
  creating = false;
  actionLoadingDriverId: number | null = null;

  errorMessage = '';
  successMessage = '';

  currentRideByDriverId: Record<number, DriverCurrentRideResponse> = {};

  constructor(private readonly driverService: DriverService) {}

  ngOnInit(): void {
    this.loadDrivers();
  }

  loadDrivers(): void {
    this.loading = true;
    this.errorMessage = '';

    this.driverService.getDrivers().subscribe({
      next: (drivers) => {
        this.drivers = drivers;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Não foi possível carregar os motoristas.';
        this.loading = false;
      }
    });
  }

  createDriver(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.newDriverName.trim()) {
      this.errorMessage = 'Informe o nome do motorista.';
      return;
    }

    if (!this.newDriverVehicle.trim()) {
      this.errorMessage = 'Informe o veículo do motorista.';
      return;
    }

    this.creating = true;

    this.driverService.createDriver({
      name: this.newDriverName.trim(),
      vehicle: this.newDriverVehicle.trim(),
      available: true
    }).subscribe({
      next: () => {
        this.successMessage = 'Motorista cadastrado com sucesso.';
        this.newDriverName = '';
        this.newDriverVehicle = '';
        this.creating = false;
        this.loadDrivers();
      },
      error: () => {
        this.errorMessage = 'Não foi possível cadastrar o motorista.';
        this.creating = false;
      }
    });
  }

  toggleAvailability(driver: Driver): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.actionLoadingDriverId = driver.id;

    const newAvailability = !driver.available;

    this.driverService.updateAvailability(driver.id, newAvailability).subscribe({
      next: () => {
        this.successMessage = newAvailability
          ? 'Motorista marcado como disponível.'
          : 'Motorista marcado como indisponível.';

        this.actionLoadingDriverId = null;
        this.loadDrivers();
      },
      error: () => {
        this.errorMessage = 'Não foi possível alterar a disponibilidade do motorista.';
        this.actionLoadingDriverId = null;
      }
    });
  }

  loadCurrentRide(driver: Driver): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.actionLoadingDriverId = driver.id;

    this.driverService.getCurrentRide(driver.id).subscribe({
      next: (response) => {
        this.currentRideByDriverId[driver.id] = response;
        this.actionLoadingDriverId = null;
      },
      error: () => {
        this.errorMessage = 'Não foi possível carregar a corrida atual do motorista.';
        this.actionLoadingDriverId = null;
      }
    });
  }

  getCurrentRide(driverId: number): DriverCurrentRideResponse | null {
    return this.currentRideByDriverId[driverId] ?? null;
  }
}
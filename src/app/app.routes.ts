import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { PassengerRequestComponent } from './pages/passenger-request/passenger-request.component';
import { RideTrackingComponent } from './pages/ride-tracking/ride-tracking.component';
import { DriversComponent } from './pages/drivers/drivers.component';
import { HistoryComponent } from './pages/history/history.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'passenger/request',
    component: PassengerRequestComponent
  },
  {
    path: 'rides/:id/tracking',
    component: RideTrackingComponent
  },
  {
    path: 'drivers',
    component: DriversComponent
  },
  {
    path: 'history',
    component: HistoryComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];
import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PassengerRequestComponent } from './pages/passenger-request/passenger-request.component';

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
    path: '**',
    redirectTo: ''
  }
];
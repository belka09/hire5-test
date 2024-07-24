import { GridComponent } from './components/grid/grid.component';
import { LoginComponent } from './components/login/login.component';
import { Routes } from '@angular/router';
import { ProductCardComponent } from './components/product-card/product-card.component';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'products', component: GridComponent },
  { path: 'product', component: ProductCardComponent },
  { path: 'product/:id', component: ProductCardComponent },
];

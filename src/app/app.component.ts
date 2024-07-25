import { Component, computed, effect, Signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { ToasterComponent } from './components/toaster/toaster.component';
import { HeaderComponent } from './components/header/header.component';
import { LoaderComponent } from './components/loader/loader.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, RouterOutlet, ToasterComponent, LoaderComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  public token: Signal<string> = computed(() => this.authService.token());

  constructor(private authService: AuthService, private router: Router) {
    effect(() => {
      if (!this.token()) {
        this.router.navigate(['login']);
      }
    });
  }
}

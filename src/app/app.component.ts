import { Component, effect } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ApiService } from './services/api.service';
import { ToasterComponent } from './components/toaster/toaster.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToasterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'hire5-test-app';

  constructor(private apiServie: ApiService, private router: Router) {
    effect(() => {
      const token = this.apiServie.token();
      if (!token) {
        this.router.navigate(['login']);
      }
    });
  }
}

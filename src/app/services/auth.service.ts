import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _token: WritableSignal<string> = signal(this.getToken());

  get token(): WritableSignal<string> {
    return this._token;
  }

  setToken(token: string) {
    localStorage.setItem('authToken', token);
    this._token.set(token);
  }

  clearToken() {
    localStorage.removeItem('authToken');
    this._token.set('');
  }

  private getToken(): string {
    return localStorage.getItem('authToken') || '';
  }
}

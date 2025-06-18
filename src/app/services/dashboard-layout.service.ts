import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DashboardLayoutService {
  private _isAsideCollapsed = signal(false);

  get isAsideCollapsed() {
    return this._isAsideCollapsed;
  }

  setAsideCollapsed(collapsed: boolean) {
    this._isAsideCollapsed.set(collapsed);
  }

  toggleAside() {
    this._isAsideCollapsed.update(current => !current);
  }
}

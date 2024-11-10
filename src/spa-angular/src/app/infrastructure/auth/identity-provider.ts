import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class IdentityProvider {
  constructor() {
        this.isAuthenticated = false;
        this.accessToken = null;
        this.name = '';
        this.roles = null;
        this.userId = null;
        this.subscriptionId = null;
        this.subscriptionName = null;
  }

  public isAuthenticated: boolean;
  public accessToken: string | null;
  public name: string;
  public userId: string | null;
  public subscriptionId: string | null;
  public subscriptionName: string | null;

  private roles: Array<string> | null = [];

  @Output() public changed = new EventEmitter();

  public isInRole(role: string): boolean {
    if (!this.roles) {
      return false;
    }
    return this.roles.includes(role);
  }

  private reset(): void {
    this.isAuthenticated = false;
    this.accessToken = null;
    this.roles = null;
    this.name = '';
    this.userId = null;
    this.subscriptionId = null;
    this.subscriptionName = null;
  }

  public authenticate(accessToken: string, claims: { [id: string] : any; }): void {
    this.reset();

    if (!accessToken || !claims) {
      this.changed.emit();
      return;
    }

    this.isAuthenticated = true;

    if (claims['role']) {
      this.roles = <Array<string>>claims['role'];
    }

    this.name = claims['preferred_username'] ? claims['preferred_username'] : 'Guest';

    this.accessToken = accessToken;
    this.changed.emit();
  }
}

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin-only',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ng-container *ngIf="isAdmin">
      <ng-content></ng-content>
    </ng-container>
  `,
})
export class AdminOnlyComponent implements OnInit {
  isAdmin: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getUserData().subscribe(user => {
      this.isAdmin = user?.roles?.some(role => role.name === 'Administrador') || false;
    });
  }
}

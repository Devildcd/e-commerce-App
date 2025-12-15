import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Header } from '../../shared/components/header/header';
import { Notifications } from '../../shared/components/notifications/notifications';
import { CartPersistenceService } from '../../core/services/cart-persistence-service';
import { LoginModal } from '../../features/auth/components/login-modal/login-modal';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Header, Notifications, LoginModal],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {

  // private readonly cartPersistence = inject(CartPersistenceService);
}

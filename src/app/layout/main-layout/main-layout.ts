import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Header } from '../../shared/components/header/header';
import { Notifications } from '../../shared/components/notifications/notifications';
import { LoginModal } from '../../features/auth/components/login-modal/login-modal';
import { Footer } from '../../shared/components/footer/footer';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Header, Notifications, LoginModal, Footer],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {

  // private readonly cartPersistence = inject(CartPersistenceService);
}

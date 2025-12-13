import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Header } from '../../shared/components/header/header';
import { Notifications } from '../../shared/components/notifications/notifications';

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, Header, Notifications],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.scss',
})
export class MainLayout {

}

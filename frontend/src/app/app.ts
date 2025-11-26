import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header';
import { WhatsappFloatComponent } from './components/whatsapp-float/whatsapp-float.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderComponent, WhatsappFloatComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {}

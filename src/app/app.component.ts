import { Component } from '@angular/core';
import { ThemePalette } from '@angular/material/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  links = ['play', 'scores'];
  background: ThemePalette = 'primary';
  activeLink = this.links[0];
  title = 'bowling';
}

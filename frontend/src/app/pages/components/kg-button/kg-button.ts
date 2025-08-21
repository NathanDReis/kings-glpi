import { Component, Input } from '@angular/core';

@Component({
  selector: 'kg-button',
  imports: [],
  templateUrl: './kg-button.html',
  styleUrl: './kg-button.css'
})
export class KgButton {
  @Input() typeButton: string = 'solid';
}

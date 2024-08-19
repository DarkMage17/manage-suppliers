import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';

@Component({
  selector: 'app-screening',
  standalone: true,
  imports: [MatTable],
  templateUrl: './screening.component.html',
  styleUrl: './screening.component.css'
})
export class ScreeningComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }
}

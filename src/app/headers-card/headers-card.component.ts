import { Component, Input } from '@angular/core';
import { Project } from 'src/Interfaces/project';

@Component({
  selector: 'app-headers-card',
  templateUrl: './headers-card.component.html',
  styleUrls: ['./headers-card.component.scss']
})
export class HeadersCardComponent {
  @Input() project!: Project | any;
  @Input() width: number = 1;
}

import { Component, Input, Renderer2, ViewChildren } from '@angular/core';
import { Project } from 'src/Interfaces/project';
import { HelperService } from 'src/services/helper.service';

@Component({
  selector: 'app-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss']
})
export class ProjectCardComponent {
  @Input() project!: Project | any;
  @Input() width: number = 1;
  public Log = console.log;
  constructor(private re2:Renderer2,public helper:HelperService){}
  editMode:Record<string,boolean> = {};

  ngOnInit(){
    for(let prop in this.project){
      this.editMode[prop] = false;
    }
  }

  keyDown(event:KeyboardEvent,prop:string){
    if(event.key == 'Enter'){
      this.editMode[prop] = false;
    }
  }

  focusInput(inputName:string){
    setTimeout(() => {
      try {

        this.re2.selectRootElement(`#${inputName}`).focus();
      } catch (error) {

      }
    }, 100);
  }



}

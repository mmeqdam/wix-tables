import { Component, HostListener, OnInit } from '@angular/core';
import { Table, TableEditCompleteEvent, TableEditEvent } from 'primeng/table';
import { Project } from 'src/Interfaces/project';
import { ApiService } from 'src/services/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'wix-tables';
  isLoading:boolean = true;
  projects:Project[] = [];
  roles:any = "Preview User";
  constructor(private api:ApiService){}
  public Log = console.log;

  editedTitles:number[] = [];
  async ngOnInit() {
    this.postMessage({action:'getprojects'});
    this.postMessage({action:'getroles'})
  }

  filter(text:Event,table:Table){
    let inp = text.target as HTMLInputElement;
    table.filterGlobal(inp.value , 'contains')

  }
  Delete(title1:number){
    this.postMessage({action:'delete',data:title1})
  }
  Save(){
    this.postMessage({action:'save',data:this.projects,editedTitles:this.editedTitles})
  }
  Edited(event:TableEditCompleteEvent){
    if(event?.index){
      this.editedTitles.push(event.index);
    }
  }
  AddEntry(){
   this.postMessage({action:'add'})
  }
  postMessage(message:any){
    window.parent.postMessage(message,'*')
  }
  @HostListener('window:message',['$event'])
  RecievedMessage(event:MessageEvent){
    let message = event.data;

    if(message.roles){
      this.roles = message.roles;
    }
    if(message?.projects){
      this.projects = message.projects;
      this.isLoading = false;
    }
  }
}

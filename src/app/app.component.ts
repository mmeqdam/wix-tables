import { Component, HostListener, OnInit } from '@angular/core';
import { Table } from 'primeng/table';
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
  constructor(private api:ApiService){}
  public Log = console.log;


  async ngOnInit() {
    this.api.GetProjects().subscribe(projects =>{
      this.projects = projects;
      this.isLoading = false;
      this.postMessage();
    })
  }

  filter(text:Event,table:Table){
    let inp = text.target as HTMLInputElement;
    table.filterGlobal(inp.value , 'contains')

  }
  postMessage(){
    postMessage({name:'test',age:25})
  }
  @HostListener('window:message',['$event'])
  RecievedMessage(event:MessageEvent){
    console.log(event.data)
  }
}

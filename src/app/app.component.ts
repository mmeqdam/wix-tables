import { Component, HostListener, OnInit } from '@angular/core';
import { Table, TableEditCompleteEvent, TableEditEvent } from 'primeng/table';
import { Observable, share, throttleTime } from 'rxjs';
import { Project } from 'src/Interfaces/project';
import { ApiService } from 'src/services/api.service';

interface column{
  value:string,
  header:string
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'wix-tables';
  isLoading:boolean = true;
  projects:Project[] = [];
  errorHappened:boolean = false;
  selectedColumns:column[] =
  [
    {value:'title',header:'اسم المشروع'},
    {value:'title1',header:'رقم المشروع'},
    {value:'teacher',header:'المعلم'},
    {value:'class',header:'الصف'},
    {value:'startDate',header:'تاريخ البدء'},
    {value:'endDate',header:'تاريخ الأنتهاء'},
    {value:'date',header:'تاريخ العرض'},
    {value:'time',header:'وقت العرض'},
    {value:'progression_percentage',header:'نسبة الأنجاز'},
    {value:'notes',header:'ملاحظات'},
    {value:'presentation_clarity',header:'وضوح العرض'},
    {value:'work_quality',header:'جوده العمل'},
    {value:'companionship',header:'الشراكة والتعاون'},
    {value:'rating',header:'العلامة النهائية'},
  ]
  allColumns:column[] =
  [
    {value:'title',header:'اسم المشروع'},
    {value:'title1',header:'رقم المشروع'},
    {value:'summary',header:'ملخص المشروع'},
    {value:'school',header:'المدرسة'},
    {value:'teacher',header:'المعلم'},
    {value:'class',header:'الصف'},
    {value:'startDate',header:'تاريه البدء'},
    {value:'endDate',header:'تاريخ الأنتهاء'},
    {value:'date',header:'تاريخ العرض'},
    {value:'time',header:'وقت العرض'},
    {value:'progression_percentage',header:'نسبة الأنجاز'},
    {value:'notes',header:'ملاحظات'},
    {value:'presentation_clarity',header:'وضوح العرض'},
    {value:'work_quality',header:'جودة العمل'},
    {value:'companionship',header:'الشراكة والتعاون'},
    {value:'rating',header:'العلامة النهائية'}
  ]
  roles:any[] = [];
  constructor(private api:ApiService){}
  public Log = console.log;
  turningOff = false;
  editedTitles:number[] = [];
  async ngOnInit() {
    this.postMessage({action:'getprojects'});
    this.postMessage({action:'getroles'})
  }
  IsSelected(col:string):boolean{
    return this.selectedColumns.some(x => x.value == col);
  }
  filter(text:Event,table:Table){
    let inp = text.target as HTMLInputElement;
    table.filterGlobal(inp.value , 'contains')

  }
  Delete(title1:number){
    this.isLoading = true;

    this.postMessage({action:'delete',data:title1})
  }
  Save(){
    this.isLoading = true;

    this.postMessage({action:'save',data:this.projects,editedTitles:this.editedTitles})
  }
  Edited(event:TableEditCompleteEvent){
    if(event?.index){
      this.editedTitles.push(event.index);
    }
  }
  AddEntry(){
   this.isLoading = true;

   this.postMessage({action:'add'})
  }
  postMessage(message:any){
    window.parent.postMessage(message,'*')
  }
  get isAdmin(){
   return this.roles?.some(role => role?.name == 'Admin');
  }
  ColumnsChanged(){
    if(this.selectedColumns.length == 0){
      this.selectedColumns = [{value:'title',header:'اسم المشروع'}]
    }
  }
  @HostListener('window:message',['$event'])
  RecievedMessage(event:MessageEvent){
    let message = event.data;
    console.log(message)

    if(message.roles){
      this.roles = message.roles;
      console.log(this.roles);
    }
    if(message == 'error'){
      console.log('---- message is error ----')
      this.isLoading = false;
      this.errorHappened = true;
      setTimeout(() => {
        this.errorHappened = false;
      }, 1000);
    }
    if(message?.projects){
      this.projects = message.projects;
      this.isLoading = false;
    }
  }


}

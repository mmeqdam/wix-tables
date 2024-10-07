import { Component, HostListener, OnInit } from '@angular/core';
import { FilterService } from 'primeng/api';
import { Table, TableEditCompleteEvent, TableEditEvent } from 'primeng/table';
import { Observable, share, throttleTime } from 'rxjs';
import { Project } from 'src/Interfaces/project';
import { School } from 'src/Interfaces/school';
import { Teacher } from 'src/Interfaces/teacher';
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
  isLoading:boolean = false;
  projects:Project[] = [];
  students:any[] = [];
  schools:School[] = [];
  errorHappened:boolean = false;
  multipleroles:boolean = false;
  teachers:Teacher[] = [];
  currentSlice = 0;
  chunkAmount = 4;
  allowedRoles = ['Schools','Suber Admin','Teachers','Admin','Owner']
  selectedColumns:column[] =
  [
    {value:'title',header:'اسم المشروع'},
    {value:'title1',header:'رقم المشروع'},
    {value:'teacherid',header:'المعلم'},
    {value:'class',header:'الصف'},
    {value:'students',header:'الطلاب'},
    {value:'startDate',header:'تاريخ البدء'},
    {value:'endDate',header:'تاريخ الأنتهاء'},
    {value:'date',header:'تاريخ العرض'},
    {value:'time',header:'وقت العرض'},
    {value:'progression_percentage',header:'نسبة الأنجاز'},
    {value:'notes',header:'ملاحظات'},
    {value:'presentation_clarity',header:'وضوح العرض'},
    {value:'work_quality',header:'جودة العمل'},
    {value:'companionship',header:'الشراكة والتعاون'},
    {value:'rating',header:'العلامة النهائية'},
  ]
  allColumns:column[] =
  [
    {value:'title',header:'اسم المشروع'},
    {value:'title1',header:'رقم المشروع'},
    {value:'summary',header:'ملخص المشروع'},
    {value:'school',header:'المدرسة'},
    {value:'teacherid',header:'المعلم'},
    {value:'class',header:'الصف'},
    {value:'students',header:'الطلاب'},
    {value:'startDate',header:'تاريخ البدء'},
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

  constructor(private filterService:FilterService){
  }
  public Log = console.log;
  turningOff = false;
  editedTitles:number[] = [];
  async ngOnInit() {

    this.projects.push(
      {
        title:' خزاع الالي',
        notes:'5 ',
        summary:'معاذ',
       time:'7',
        startDate:'2022',

        endDate:'2024 ',


        description:'2154',

        objectives:' جيد',
        evaluationCriteria:'متوسط ',
        materialsAndTools:'جيد ',
        date:' متعاون ',
        school:'ممبدع',

        steps:'100',



      },
      {
        title:' خزاع الالي',
        notes:'5 ',
        summary:'معاذ',
       time:'7',
        startDate:'2022',

        endDate:'2024 ',


        description:'2154',

        objectives:' جيد',
        evaluationCriteria:'متوسط ',
        materialsAndTools:'جيد ',
        date:' متعاون ',
        school:'ممبدع',

        steps:'100',



      },
      {
        title:' خزاع الالي',
        notes:'5 ',
        summary:'معاذ',
       time:'7',
        startDate:'2022',

        endDate:'2024 ',


        description:'2154',

        objectives:' جيد',
        evaluationCriteria:'متوسط ',
        materialsAndTools:'جيد ',
        date:' متعاون ',
        school:'ممبدع',

        steps:'100',




      },
      {
        title:' خزاع الالي',
        notes:'5 ',
        summary:'معاذ',
       time:'7',
        startDate:'2022',

        endDate:'2024 ',


        description:'2154',

        objectives:' جيد',
        evaluationCriteria:'متوسط ',
        materialsAndTools:'جيد ',
        date:' متعاون ',
        school:'ممبدع',

        steps:'100',



      },
      {
        title:'الكرسي المتحرك',
        notes:'5 ',
        summary:'معاذ',
       time:'7',
        startDate:'2022',

        endDate:'2024 ',


        description:'2154',

        objectives:' جيد',
        evaluationCriteria:'متوسط ',
        materialsAndTools:'جيد ',
        date:' متعاون ',
        school:'ممبدع',

        steps:'100',



      },

  )
    this.filterService.register('containsStudent',(value:any[],filter:any[]):boolean => {
      console.log('val',value);
      console.log('filter',filter);
      if(filter === undefined || filter === null || filter?.length === 0){
          return true;
      }
      return value.some(val => filter.find(x => x._id == val._id));
    })

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
   return this.roles?.some(role => this.allowedRoles.some(y => y == role?.title));
  }
  get isTeacher(){
    return this.roles?.some(role => role?.title == 'Teachers');
  }

  get isSchool(){
    return this.roles?.some(role => role?.title == 'Schools');
  }
  get isStudent(){
    return this.roles?.some(role => role?.title == 'Students');
  }

  getStudentNames(students:any[]):string{
    return students.map(x => x.studentName).join(',');
  }
  getTeacherName(id:any){
    return this.teachers.find(x => x?.teacherId == id)?.teacherName ?? 'معلم';
  }
  getSchoolName(id:any){
    return this.schools.find(x => x?._id == id)?.schoolName ?? 'مدرسه';
  }
  ColumnsChanged(){
    if(this.selectedColumns.length == 0){
      this.selectedColumns = [{value:'title',header:'اسم المشروع'}]
    }
  }

  RemoveColumn(columnName:string,flag:boolean){
    if(flag){
      let indexall = this.allColumns.findIndex(x => x.value == columnName);
      this.allColumns.splice(indexall,1);
      let index = this.selectedColumns.findIndex(x => x.value == columnName);
      this.selectedColumns.splice(index,1);
    }
  }



  @HostListener('window:message',['$event'])
  RecievedMessage(event:MessageEvent){
    let message = event.data;
    console.log(message)

    if(message.roles){
      this.roles = message.roles;
      this.RemoveColumn('school',(this.isSchool || this.isStudent || this.isTeacher));
      this.RemoveColumn('teacherid',(this.isTeacher));
    }
    if(message == 'error'){
      console.log('---- message is error ----')
      this.isLoading = false;
      this.errorHappened = true;
      setTimeout(() => {
        this.errorHappened = false;
      }, 1000);
    }
    if(message == 'loaded'){
      this.postMessage({action:'getteachers'})
      this.postMessage({action:'getroles'})
      this.postMessage({action:'getprojects'});
      this.postMessage({action:'getschools'});
      this.postMessage({action:'getstudents'});
    }
    if(message?.projects){
      this.projects = message.projects;
      this.isLoading = false;
    }
    if(message?.students){
      this.students = message.students;
    }
    if(message?.schools){
      this.schools = message.schools;
    }
    if(message?.teachers){
      console.log('teachers',message.teachers)
      this.teachers = message.teachers;
    }
  }


}

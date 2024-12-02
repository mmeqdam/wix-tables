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
  isLoading:boolean = true;
  projects:Project[] = [];
  students:any[] = [];
  schools:School[] = [];
  errorHappened:boolean = false;
  multipleroles:boolean = false;
  teachers:Teacher[] = [];
  allowedRoles = ['Schools','Suber Admin','Teachers','Admin','Owner']
  selectedColumns: column[] = [
    { value: 'title', header: 'اسم المشروع' },
    { value: 'innovation', header: 'الأصالة والإبداع' } ,
    { value: 'title1', header: 'رقم المشروع' },
    { value: 'teacherId', header: 'المعلم' },
    { value: 'class', header: 'الصف' },
    { value: 'students', header: 'الطلاب' },
    { value: 'startDate', header: 'تاريخ البدء' },
    { value: 'endDate', header: 'تاريخ الأنتهاء' },
    { value: 'date', header: 'تاريخ العرض' },
    { value: 'time', header: 'وقت العرض' },
    { value: 'progression_percentage', header: 'نسبة الأنجاز' },
    { value: 'notes', header: 'ملاحظات' },
    { value: 'presentation_clarity', header: 'وضوح العرض' },
    { value: 'work_quality', header: 'جودة العمل' },
    { value: 'companionship', header: 'الشراكة والتعاون' },
    { value: 'rating', header: 'العلامة النهائية' },
    
  ];
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
    {value:'rating',header:'العلامة النهائية'},
    { value: 'innovation', header: 'الأصالة والإبداع' } 
  ]
  roles:any[] = [];

  constructor(private filterService:FilterService){}
  public Log = console.log;
  turningOff = false;
  editedTitles:number[] = [];
  async ngOnInit() {
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
    console.log(this.projects);
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

  getStudentNames(s: any[]): string {
    // Assuming 'students' is your global array of students
    return s.map(x => {
      const student = this.students.find(student => student._id === x._id);
      return student ? student.studentName : ''; // Return student name or empty if not found
    }).join(',');
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
    if (message?.projects) {
      this.projects = message.projects;
      console.log("data got in message" , message.projects);
      
      // Iterate through each project
      this.projects.forEach(project => {
        // Check if the project has students and it's an array
        if (project.students && Array.isArray(project.students)) {
          // Replace each student object with their _id
          project.students = project.students.map(student => student._id);
        }
      });
      console.log("data after treat",this.projects);
      
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

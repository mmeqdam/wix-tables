import { Component, HostListener, OnInit ,SimpleChanges} from '@angular/core';
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
  selectedProject :Project = {};
  
  projects:Project[] = [];
  students:any[] = [];
  schools:School[] = [];
  version:Number = 1;
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
  showSaveBtn = false;
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

  ngOnChanges(changes: SimpleChanges) {
    // Access the selectedProject change using bracket notation
    if (changes['selectedProject'] && changes['selectedProject'].currentValue) {
      this.updateProgressBar('progress1', this.selectedProject.progression_percentage ?? 0);
    }
  }
  // Function to update the progress bar
  updateProgressBar(id: string, progressVal: number, totalPercentageVal: number = 100) {
    const strokeVal = (4.64 * 100) / totalPercentageVal;
    const circle = document.querySelector(`#${id} .progress-circle-prog`) as HTMLElement;
    circle.style.strokeDasharray = progressVal * strokeVal + ' 999';

    const el = document.querySelector(`#${id} .progress-text`) as HTMLElement;
    const from = parseFloat(el.getAttribute('data-progress') || '0');
    el.setAttribute('data-progress', progressVal.toString());

    const start = new Date().getTime();

    setTimeout(function() {
      const now = (new Date().getTime()) - start;
      const progress = now / 700;
      el.innerHTML = (progressVal / totalPercentageVal) * 100 + '%';
      if (progress < 1) setTimeout(arguments.callee, 10);
    }, 10);
  }
   // Get rotation for the first half (0 to 50%)
  getFirstHalfRotation(percentage: number): number {
    return percentage > 50 ? 180 : (percentage * 3.6); // Rotate up to 180deg (50%)
  }

  // Get rotation for the second half (50 to 100%)
  getSecondHalfRotation(percentage: number): number {
    return percentage > 50 ? (percentage - 50) * 3.6 : 0; // Rotate for the second half if > 50%
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
  Save(): void {
    this.isLoading = true;
    

    // After processing all projects
    this.postMessage({ action: 'save', data: this.projects, editedTitles: this.editedTitles });
  
    this.showSaveBtn = false;
    this.editedTitles = [];
  }
  
  Edited(event:TableEditCompleteEvent){
    console.log(event?.index , "have been edited");
    this.showSaveBtn = true;
    if(event?.index){
      this.editedTitles.push(event.index);
    }
  }
  SomethingInTableChanged(title1: number) {
    console.log("changes");
  
    // Check if title1 is already in the editedTitles array
    if (title1 && !this.editedTitles.includes(title1)) {
      this.editedTitles.push(title1);  // Only push if title1 is not already in the array
    }
  }
  SomethingInTableChangedSelect(title1: number) {
    console.log("changes");
  
    // Check if title1 is already in the editedTitles array
    if (title1 && !this.editedTitles.includes(title1)) {
      this.editedTitles.push(title1);  // Only push if title1 is not already in the array
    }
    // Iterate over editedTitles and apply the logic for each project
    this.editedTitles.forEach(title => {
      // Step 1: Find the project by its title (title1)
      const project = this.projects.find(p => p.title1 === title);
  
      if (!project) {
        console.warn(`Project with title ${title} not found`);
        return;
      }
  
      // Step 2: Initialize `students` if it is undefined
      project.students = project.students ?? [];
  
      // Step 3: Find missing student names in `studentsNames`
      const missingStudentNames = (project.studentsNames ?? []).filter(
        name => !(project.students ?? []).some(student => student.studentName === name)
      );
  
      // Step 4: Find missing student objects in the global `students` array
      const missingStudents = missingStudentNames.map(name =>
        this.students.find(student => student.studentName === name)
      );
  
      // Step 5: Append missing students to `project.students`
      project.students.push(...missingStudents.filter(student => student));
      
      // Step 6: Ensure `students` only contains students from `studentsNames`
      const updatedStudents = (project.studentsNames ?? []).map(name => {
        // Find the student object by studentName from the global `students` array
        return this.students.find(student => student.studentName === name);
      }).filter(student => student !== undefined); // Remove any undefined students (if name doesn't match any student)

      // Step 7: Overwrite `project.students` with the updated students list
      project.students = updatedStudents;
      console.log(`Updated project with title ${title}:`, project);
    });
  }
  AddEntry(){
   this.isLoading = true;

   this.postMessage({action:'add'})
  }
  postMessage(message:any){
    window.parent.postMessage(message,'*')
  }
  isEmptyObject(obj:any) {
    return (obj && (Object.keys(obj).length === 0));
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

  getStudentNames(students: any[]): string {
    return students
      .map(x => {
        // Check if x is an object and has a studentName property
        if (typeof x === 'object' && x !== null && 'studentName' in x) {
          return x.studentName;
        }
        // If it's a string, return it directly
        return x;
      })
      .join(',');
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

  
  SwitchVersion() {
    if (this.version == 1) {
      this.version = 2
    } else {
      this.version = 1
    }
  }

  calculateTimeRemaining(endDate: string | undefined): string {
    if (!endDate) {
      return 'لم يتم توفير تاريخ الانتهاء';
    }
  
    const now = new Date();
    const end = new Date(endDate);
    const diff = end.getTime() - now.getTime();
  
    if (diff <= 0) {
      return 'انتهى الوقت';
    }
  
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
    return `${days} يوم ${hours} ساعة ${minutes} دقيقة متبقية`;
  }
  
  
  @HostListener('window:message',['$event'])
  RecievedMessage(event:MessageEvent){
    let message = event.data;
    

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



  // from prod to dev just chnage Hostline into Coment and loading into True

}

import { Injectable } from '@angular/core';
import { School } from 'src/Interfaces/school';
import { Teacher } from 'src/Interfaces/teacher';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  constructor() { }

  public teachers:Teacher[]=[];
  public schools:School[]=[];
  public students:any[]=[];
  public roles:any[]=[];
  allowedRoles = ['Schools','Suber Admin','Teachers','Admin','Owner']

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
    try {
      return students.map(x => x.studentName).join(',');
    } catch (error) {
      return '';
    }
   }
   getTeacherName(id:any){
    try {
      return this.teachers.find(x => x?.teacherId == id)?.teacherName ?? 'معلم';

    } catch (error) {
      return '';
    }
   }
   getSchoolName(id:any){
    try {
      return this.schools.find(x => x?._id == id)?.schoolName ?? 'مدرسه';

    } catch (error) {
      return '';
    }
   }
}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { TableModule } from 'primeng/table';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {InputTextModule} from 'primeng/inputtext'
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import {ProgressSpinnerModule} from 'primeng/progressspinner'
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import {MultiSelectModule} from 'primeng/multiselect'


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    TableModule,
    FormsModule,
    HttpClientModule,
    InputTextModule,
    DropdownModule,
    CalendarModule,
    ProgressSpinnerModule,
    InputTextareaModule,
    TooltipModule,
    ButtonModule,
    MultiSelectModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FieldsTableComponent } from './componets/fields-table/fields-table.component';
import { SharedModule } from './shared/shared.module';
import { CustomInputComponent } from './componets/custom-input/custom-input.component';

@NgModule({
  declarations: [
    AppComponent,
    FieldsTableComponent,
    CustomInputComponent
  ],
  imports: [
    BrowserModule,
    SharedModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { Component } from '@angular/core';
import fields from "../assets/fieldsData"
import { DataService } from './core/services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'fields-task';
  constructor(private dataService: DataService){
    this.dataService.storeData(fields);
  }
}

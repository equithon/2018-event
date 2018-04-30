import { TimeIntervals } from './../../../api/server/models';
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';



@Component({
  selector: 'page-result',
  templateUrl: 'result.html',
})
export class ResultPage {

  viewType: string;
  viewDetails: any;
  mealExceptionOptions: string[] = [
    'Vegetarian',
    'Vegan',
    'Gluten-Free',
    'Halal',
    'Other'
  ];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public view: ViewController) {
    this.viewType = navParams.get('code') + 'View';
    this.viewDetails = navParams.get('details');
    console.log('viewtype is ' + this.viewType);
    console.log(this.viewDetails);

  }

  ionViewDidLoad() {
    console.log('~ loaded Check In Page with ViewType %s ~', this.viewType);
    document.getElementById(this.viewType).style.display = 'block';
  }
  
}

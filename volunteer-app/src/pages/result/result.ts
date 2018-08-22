import { AuthProvider } from './../../providers/auth/auth';
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
              public view: ViewController,
              public auth: AuthProvider) {
    this.viewType = navParams.get('code') + 'View';
    this.viewDetails = navParams.get('details');
    console.log('viewtype is ' + this.viewType);
    console.log(this.viewDetails);

  }

  ionViewDidLoad() {
    console.log('~ loaded Check In Page with ViewType %s ~', this.viewType);
    document.getElementById(this.viewType).style.display = 'block';
    try {
      if(this.viewDetails && this.viewDetails.userName === 'Feridun Hamdullahpur') {
        document.getElementById('checkinAvatarFeridun').style.display = 'inline';
        document.getElementById('hh-clue-inject').innerHTML = 'The next clue is the ‘year when I received my masters degree’ + ‘the country I received it in’'
      } else {
        document.getElementById('checkinAvatar' + (Math.floor(Math.random() * 6))).style.display = 'inline';
      }
    } catch(err) {
      console.log(err);
      this.auth.alertUser('An unknown error occurred.');
    }   
  }
}

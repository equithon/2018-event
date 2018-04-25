import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';



@Component({
  selector: 'page-result',
  templateUrl: 'result.html',
})
export class ResultPage {

  viewType: string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public view: ViewController) {
    this.viewType = navParams.get('view');
  }

  ionViewDidLoad() {
    console.log('~ loaded Check In Page with ViewType %s ~', this.viewType);
    document.getElementById(this.viewType).style.display = 'inline';
  }

}

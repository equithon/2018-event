import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Users, Events } from 'api/collections';
import { User } from 'api/models';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import 'rxjs/add/operator/mergeMap';

@Component({
  selector: 'page-directory',
  templateUrl: 'directory.html',
})
export class DirectoryPage implements OnInit {

  users: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ngOnInit() {
      this.users = Users
      .find({})
      .mergeMap((users: User[]) =>
      Observable.combineLatest(
          ...users.map((user: User) =>
          Events
              .find({userId: user._id})
              .startWith(null)
              .map(messages => {
                  return user;
              })
          )
      )
      ).zone();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DirectoryPage');
  }

}

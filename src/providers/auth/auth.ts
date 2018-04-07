import { Injectable, ViewChild } from '@angular/core';
import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';
import { Events, Nav } from 'ionic-angular';
import { ProfilePage } from './../../pages/profile/profile';

@Injectable()
export class AuthProvider {
  @ViewChild(Nav) nav: Nav;

  constructor(public events: Events) {
    console.log('Hello AuthProvider Provider');
  }

  register(new_user: any){
    let fail: string = null;
    Accounts.createUser(new_user,
                        function(error){ console.log('failed'); fail = error.reason; });
    if(fail) {
      console.log('failed to register with error: %s', fail);
      return false;
    }
    console.log('sucessfully registered %s', new_user.email);
    this.events.publish('user:register', Date.now());
    return true;

  }

  login(email: string, pass: string){
    Meteor.loginWithPassword(email, pass);
    if(Meteor.user() !== null){
      this.events.publish('user:login', Date.now());
      return true;
    }
    return false;
  }

  logout(){
    console.log('logging out');
    this.events.publish('user:logout', Date.now());
    Meteor.logout();
  }

}

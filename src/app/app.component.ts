import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, ModalController, Nav, Events, Modal, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Meteor } from 'meteor/meteor';

import { AuthProvider } from './../providers/auth/auth';

import { TutorialPage } from '../pages/tutorial/tutorial';

import { ProfilePage } from '../pages/profile/profile';
import { ScannerPage } from '../pages/scanner/scanner';
import { DirectoryPage } from './../pages/directory/directory';
import { LoginPage } from './../pages/login/login';
import { SignupPage } from './../pages/signup/signup';
import { SchedulePage } from './../pages/schedule/schedule';


export interface PageInterface {
  title: string,
  name: string,
  component: any,
  logsOut?: boolean,
  icon: string
}

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = Meteor.user() ? ScannerPage : TutorialPage; //NOT WORKING

  navigationPages: PageInterface[] = [
    { title: 'Scanner', name: 'ScannerPage', component: ScannerPage, icon: '' },
    { title: 'Directory', name: 'DirectoryPage', component: DirectoryPage, icon: '' },
    { title: 'Schedule', name: 'SchedulePage', component: SchedulePage, icon: '' }
  ]

  loggedInPages: PageInterface[] = [
    { title: 'Profile', name: 'ProfilePage', component: ProfilePage, icon: '' },
    { title: 'Log out', name: 'ScannerPage', component: ScannerPage, logsOut: true, icon: '' }
  ]

  loggedOutPages: PageInterface[] = [
    { title: 'Log in', name: 'LoginPage', component: LoginPage, icon: '' },
    { title: 'Sign up', name: 'SignupPage', component: SignupPage, icon: '' },
  ]

  constructor(public platform: Platform, 
              public menu: MenuController,
              public toastCtrl: ToastController,
              public auth: AuthProvider,
              public events: Events,
              public statusBar: StatusBar, 
              public splashScreen: SplashScreen) {

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.switchMenu(Meteor.user() !== null); // changes menu if the user is logged in
    });

    this.listenToLoginEvents();
    
  }

  openPage(page: PageInterface){
    this.nav.setRoot(page.component);
    if(page.logsOut) this.auth.logout();
  }

  listenToLoginEvents() {

    //add toast notifications!
    this.events.subscribe('user:register', () => {
      this.switchMenu(true);
    });

    this.events.subscribe('user:login', () => {
      this.switchMenu(true);
    });

    this.events.subscribe('user:logout', () => {
      this.switchMenu(false);
    });
  }

  switchMenu(loggedIn) {
    this.menu.enable(loggedIn, 'loggedInView');
    this.menu.enable(!loggedIn, 'loggedOutView');
  }
}


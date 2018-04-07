import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, NavController } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MomentModule } from 'angular2-moment';

import { ScannerPage } from '../pages/scanner/scanner';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { DirectoryPage } from './../pages/directory/directory';

import { MyApp } from './app.component';

@NgModule({
  declarations: [
    MyApp,
    ScannerPage,
    TutorialPage,
    DirectoryPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    MomentModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ScannerPage,
    TutorialPage,
    DirectoryPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}

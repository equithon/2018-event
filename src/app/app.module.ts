import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule, NavController} from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { MomentModule } from 'angular2-moment';

import { AuthProvider } from './../providers/auth/auth';
import { DataProvider } from '../providers/data/data';

import { ScannerPage } from '../pages/scanner/scanner';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { DirectoryPage } from './../pages/directory/directory';
import { SchedulePage } from './../pages/schedule/schedule';
import { LoginPage } from './../pages/login/login';
import { ProfilePage } from './../pages/profile/profile';
import { SignupPage } from './../pages/signup/signup';
import { EventPage } from '../pages/event/event';
import { ErrorPage } from './../pages/error/error';
import { HelpPage } from './../pages/help/help';
import { ResultPage } from './../pages/result/result';

import { MyApp } from './app.component';


@NgModule({
  declarations: [
    MyApp,
    ScannerPage,
    TutorialPage,
    HelpPage,
    DirectoryPage,
    LoginPage,
    ProfilePage,
    SignupPage,
    ResultPage,
    SchedulePage,
    EventPage,
    ErrorPage
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
    HelpPage,
    DirectoryPage,
    LoginPage,
    ProfilePage,
    SignupPage,
    ResultPage,
    SchedulePage,
    EventPage,
    ErrorPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    QRScanner,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthProvider,
    DataProvider
  ]
})
export class AppModule {}

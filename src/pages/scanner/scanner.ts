import { Component } from '@angular/core';
import { Users, Events } from 'api/collections';
import { User } from 'api/models';
import { Observable } from 'rxjs';
import * as moment from 'moment';

@Component({
  templateUrl: 'scanner.html'
})
export class ScannerPage {
    users;
   
    constructor() {
    }
   
    openScanner(){
        console.log('opening scanner');
    }


    /*removeChat(user: User): void {
        Users.remove({_id: user.id}).subscribe(() => {
    });
    }*/
  }
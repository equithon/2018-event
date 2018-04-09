import { ModalController } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { UserPage } from '../../pages/user/user';
import { Event, EventType } from './../../../api/server/models';
import { EventPage } from './../../pages/event/event';
import { ErrorPage } from './../../pages/error/error';
@Injectable()
export class DetailProvider {

  constructor(public modalCtrl: ModalController) {
    console.log('Hello DetailProvider Provider');
  }

  showDetail(params) {
    let pageType: any = ErrorPage;
    if(params.type === 'user') {
      pageType = UserPage;
    } else if(params.type === 'event') {
      pageType = EventPage;
    }

    let detailModal = this.modalCtrl.create(pageType, {details: params.info});
    detailModal.present();
  }

}

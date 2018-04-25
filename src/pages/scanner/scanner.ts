import { Component } from '@angular/core';
import { Platform, Events as EventControl, ModalController, Modal } from 'ionic-angular';
import { QRScanner, QRScannerStatus } from '@ionic-native/qr-scanner';
import { Observable } from 'rxjs';

import { Meteor } from 'meteor/meteor';
import { UserRole, Event, TimeIntervals } from './../../../api/server/models';
import { Events } from './../../../api/server/collections/events';
import { AuthProvider } from './../../providers/auth/auth';
import { ResultPage } from '../result/result';
@Component({
	templateUrl: 'scanner.html'
})
export class ScannerPage {

	users: any[];
	queryId: string;
	eventOptions: Event[];
	eventChosen: string;

	constructor(public platform: Platform,
				public qrScanner: QRScanner,
				public auth: AuthProvider,
				public eventCtrl: EventControl,
				public modalCtrl: ModalController) {
		this.eventOptions = Events.find({}).fetch();
		/*this.eventOptions = Events.find({}).fetch().filter((evnt) => {
			evnt.time_start - TimeIntervals.hour <= Date.now() && Date.now() <= evnt.time_end + TimeIntervals.hour
		}); */ // TODO: UNCOMMENT THIS FOR ACCURATE EVENT SELECTIONS

	}

	ionViewDidLoad() {
		
	}

	ionViewDidEnter() {
		if (Meteor.user() && ((Meteor.user() as any).role === UserRole.ORGANIZER || (Meteor.user() as any).role === UserRole.VOLUNTEER)) {
			console.log('should be displaying event selector')
			this.eventChosen = (Meteor.user() as any).specificInfo.atEvent;
			document.getElementById('eventSelector').style.display = 'inline';
		} else {
			document.getElementById('eventSelector').style.display = 'none';
		}
		if (this.platform.is('cordova')) {
			console.log('opening scanner');
			this.qrScanner.prepare()
				.then((status: QRScannerStatus) => {
					if (status.authorized) {
						// camera permission was granted, show the scanner
						this.showScanner();
						// wait for user to scan something, then the observable callback will be called

					}
				})
				.catch((e: any) => console.log('Error is', e));
		} else {
			console.log('cordova not running: make sure this is running natively on a phone.')
		}
	}

	ionViewWillLeave() {
		this.hideScanner();
	}



	startScanning() {
		// start scanning
		if (this.platform.is('cordova')) {
			let scanSub = this.qrScanner.scan().subscribe((scanned: string) => {
				console.log('contents of scanned: ', scanned);
				this.hideScanner();
				scanSub.unsubscribe(); // stop scanning
				this.queryId = scanned;
				this.checkUserIn();
			});
		} else {
			console.log('cordova not running: make sure this is running natively on a phone.')
		}
		
	}

	showScanner() {
		
		(window.document.querySelector('ion-app') as HTMLElement).classList.add('cameraView');
		//this.qrScanner.resumePreview();
		this.qrScanner.show();
	}

	hideScanner() {
		(window.document.querySelector('ion-app') as HTMLElement).classList.remove('cameraView');
		this.qrScanner.hide(); // hide camera preview
	}

	toggleScanner(){
		let closedScanner = (window.document.querySelector('ion-app') as HTMLElement).classList.toggle('cameraView');
		if(closedScanner) {
			this.qrScanner.hide(); // hide camera preview
		} else {
			this.qrScanner.show();
		}
	}

	checkUserIn(): void {

		Meteor.call('scanner.checkIn', {
			userId: this.queryId
		}, 
		(err, res) => {

			if (err) {
				console.log('check-in could not be completed, error was:');
				console.log(err);
			} else {
				console.log('check in result was:');
				console.log(res);
				this.handleCheckIn(res);
				this.eventCtrl.publish('user:update', Date.now());
			}

		});


	}


	handleCheckIn(res): void {
		let detailModal: Modal;
		console.log('showing view ' + res.code + 'View');
		detailModal = this.modalCtrl.create(ResultPage, {view: res.code + 'View', user: res.user});

		detailModal.onDidDismiss( () => {
			this.showScanner();
		});

		detailModal.present();

	}



}
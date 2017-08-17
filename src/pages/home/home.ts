import { Component } from '@angular/core';

import { ActionSheet, ActionSheetController, Config, NavController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { ConferenceData } from '../../providers/conference-data';
import { MedicalclaimPage } from '../medicalclaim/medicalclaim';
import { SessionDetailPage } from '../session-detail/session-detail';
import { AboutPage } from '../about/about';
import { PrintclaimPage } from '../printclaim/printclaim';
import { GiftclaimPage } from '../giftclaim/giftclaim';
import { OvertimeclaimPage } from '../overtimeclaim/overtimeclaim';
import { EntertainmentclaimPage } from '../entertainmentclaim/entertainmentclaim';
import { TravelclaimPage } from '../travelclaim/travelclaim';
@Component({
  selector: 'page-speaker-list',
  templateUrl: 'home.html'
})
export class SpeakerListPage {
  actionSheet: ActionSheet;
  speakers: any[] = [];

  constructor(
    public actionSheetCtrl: ActionSheetController,
    public navCtrl: NavController,
    public confData: ConferenceData,
    public config: Config,
    public inAppBrowser: InAppBrowser
  ) { }

  ionViewDidLoad() {
    this.confData.getSpeakers().subscribe((speakers: any[]) => {
      this.speakers = speakers;
    });
  }

  goToMedicalClaim(){
    this.navCtrl.push(MedicalclaimPage)
  }

    goToPrintingClaim(){
    this.navCtrl.push(PrintclaimPage)
  }
    goToGiftClaim(){
    this.navCtrl.push(GiftclaimPage)
  }

     goToOTClaim(){
    this.navCtrl.push(OvertimeclaimPage)
  }

     goToEntertainmentClaim(){
    this.navCtrl.push(EntertainmentclaimPage)
  }

       goToTravelClaim(){
    this.navCtrl.push(TravelclaimPage)
  }

  goToSessionDetail(session: any) {
    this.navCtrl.push(SessionDetailPage, {
      name: session.name,
      session: session
    });
  }
  goToAbout(){
    this.navCtrl.push(AboutPage)
  }


  goToSpeakerTwitter(speaker: any) {
    this.inAppBrowser.create(`https://twitter.com/${speaker.twitter}`, '_blank');
  }

  openSpeakerShare(speaker: any) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Share ' + speaker.name,
      buttons: [
        {
          text: 'Copy Link',
          handler: () => {
            console.log('Copy link clicked on https://twitter.com/' + speaker.twitter);
            if ((window as any)['cordova'] && (window as any)['cordova'].plugins.clipboard) {
              (window as any)['cordova'].plugins.clipboard.copy('https://twitter.com/' + speaker.twitter);
            }
          }
        },
        {
          text: 'Share via ...'
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });

    actionSheet.present();
  }

  openContact(speaker: any) {
    let mode = this.config.get('mode');

    let actionSheet = this.actionSheetCtrl.create({
      title: 'Contact ' + speaker.name,
      buttons: [
        {
          text: `Email ( ${speaker.email} )`,
          icon: mode !== 'ios' ? 'mail' : null,
          handler: () => {
            window.open('mailto:' + speaker.email);
          }
        },
        {
          text: `Call ( ${speaker.phone} )`,
          icon: mode !== 'ios' ? 'call' : null,
          handler: () => {
            window.open('tel:' + speaker.phone);
          }
        }
      ]
    });

    actionSheet.present();
  }
}

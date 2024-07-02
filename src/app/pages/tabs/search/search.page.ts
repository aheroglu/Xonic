import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonContent } from '@ionic/angular';
import { SearchService } from 'src/app/services/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  @ViewChild(IonContent, { static: true }) content: IonContent;

  selectedSegment: string;
  scrollTop: any;
  hideHeader: boolean;
  searchContentVisible: boolean = false;
  isLoadingShowing: boolean = false;

  searchKey: string;

  searchedUser: any;

  topics = [
    { tag: 'ChatGPT', count: '8,142' },
    { tag: 'Starlink', count: '89.1K' },
    { tag: 'Earthquake', count: '9,332' },
    { tag: 'iPhone 16', count: '143K' },
    { tag: 'BJKvFB', count: '168K' },
    { tag: 'AI', count: '57K' },
    { tag: 'ClimateChange', count: '102K' },
    { tag: 'MarsMission', count: '65K' },
    { tag: 'ElectricCars', count: '24.3K' },
    { tag: 'Bitcoin', count: '85.4K' },
    { tag: 'QuantumComputing', count: '15K' },
    { tag: 'SpaceX', count: '132K' },
    { tag: 'MachineLearning', count: '40K' },
    { tag: 'Blockchain', count: '53K' },
    { tag: 'CyberSecurity', count: '27K' },
    { tag: 'NFT', count: '13K' },
    { tag: 'VirtualReality', count: '11K' },
    { tag: '5G', count: '74K' },
    { tag: 'DataScience', count: '22K' },
    { tag: 'RenewableEnergy', count: '19K' },
  ];

  constructor(
    private searchService: SearchService,
    private alertCtrl: AlertController
  ) {}

  ngOnInit() {
    this.selectedSegment = 'for-you';
  }

  onSearch() {
    if (this.searchKey && this.searchKey.trim()) {
      this.isLoadingShowing = true;

      if (this.searchKey.includes('@') && this.searchKey.length > 1) {
        this.searchService.searchUserByUsername(this.searchKey).subscribe({
          next: (response) => {
            this.isLoadingShowing = false;
            this.searchedUser = response;
          },
          error: (err) => {
            console.error(err);
          },
        });
      } else {
        this.searchService.searchUserByName(this.searchKey).subscribe({
          next: (response) => {
            this.isLoadingShowing = false;
            this.searchedUser = response;
          },
          error: (err) => {
            console.error(err);
          },
        });
      }
    }
  }

  segmentChanged(event: any) {
    this.selectedSegment = event.target.value;
  }

  onScroll(event: any) {
    this.scrollTop = event.detail.scrollTop;

    if (this.scrollTop > 80) {
      this.hideHeader = true;
    } else {
      this.hideHeader = false;
    }
  }

  presentSearchContent() {
    this.searchContentVisible = true;
  }

  closeSearch() {
    this.searchContentVisible = false;
  }

  async presentAlert() {
    const alert = await this.alertCtrl.create({
      header: 'This feature will coming soon.',
      buttons: [
        {
          text: 'Ok',
          role: 'cancel',
        },
      ],
    });

    await alert.present();
  }
}

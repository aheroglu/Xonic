import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.page.html',
  styleUrls: ['./notifications.page.scss'],
})
export class NotificationsPage implements OnInit {
  @ViewChild(IonContent, { static: true }) content: IonContent;

  selectedSegment: string;
  hideHeader: boolean;
  scrollTop: any;
  showScrollButton: boolean;

  notifications = [
    {
      img: 'https://randomuser.me/api/portraits/women/2.jpg',
      text: 'New post notification for',
      username: 'Elon Musk',
      icon: 'create',
    },
    {
      img: 'https://randomuser.me/api/portraits/women/4.jpg',
      text: 'Friend request from',
      username: 'Jane Doe',
      icon: 'person-add',
    },
    {
      img: 'https://randomuser.me/api/portraits/men/5.jpg',
      text: 'New comment on your post by',
      username: 'John Smith',
      icon: 'chatbubble',
    },
    {
      img: 'https://randomuser.me/api/portraits/women/6.jpg',
      text: 'Mentioned you in a post',
      username: 'Emma Watson',
      icon: 'at',
    },
    {
      img: 'https://randomuser.me/api/portraits/men/7.jpg',
      text: 'Liked your photo',
      username: 'Chris Evans',
      icon: 'heart',
    },
    {
      img: 'https://randomuser.me/api/portraits/women/8.jpg',
      text: 'Started following you',
      username: 'Sophia Johnson',
      icon: 'person-add',
    },
    {
      img: 'https://randomuser.me/api/portraits/women/10.jpg',
      text: 'Tagged you in a article',
      username: 'Olivia Green',
      icon: 'pricetag',
    },
    {
      img: 'https://randomuser.me/api/portraits/women/14.jpg',
      text: 'Commented on your status',
      username: 'Isabella Clark',
      icon: 'chatbubble',
    },
    {
      img: 'https://randomuser.me/api/portraits/men/15.jpg',
      text: 'Recommended a friend',
      username: 'Benjamin Lewis',
      icon: 'person-add',
    },
    {
      img: 'https://randomuser.me/api/portraits/men/23.jpg',
      text: 'Liked your comment',
      username: 'Ethan Davis',
      icon: 'heart',
    },
    {
      img: 'https://randomuser.me/api/portraits/men/25.jpg',
      text: 'Sent you a friend request',
      username: 'Daniel Miller',
      icon: 'person-add',
    },
    {
      img: 'https://randomuser.me/api/portraits/women/2.jpg',
      text: 'New post notification for',
      username: 'Elon Musk',
      icon: 'create',
    },
    {
      img: 'https://randomuser.me/api/portraits/women/4.jpg',
      text: 'Friend request from',
      username: 'Jane Doe',
      icon: 'person-add',
    },
    {
      img: 'https://randomuser.me/api/portraits/men/5.jpg',
      text: 'New comment on your post by',
      username: 'John Smith',
      icon: 'chatbubble',
    },
    {
      img: 'https://randomuser.me/api/portraits/women/6.jpg',
      text: 'Mentioned you in a post',
      username: 'Emma Watson',
      icon: 'at',
    },
    {
      img: 'https://randomuser.me/api/portraits/men/7.jpg',
      text: 'Liked your photo',
      username: 'Chris Evans',
      icon: 'heart',
    },
    {
      img: 'https://randomuser.me/api/portraits/women/8.jpg',
      text: 'Started following you',
      username: 'Sophia Johnson',
      icon: 'person-add',
    },
    {
      img: 'https://randomuser.me/api/portraits/women/10.jpg',
      text: 'Tagged you in a article',
      username: 'Olivia Green',
      icon: 'pricetag',
    },
    {
      img: 'https://randomuser.me/api/portraits/women/14.jpg',
      text: 'Commented on your status',
      username: 'Isabella Clark',
      icon: 'chatbubble',
    },
    {
      img: 'https://randomuser.me/api/portraits/men/15.jpg',
      text: 'Recommended a friend',
      username: 'Benjamin Lewis',
      icon: 'person-add',
    },
    {
      img: 'https://randomuser.me/api/portraits/men/23.jpg',
      text: 'Liked your comment',
      username: 'Ethan Davis',
      icon: 'heart',
    },
    {
      img: 'https://randomuser.me/api/portraits/men/25.jpg',
      text: 'Sent you a friend request',
      username: 'Daniel Miller',
      icon: 'person-add',
    },
    {
      img: 'https://randomuser.me/api/portraits/women/2.jpg',
      text: 'New post notification for',
      username: 'Elon Musk',
      icon: 'create',
    },
    {
      img: 'https://randomuser.me/api/portraits/women/4.jpg',
      text: 'Friend request from',
      username: 'Jane Doe',
      icon: 'person-add',
    },
    {
      img: 'https://randomuser.me/api/portraits/men/5.jpg',
      text: 'New comment on your post by',
      username: 'John Smith',
      icon: 'chatbubble',
    },
    {
      img: 'https://randomuser.me/api/portraits/women/6.jpg',
      text: 'Mentioned you in a post',
      username: 'Emma Watson',
      icon: 'at',
    },
    {
      img: 'https://randomuser.me/api/portraits/men/7.jpg',
      text: 'Liked your photo',
      username: 'Chris Evans',
      icon: 'heart',
    },
    {
      img: 'https://randomuser.me/api/portraits/women/8.jpg',
      text: 'Started following you',
      username: 'Sophia Johnson',
      icon: 'person-add',
    },
    {
      img: 'https://randomuser.me/api/portraits/women/10.jpg',
      text: 'Tagged you in a article',
      username: 'Olivia Green',
      icon: 'pricetag',
    },
    {
      img: 'https://randomuser.me/api/portraits/women/14.jpg',
      text: 'Commented on your status',
      username: 'Isabella Clark',
      icon: 'chatbubble',
    },
    {
      img: 'https://randomuser.me/api/portraits/men/15.jpg',
      text: 'Recommended a friend',
      username: 'Benjamin Lewis',
      icon: 'person-add',
    },
    {
      img: 'https://randomuser.me/api/portraits/men/23.jpg',
      text: 'Liked your comment',
      username: 'Ethan Davis',
      icon: 'heart',
    },
    {
      img: 'https://randomuser.me/api/portraits/men/25.jpg',
      text: 'Sent you a friend request',
      username: 'Daniel Miller',
      icon: 'person-add',
    },
  ];

  constructor() {}

  ngOnInit(): void {
    this.selectedSegment = 'all';
  }

  segmentChanged(event: any) {
    this.selectedSegment = event.target.value;
  }

  scrollToTop() {
    this.content.scrollToTop(1000);
  }

  onScroll(event: any) {
    this.scrollTop = event.detail.scrollTop;

    if (this.scrollTop > 80) {
      this.hideHeader = true;
    } else {
      this.hideHeader = false;
    }

    if (this.scrollTop > 500) {
      this.showScrollButton = true;
    } else {
      this.showScrollButton = false;
    }
  }
}

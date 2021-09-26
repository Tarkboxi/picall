import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { FormTabService } from './tab-track/form-tab.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})

export class AuthComponent implements OnInit {
  tabChangeSubscription: Subscription;
  activeLink;
  authLinks = [
    {
      label: 'Login',
      route: '/auth/login',
      index: 0
    }, {
      label: 'Sign up',
      route: '/auth/signup',
      index: 1
    }
  ];

  constructor(private router: Router, tabService: FormTabService) {
    tabService.tabChangeListener.subscribe(index => {
      this.switchTab(index);
    })
  }

  ngOnInit(): void {
    this.activeLink = this.authLinks.find(link => {
      return link.route == this.router.url;
    });
  }

  switchTab(index) {
    this.activeLink = this.authLinks[index];
  }

}

import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  loaderSubscription: Subscription;
  loading: boolean = false;

  constructor(private authService: AuthService, private notificationService: NotificationService) { }

  ngOnInit(): void {

    this.loaderSubscription = this.notificationService.loadingListener
    .subscribe((status => {
      this.loading = status;
    }));

  }

  logout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.loaderSubscription.unsubscribe();
  }

}

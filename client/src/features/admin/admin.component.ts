import { Component, inject } from '@angular/core';
import { AccountService } from '../../core/services/account-service';
import { UserManagementComponent } from './user-management/user-management.component';
import { PhotoManagementComponent } from './photo-management/photo-management.component';

@Component({
  selector: 'app-admin',
  imports: [UserManagementComponent , PhotoManagementComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css',
})
export class AdminComponent {

protected accountService = inject(AccountService);
activeTab = 'photos';
tabs = [
    {label: 'Photo moderation', value: 'photos'},
    {label: 'User management', value: 'roles'},
]

setTab(tab: string) {
    this.activeTab = tab;
}
  
}

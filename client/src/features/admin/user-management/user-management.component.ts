import { Component, ElementRef, inject, signal, ViewChild } from '@angular/core';
import { AdminService } from '../../../core/services/admin-service';
import { User } from '../../../types/User';

@Component({
  selector: 'app-user-management',
  imports: [],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css',
})
export class UserManagementComponent {
@ViewChild('rolesModal') rolesModal!: ElementRef<HTMLDialogElement>;
private adminService = inject(AdminService);
protected users = signal<User[]>([]);
protected availableRoles = ['Member', 'Moderator', 'Admin'];
protected selectedUser: User | null = null;
ngOnInit(): void {
    this.getUserWithRoles();
}

getUserWithRoles() {
    this.adminService.getUserWithRoles().subscribe({
        next: users => this.users.set(users)
    })
}

openRolesModal(user: User) {
    this.selectedUser = user;
    this.rolesModal.nativeElement.showModal();
}


toggleRole(event: Event, role: string) {
  if (!this.selectedUser) return;
  const isChecked = (event.target as HTMLInputElement).checked;
  if (isChecked) {
    this.selectedUser.roles.push(role);
  } else {
    this.selectedUser.roles = this.selectedUser.roles.filter(r => r !== role);
  }
}

updateRoles() {
  if (!this.selectedUser) return;
  this.adminService.updateUserRoles(this.selectedUser.id, this.selectedUser.roles).subscribe({
    next: updatedRoles => {
      this.users.update(users => users.map(u => {
        if (u.id === this.selectedUser?.id) u.roles = updatedRoles;
        return u;
      }));
      this.rolesModal.nativeElement.close();
    },
    error: error => console.log('Failed to update roles', error)
  });
}
}

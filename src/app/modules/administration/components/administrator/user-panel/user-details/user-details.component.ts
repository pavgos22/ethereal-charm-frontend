import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../../../core/services/user.service';
import { RegisteredAccount } from '../../../../../core/models/user.model';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
  user: RegisteredAccount | null = null;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    const uuid = this.route.snapshot.paramMap.get('uuid');
    if (uuid) {
      this.userService.getUserByUuid(uuid).subscribe({
        next: (data) => (this.user = data),
        error: (err) => console.error('Error fetching user details:', err)
      });
    }
  }
}

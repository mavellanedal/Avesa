import { Component } from "@angular/core";
import { provideTranslocoScope } from "@jsverse/transloco";

@Component({
  selector: 'app-user-create-edit',
  standalone: true,
  imports: [],
  providers: [
    provideTranslocoScope('user-tracking'),
  ],
  templateUrl: './user-create-edit.component.html',
  styleUrl: './user-create-edit.component.scss'
})
export default class UserCreateEditComponent {
}

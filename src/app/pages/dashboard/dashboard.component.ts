import { Component } from '@angular/core';
import { NavbarComponent } from "../../shared/navbar/navbar.component";
import { RouterOutlet } from "@angular/router";
import { MembersComponent } from "../members/members.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ RouterOutlet],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}

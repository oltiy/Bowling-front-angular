import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BowlingGameFacade } from 'src/app/domain/application/bowling-game-facade';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomeComponent implements OnInit {
  loginForm?: FormGroup;

  constructor(private fb: FormBuilder, private facade: BowlingGameFacade) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
    });
  }

  setUserName(): void {
    this.facade.setUserName(this.loginForm?.value.username);
  }
}

import {
  Component,
  Input,
  ChangeDetectionStrategy,
  Output,
  EventEmitter,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Throw } from 'src/app/shared/bowling-game.interface';

@Component({
  selector: 'app-frame',
  templateUrl: './frame.component.html',
  styleUrls: ['./frame.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FrameComponent {
  @Input() shots: Throw[] = [];
  @Input() userName?: string;
  @Input() formGroup?: FormGroup;
  @Input() total?: number;
  @Output() frameData = new EventEmitter<number>();
}

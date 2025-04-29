import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FormService } from '../../../core/services/form.service';
import { ProfileService } from '../../../core/services/profile-service.service';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, AfterViewInit, OnDestroy {
  profileForm: FormGroup = this.formService.initProfileForm();
  errorMsg: string | null = null;
  submitted = false;

  @ViewChildren('inputFieldRef', { read: ElementRef })
  private inputs!: QueryList<ElementRef<HTMLInputElement>>;
  private listeners: (() => void)[] = [];

  constructor(
    private formService: FormService,
    private profileService: ProfileService,
    private notifier: NotifierService
  ) {}

  get controls() {
    return this.profileForm.controls as { [k: string]: FormControl };
  }

  ngOnInit(): void {
    this.profileService.getUserProfile().subscribe({
      next: (d) => {
        this.profileForm.patchValue(d || {});
        this.toggleCompanyFields(!!d?.company);
      },
      error: () => (this.errorMsg = 'Nie udało się pobrać danych użytkownika')
    });

    this.controls['company'].valueChanges.subscribe((v) =>
      this.toggleCompanyFields(v)
    );
  }

  ngAfterViewInit(): void {
    this.inputs.changes.subscribe(
      (inputs: QueryList<ElementRef<HTMLInputElement>>) => {
        this.listeners.forEach((off) => off());
        this.listeners = [];

        inputs.forEach((el) => {
          const n = el.nativeElement;
          const f = () => n.classList.add('active');
          const b = () => {
            if (!n.value) n.classList.remove('active');
          };
          n.addEventListener('focus', f);
          n.addEventListener('blur', b);
          this.listeners.push(() => {
            n.removeEventListener('focus', f);
            n.removeEventListener('blur', b);
          });
        });
      }
    );

    this.inputs.notifyOnChanges();
  }

  ngOnDestroy(): void {
    this.listeners.forEach((off) => off());
  }

  private toggleCompanyFields(c: boolean): void {
    if (c) {
      this.controls['companyName'].enable();
      this.controls['nip'].enable();
    } else {
      this.controls['companyName'].disable();
      this.controls['nip'].disable();
      this.controls['companyName'].setValue('');
      this.controls['nip'].setValue('');
    }
  }

  getErrorMessage(ctrl: FormControl): string {
    return this.formService.getErrorMessage(ctrl);
  }

  onSubmit(): void {
    this.submitted = true;
    if (this.profileForm.invalid) return;

    this.profileService
      .updateShippingDetails(this.profileForm.value)
      .subscribe({
        next: () =>
          this.notifier.notify('success', 'Profil zaktualizowany pomyślnie.'),
        error: () => (this.errorMsg = 'Nie udało się zaktualizować profilu.')
      });
  }
}

import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { RegisterCreds, User } from '../../../types/User';
import { AccountService } from '../../../core/services/account-service';
import { JsonPipe } from '@angular/common';
import { TextInput } from "../../../shared/text-input/text-input";
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [FormsModule, ReactiveFormsModule, TextInput],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

protected creds = {} as RegisterCreds;
protected accountService = inject(AccountService);
private fb = inject(FormBuilder)
cancelRegister = output<boolean>();
protected credentialsForm:FormGroup = new FormGroup({});
protected profileForm:FormGroup = new FormGroup({});
protected currentStep = signal(1);
protected router = inject(Router)
protected validationErrors = signal<string[]>([]);

constructor() {
  this.credentialsForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    displayName: ['', Validators.required],
    password: ['', [Validators.required, 
      Validators.minLength(4), Validators.maxLength(8)]],
    confirmPassword: ['', [Validators.required, this.matchValues('password')]]
  });

this.profileForm = this.fb.group({
  gender: ['', Validators.required],
  dateOfBirth: ['', Validators.required],
  city: ['', Validators.required],
  country: ['', Validators.required],
})

  this.credentialsForm.controls['password'].valueChanges.subscribe(() => {
    this.credentialsForm.controls['confirmPassword'].updateValueAndValidity();
  })
}



matchValues(matchTo: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const parent = control.parent;
    if (!parent) return null;

    const matchValue = parent.get(matchTo)?.value;
    return control.value === matchValue ? null : {passwordMismatch: true}
  }
}

getMaxDate() {
  const today = new Date();
  today.setFullYear(today.getFullYear() - 18);
  return today.toISOString().split('T')[0];
}

nextStep() {
  if (this.credentialsForm.valid) {
    this.currentStep.update(prevStep => prevStep + 1);
  }
}

prevStep() {
  this.currentStep.update(prevStep => prevStep - 1);
}

register() {

if (this.profileForm.valid && this.credentialsForm.valid) {
    const formData = {...this.credentialsForm.value, ...this.profileForm.value};
      this.accountService.register(formData).subscribe({
    next:res=>{
      this.router.navigateByUrl('/members')
    },
    error: err=> {
      console.log(err)
      this.validationErrors.set(err)
    }
  })
  }
  

}

cancel() {
  this.cancelRegister.emit(false)
  console.log('cancelled!');
}
}

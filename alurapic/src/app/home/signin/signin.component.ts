import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/core/auth/auth.service';
import { PlatformDetectorService } from 'src/app/core/phatform-detector/platform-detector.service';

@Component({
    templateUrl: './signin.component.html'
})
export class SignInComponent implements OnInit {

    loginForm: FormGroup;   //this property going to controle/validate the form in template file

    @ViewChild('userNameInput') userNameInput: ElementRef<HTMLInputElement>; 
    //ElementRef typed<HTMLInputElement> is a DOM wrapper

    constructor(
        private formBuilder: FormBuilder,
        private authService: AuthService,
        private router: Router,
        private platformDetectorService: PlatformDetectorService) { } //service doesn't need to below a module

    ngOnInit(): void {
        this.loginForm = this.formBuilder.group({ //responsible in create the form and attributes in it
            userName: ['', Validators.required],  //default values, validations
            password: ['', Validators.required]   //check the template
        });

        this.platformDetectorService.isPlatformBrowser() && this.userNameInput.nativeElement.focus();
        //in order to receive the focus
    }

    login() {
        const userName = this.loginForm.get('userName').value;
        const password = this.loginForm.get('password').value;

        this.authService
            .authenticate(userName, password)
            .subscribe(
                // () => this.router.navigateByUrl('user/' + userName), ugly way to do id. concat strings
                () => this.router.navigate(['user', userName]), // better way to navegate
                err => {
                    console.log(err);
                    this.loginForm.reset();

                    // this is JS truck: if the first statement is false, second one it will not be execute
                    this.platformDetectorService.isPlatformBrowser() && 
                        this.userNameInput.nativeElement.focus(); // manipulating the DOM

                    alert('Invalid user name or password');
                }
            );
    }
}
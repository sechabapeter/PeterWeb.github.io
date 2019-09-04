import { Component, OnInit, Output } from '@angular/core';
import { EventEmitter, Button } from 'protractor';
import { RouterModule, Routes, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../services/auth.service';
import * as firebase from 'firebase/app';
import 'firebase/auth';
import { NavController, AlertController, ToastController, LoadingController } from '@ionic/angular';
import { Notification } from 'rxjs';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']

})
export class LoginComponent implements OnInit {
  public isAdmin = false;
  user = {
    EID: '',
    password: '',
  };

  // tslint:disable-next-line:max-line-length
  constructor(private authService: AuthService, private route: Router, private toastrService: ToastrService,
              private alertController: AlertController, private loadingController: LoadingController) {
    (() => {
      'use strict';
      window.addEventListener('load', () => {
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        const forms = document.getElementsByClassName('needs-validation');
        // Loop over them and prevent submission
        const validation = Array.prototype.filter.call(forms, (form) => {
          form.addEventListener('submit', (event) => {
            if (form.checkValidity() === false) {
              event.preventDefault();
              event.stopPropagation();
            }
            form.classList.add('was-validated');
          }, false);
        });
      }, false);
    })();

  }

  signInWithEmail() {

    if (this.user.EID === '' && this.user.password === '') {

      alert('Empty field(s)!');
 
    } else if (this.user.EID  && this.user.password === '') {

      alert('Empty field(s)!');

  } else if (this.user.EID !== '' && this.user.password.length < 6) {
    
      alert('Password weak!, minimum password length is 6 characters');

    } else {

      this.authService.signInRegular(this.user.EID, this.user.password)
        .then((res) => {
          console.log(res);
          this.route.navigate(['/home']);
          this.showSuccess();

        })
        .catch((err) => alert('error: ' + err));
    }

    Notification.createComplete();
  }

  ngOnInit() {
  }

  showSuccess() {
    this.toastrService.success('User   ' + this.user.EID + '  is  successfully logged in');
  }

  async presentLoading_() {
    const loading = await this.loadingController.create({
      spinner: 'lines',
      message: 'Reseting your password...',
      duration: 500,
      translucent: true,
      cssClass: 'custom-class custom-loading',
    });
    await loading.present();

  }

  async _presentAlert_() {
    const alert = await this.alertController.create({
      header: 'Alert',
      message: 'Password Reset Successful, Please check your emails.',
      buttons: ['OK']
    });

    await alert.present();
  }

  async _presentAlert() {
    const alert = await this.alertController.create({
      header: 'Alert',
      message: 'Email address is badly formated or the user does not exist!',
      buttons: ['OK']
    });

    await alert.present();
  }


  async showForgotPassword() {
    const alert = await this.alertController.create({
      header: 'Enter Your Email',
      message: 'A new password will be sent to your email.',
      inputs: [
        {
          name: 'email',
          placeholder: 'Email'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Cancel clicked');
          }
        }, {
          text: 'Submit',
          handler: data => {

            this.authService.forgotPasswordUser(data.email).then(() => {
              this.presentLoading_();
              this._presentAlert_();
              // tslint:disable-next-line:no-shadowed-variable
            }, error => {

              // tslint:disable-next-line:no-shadowed-variable
              const alert = this.alertController.create({
              });

              alert.then(() => {
                this._presentAlert();
              });

            });
          }
        }
      ]
    });

    await alert.present();
  }

  resetPassword() {
    if (!this.user.EID) {
      alert('Type in your email first');
    }
    this.authService.resetPasswordInit(this.user.EID)
      .then(
        () => alert('A password reset link has been sent to your email address, please check your email'),
        (rejectionReason) => alert(rejectionReason))
      .catch(e => alert('An error occurred while attempting to reset your password'));
  }
}



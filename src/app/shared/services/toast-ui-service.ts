import { inject, Service } from '@angular/core';
import { ToastController } from '@ionic/angular';

type ToastOpts = {
  duration: number;
  color:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'success'
    | 'warning'
    | 'danger'
    | 'light'
    | 'medium'
    | 'dark';
  position: 'top' | 'bottom' | 'middle';
};

@Service()
export class ToastUiService {
  private openedToastList: HTMLIonToastElement[] = [];
  private readonly toastController: ToastController = inject(ToastController);

  protected showToast(msg: string, opts: ToastOpts): void {
    console.log('TOAST: ', msg);
    this.toastController
      .create({
        message: msg,
        color: opts.color,
        position: opts.position,
        duration: opts.duration,
      })
      .then((t) => {
        this.openedToastList.push(t);
        t.present().then(() => {
          t.onDidDismiss().then(() => {
            this.openedToastList = this.openedToastList.filter(
              (item) => item != t,
            );
          });
        });
      });
  }

  public infoToast(msg: string): void {
    const default_opts: ToastOpts = {
      duration: 1500,
      position: 'bottom',
      color: 'dark',
    };

    this.showToast(msg, default_opts);
  }

  public warningToast(msg: string): void {
    const default_opts: ToastOpts = {
      duration: 1500,
      position: 'bottom',
      color: 'warning',
    };

    this.showToast(msg, default_opts);
  }

  public dangerToast(msg: string): void {
    const default_opts: ToastOpts = {
      duration: 1500,
      position: 'bottom',
      color: 'danger',
    };

    this.showToast(msg, default_opts);
  }

  public successToast(msg: string): void {
    const default_opts: ToastOpts = {
      duration: 1500,
      position: 'bottom',
      color: 'danger',
    };

    this.showToast(msg, default_opts);
  }
}

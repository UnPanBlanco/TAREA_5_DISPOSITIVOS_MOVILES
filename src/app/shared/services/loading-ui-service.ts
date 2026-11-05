import { inject, Service } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Service()
export class LoadingUiService {
  private loadingController: LoadingController = inject(LoadingController);
  private readonly _MAX_LOADING_TIME: number = 15000;
  public async showLoading(message: string) {
    const loading = await this.loadingController.create({
      message: message,
      duration: this._MAX_LOADING_TIME,
    });

    if (!loading.isOpen) {
      await loading.present();
    }
  }
}

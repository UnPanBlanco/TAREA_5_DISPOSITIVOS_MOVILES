import { CommonModule } from '@angular/common';
import type { OnDestroy, OnInit, WritableSignal } from '@angular/core';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import type { RefresherCustomEvent } from '@ionic/angular';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonList,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToggle,
  IonToolbar,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { star } from 'ionicons/icons';
import type { Subscription, SubscriptionLike } from 'rxjs';

import { NetworkSystemService } from '../../../../shared/services/network-system-service';
import { ToastUiService } from '../../../../shared/services/toast-ui-service';
import type { IUser } from '../../models/IUser.model';
import { HttpUsuariosService } from '../../services/http-usuarios-service';
import { UsuariosFavoritosService } from '../../services/usuarios-favoritos-service';

@Component({
  selector: 'app-lista-usuarios',
  templateUrl: './lista-usuarios.page.html',
  styleUrls: ['./lista-usuarios.page.scss'],
  imports: [
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    CommonModule,
    FormsModule,
    IonList,
    IonItem,
    IonRefresher,
    IonRefresherContent,
    IonIcon,
    IonButton,
    IonToggle,
    ReactiveFormsModule,
  ],
})
export class ListaUsuariosPage implements OnInit, OnDestroy {
  private readonly subscriptionList: SubscriptionLike[] = [];
  private readonly _httpUsuariosService: HttpUsuariosService = inject(HttpUsuariosService);
  private readonly router: Router = inject(Router);
  protected readonly usuariosList: WritableSignal<IUser[]> = signal([]);
  private readonly usuarios_favoritos: WritableSignal<IUser[]> = signal([]);
  private readonly _usuariosFavoritosService = inject(UsuariosFavoritosService);
  private readonly usuarios_a_mostrar: WritableSignal<IUser[]> = signal([]);
  private readonly tglFormCtrl: FormControl<boolean | null> = new FormControl(false);
  private readonly _toastService: ToastUiService = inject(ToastUiService);
  private readonly _networkService: NetworkSystemService = inject(NetworkSystemService);

  private is_conected: boolean = true;

  constructor() {
    addIcons({
      star,
    });
  }
  ngOnInit(): void {
    this.subscriptionList.push(
      this._networkService.networkState.subscribe({
        next: (value) => {
          this.is_conected = value.connected;
          if (!value.connected) {
            this._toastService.warningToast('No hay conexion');
          } else {
            this._toastService.successToast('Hay conexion');
          }
        },
      }),
    );
    this.subscriptionList.push(
      this.tglFormCtrl.valueChanges.subscribe({
        next: () => {
          // console.log("HEY")
          this.cargarUsuariosAMostrar();
        },
      }),
    );
    this.subscriptionList.push(
      this._usuariosFavoritosService.getUsuariosFavoritos.subscribe({
        next: (value) => {
          this.usuarios_favoritos.set(
            value.map((fav) => {
              fav.is_favorite = true;
              return fav;
            }),
          );
          this.cargarUsuariosAMostrar();
        },
      }),
    );
    this.loadData();
  }

  ngOnDestroy(): void {
    this.subscriptionList.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  private loadData(): Subscription|void {
    if (!this.is_conected) {
      this._toastService.warningToast('No hay conexion');

      return;
    }
    const subscription = this._httpUsuariosService.getUserList().subscribe({
      next: (value) => {
        console.log(value);
        this.usuariosList.set(value);
        this.cargarUsuariosAMostrar();
      },
      error: function (err) {
        console.error(err);
      },
    });
    this.subscriptionList.push(subscription);

    return subscription;
  }

  protected cargarUsuariosAMostrar(): void {
    const usuariosList = this.usuariosList();
    const usr_fav_list = this.usuarios_favoritos();
    this.usuariosList.set(
      usuariosList.map((usr) => {
        usr.is_favorite = false;
        const idx = usr_fav_list.findIndex((fav) => fav.id == usr.id);
        if (idx !== -1) {
          usr.is_favorite = true;
        }
        return usr;
      }),
    );
    if (this.tglFormCtrl.value) {
      this.usuarios_a_mostrar.set(usr_fav_list);
    } else {
      this.usuarios_a_mostrar.set(this.usuariosList());
    }
  }

  protected usuarioClickedHandler(seleccionado: IUser): void {
    this.router.navigate(['/usuario', seleccionado.id, seleccionado.username]);
  }

  protected handleRefresh(event: RefresherCustomEvent): void {
    // Resetear
    this.usuariosList.set([]);
    const sub = this.loadData();
    if (!sub) {
      event.target.complete();
      return;
    }
    sub.add(() => {
      // Al cargar, quitarlo
      event.target.complete();
    });
  }

  protected favoritoClickHandler(usr: IUser): void {
    if (this.usuarios_favoritos().find((fav) => fav.id === usr.id))
      this._usuariosFavoritosService.removeUsuarioFavorito(usr);
    else this._usuariosFavoritosService.addUsuarioFavorito(usr);
  }
}

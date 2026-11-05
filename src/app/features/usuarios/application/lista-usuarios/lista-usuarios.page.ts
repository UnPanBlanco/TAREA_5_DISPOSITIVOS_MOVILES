import { CommonModule } from '@angular/common';
import type { OnDestroy, OnInit, WritableSignal } from '@angular/core';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import type {
  RefresherCustomEvent} from '@ionic/angular';
import {
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonRefresher,
  IonRefresherContent,
  IonTitle,
  IonToolbar
} from '@ionic/angular';
import type { Subscription, SubscriptionLike } from 'rxjs';

import type { IUser } from '../../models/IUser.model';
import { HttpUsuariosService } from '../../services/http-usuarios-service';


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
  ],
})
export class ListaUsuariosPage implements OnInit, OnDestroy {
  private readonly subscriptionList: SubscriptionLike[] = [];
  private readonly _httpUsuariosService: HttpUsuariosService = inject(HttpUsuariosService);
  private readonly router: Router = inject(Router);
  protected usuariosList: WritableSignal<IUser[]> = signal([]);

  constructor() {}

  ngOnInit(): void {
    this.loadData();
  }

  ngOnDestroy(): void {
    this.subscriptionList.forEach((sub) => {
      sub.unsubscribe();
    });
  }

  private loadData(): Subscription {
    const subscription = this._httpUsuariosService.getUserList().subscribe({
      next: (value) => {
        console.log(value);
        this.usuariosList.set(value);
      },
      error: function (err) {
        console.error(err);
      },
    });
    this.subscriptionList.push(
      subscription,
    );

    return subscription;
  }

  protected usuarioClickedHandler(seleccionado: IUser): void {
    this.router.navigate(['/usuario', seleccionado.id, seleccionado.username]);
  }

  protected handleRefresh(event: RefresherCustomEvent): void {
    // Resetear
    this.usuariosList.set([]);
    this.loadData().add(() => {
      // Al cargar, quitarlo
      event.target.complete();
    });
  }
}

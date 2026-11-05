import { CommonModule } from '@angular/common';
import type { OnDestroy, OnInit, WritableSignal } from '@angular/core';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IonContent, IonHeader, IonItem, IonList, IonListHeader, IonTitle, IonToolbar } from '@ionic/angular';
import type { SubscriptionLike } from 'rxjs';

import type { IPost } from '../../models/IPost.model';
import { HttpUsuariosService } from '../../services/http-usuarios-service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.page.html',
  styleUrls: ['./usuario.page.scss'],
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonList, IonListHeader, IonItem],
})
export class UsuarioPage implements OnInit, OnDestroy {
  private readonly subcriptionList: SubscriptionLike[] = [];
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly _httpUsuariosService = inject(HttpUsuariosService);
  protected id_usuario: string = '';
  protected nombre: string = '';
  protected posts: WritableSignal<IPost[]> = signal([]);

  constructor() {}

  ngOnInit(): void {
    this.subcriptionList.push(
      this.activatedRoute.params.subscribe({
        next: (value) => {
          this.id_usuario = value['id'];
          this.nombre = value['nombre'];
          this.cargarDatos();
          console.log(value);
        },
      }),
    );
  }
  ngOnDestroy(): void {
    this.subcriptionList.forEach((sub) => sub.unsubscribe());
  }

  protected cargarDatos(): void {
    this.subcriptionList.push(
      this._httpUsuariosService.getUserPosts(this.id_usuario).subscribe({
        next: (value) => {
          this.posts.set(value);
          console.log(value);
        },
      }),
    );
  }
}

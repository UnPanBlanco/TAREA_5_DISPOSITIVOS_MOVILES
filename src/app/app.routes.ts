import type { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'lista-usuarios',
    pathMatch: 'prefix'
  },
  {
    path: 'lista-usuarios',
    loadComponent: () =>
      import('./features/usuarios/application/lista-usuarios/lista-usuarios.page').then((m) => m.ListaUsuariosPage),
  },
  {
    path: 'usuario/:id/:nombre',
    loadComponent: () => import('./features/usuarios/application/usuario/usuario.page').then((m) => m.UsuarioPage),
  },
];

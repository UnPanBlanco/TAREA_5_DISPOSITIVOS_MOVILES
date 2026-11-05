import { Service } from '@angular/core';
import type { Observable } from 'rxjs';

import { HttpCoreService } from '../../../core/http/http-core-service';
import type { IPost } from '../models/IPost.model';
import type { IUser } from '../models/IUser.model';

@Service()
export class HttpUsuariosService extends HttpCoreService {
  public getUserList(): Observable<IUser[]> {
    return this.get<IUser[]>('users');
  }

  public getUserPosts(id: string): Observable<IPost[]> {
    return this.get('posts', { userId: id });
  }
}

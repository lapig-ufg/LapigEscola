import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class AssetService {
  /**
   * Prefixo usado nos caminhos dos assets.
   * Pode ser /static/ em produção (Django)
   * e / em dev (ng serve).
   */
  private prefix = environment.assetPrefix ?? (environment.production ? '/static/' : '/');

  /**
   * Retorna a URL completa de um asset.
   * Exemplo: asset.url('layout/images/lapig_escola.png')
   */
  url(path: string): string {
    // Remove barras duplas e garante consistência
    return `${this.prefix.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
  }
}

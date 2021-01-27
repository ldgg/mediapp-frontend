import { Injectable } from '@angular/core';
import { GenericService } from './generic.service';
import { Usuario } from '../_model/usuario'
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService extends GenericService<Usuario>{

  private usuarioCambio = new BehaviorSubject<Usuario[]>([]);
  private mensajeCambio = new Subject<string>();

  constructor(http: HttpClient) {
    super(
      http,
      `${environment.HOST}/usuarios`);
  }

  listarPageable(p: number, s:number){
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  } 

  getUsuarioCambio() {
    return this.usuarioCambio.asObservable();
  }

  setUsuarioCambio(usuarios: Usuario[]) {    
    this.usuarioCambio.next(usuarios);
  }

  getMensajeCambio(){
    return this.mensajeCambio.asObservable();
  }

  setMensajeCambio(mensaje: string){
    return this.mensajeCambio.next(mensaje);
  }

}

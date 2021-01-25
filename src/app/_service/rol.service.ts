import { Injectable } from '@angular/core';
import { Rol } from '../_model/rol';
import { GenericService } from './generic.service';
import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolService extends GenericService<Rol>{

  private rolCambio = new BehaviorSubject<Rol[]>([]);
  private mensajeCambio = new Subject<string>();  

  constructor(http: HttpClient) { 
    super(
      http,
      `${environment.HOST}/roles`);    
  }

  listarPageable(p: number, s:number){
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  } 

  listarPorUsuario(nombre: string) {
    let token = sessionStorage.getItem(environment.TOKEN_NAME);

    return this.http.post<Rol[]>(`${this.url}/usuario`, nombre, {
      headers: new HttpHeaders().set('Authorization', `bearer ${token}`).set('Content-Type', 'application/json')
    });
  }

  getRolCambio() {
    return this.rolCambio.asObservable();
  }

  setRolCambio(roles: Rol[]) {    
    this.rolCambio.next(roles);
  }

  getMensajeCambio(){
    return this.mensajeCambio.asObservable();
  }

  setMensajeCambio(mensaje: string){
    return this.mensajeCambio.next(mensaje);
  }
}

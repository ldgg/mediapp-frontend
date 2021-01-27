import { Injectable } from '@angular/core';
import { Menu } from '../_model/menu';
import { GenericService } from './generic.service';
import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Subject } from 'rxjs';
import { Rol } from '../_model/rol';

@Injectable({
  providedIn: 'root'
})
export class MenuService extends GenericService<Menu>{

  private menuCambio = new BehaviorSubject<Menu[]>([]);
  private mensajeCambio = new Subject<string>();

  constructor(http: HttpClient) {
    super(
      http,
      `${environment.HOST}/menus`);
  }

  listarPageable(p: number, s:number){
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  } 

  listarPorUsuario(nombre: string) {
    let token = sessionStorage.getItem(environment.TOKEN_NAME);

    return this.http.post<Menu[]>(`${this.url}/usuario`, nombre, {
      headers: new HttpHeaders().set('Authorization', `bearer ${token}`).set('Content-Type', 'application/json')
    });
  }

  // listarRoles(idMenu: number) {
  //   return this.http.get<Rol[]>(`${this.url}/listarrol/${idMenu}`);
  // }

  getMenuCambio() {
    return this.menuCambio.asObservable();
  }

  setMenuCambio(menus: Menu[]) {    
    this.menuCambio.next(menus);
  }

  getMensajeCambio(){
    return this.mensajeCambio.asObservable();
  }

  setMensajeCambio(mensaje: string){
    return this.mensajeCambio.next(mensaje);
  }
 
}

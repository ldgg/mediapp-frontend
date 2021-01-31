import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Menu } from 'src/app/_model/menu';
import { Rol } from 'src/app/_model/rol';
import { MenuService } from 'src/app/_service/menu.service';
import { RolService } from 'src/app/_service/rol.service';

@Component({
  selector: 'app-menu-rol-edicion',
  templateUrl: './menu-rol-edicion.component.html',
  styleUrls: ['./menu-rol-edicion.component.css']
})
export class MenuRolEdicionComponent implements OnInit {

  form: FormGroup;
  id: number;

  roles: Rol[];
  roles$: Observable<Rol[]>;

  idRolSeleccionado: number;
  rolesSeleccionados: Rol[] = [];
  rolesActuales: Rol[];

  menu: Menu;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private menuService: MenuService,
    private rolService: RolService,
    private snackBar : MatSnackBar
  ) { }

  ngOnInit(): void {

    this.form = new FormGroup({
      'id': new FormControl(0),
      'nombre': new FormControl(''),
    })  
    
    this.menu = new Menu();

    this.rolesSeleccionados = [];
    this.roles$ = this.rolService.listar();

    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.initForm();
    });        
  }

  private initForm() {
    
    this.rolesSeleccionados = [];
    this.idRolSeleccionado = 0;

    this.menuService.listarPorId(this.id).subscribe(data => {

      this.menu = data;
      this.rolesActuales = data.roles;

      this.form = new FormGroup({
        'id': new FormControl(data.idMenu),
        'nombre': new FormControl(data.nombre),
      });
    });
  }

  get f() {
    return this.form.controls;
  }
  
  operar() {
    if (this.form.invalid) { return; }

      this.menu.roles = this.rolesSeleccionados;
      this.menuService.modificar(this.menu).pipe(switchMap(() => {
        return this.menuService.listar();
      }))
      .subscribe(data => {
        this.menuService.setMenuCambio(data);
        this.menuService.setMensajeCambio('SE ASIGNARON LOS ROLES');
      });
      
    this.router.navigate(['menu-rol']);  
  }  

  agregarRol() {
    if (this.idRolSeleccionado > 0) {

      let cont = 0;
      for (let i = 0; i < this.rolesSeleccionados.length; i++) {
        let examen = this.rolesSeleccionados[i];
        if (examen.idRol === this.idRolSeleccionado) {
          cont++;
          break;
        }
      }

      if (cont > 0) {
        let mensaje = 'El rol se encuentra en la lista';
        this.snackBar.open(mensaje, "Aviso", { duration: 2000 });
      } else {
        this.rolService.listarPorId(this.idRolSeleccionado).subscribe(data => {
          this.rolesSeleccionados.push(data);
        });

      }
    }

  }

  removerRol(index: number) {
    this.rolesSeleccionados.splice(index, 1);
  }

}

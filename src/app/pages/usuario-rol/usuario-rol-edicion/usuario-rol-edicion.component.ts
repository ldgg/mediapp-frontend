import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Rol } from 'src/app/_model/rol';
import { Usuario } from 'src/app/_model/usuario';
import { RolService } from 'src/app/_service/rol.service';
import { UsuarioService } from 'src/app/_service/usuario.service';

@Component({
  selector: 'app-usuario-rol-edicion',
  templateUrl: './usuario-rol-edicion.component.html',
  styleUrls: ['./usuario-rol-edicion.component.css']
})
export class UsuarioRolEdicionComponent implements OnInit {

  form: FormGroup;
  id: number;

  roles$: Observable<Rol[]>;
  idRolSeleccionado: number;
  rolesSeleccionados: Rol[] = [];
  rolesActuales: Rol[];  

  usuario: Usuario;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private usuarioService: UsuarioService,
    private rolService: RolService,
    private snackBar : MatSnackBar    
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'id': new FormControl(0),
      'username': new FormControl(''),
    }) 

    this.usuario = new Usuario();
    this.roles$ = this.rolService.listar();
    this.rolesSeleccionados = [];

    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.initForm();
    });     
  }

  private initForm() {
    
    this.rolesSeleccionados = [];
    this.idRolSeleccionado = 0;

    this.usuarioService.listarPorId(this.id).subscribe(data => {

      this.usuario = data;
      this.rolesActuales = data.roles;

      this.form = new FormGroup({
        'id': new FormControl(data.idUsuario),
        'username': new FormControl(data.username),
      });
    });
  }

  get f() {
    return this.form.controls;
  }
  
  operar() {
    if (this.form.invalid) { return; }

      this.usuario.roles = this.rolesSeleccionados;
      this.usuarioService.modificar(this.usuario).pipe(switchMap(() => {
        return this.usuarioService.listar();
      }))
      .subscribe(data => {
        this.usuarioService.setUsuarioCambio(data);
        this.usuarioService.setMensajeCambio('SE ASIGNARON LOS ROLES');
      });
      
    this.router.navigate(['usuario-rol']);  
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

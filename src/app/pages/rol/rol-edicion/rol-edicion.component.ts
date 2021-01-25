import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Rol } from 'src/app/_model/rol';
import { RolService } from 'src/app/_service/rol.service';

@Component({
  selector: 'app-rol-edicion',
  templateUrl: './rol-edicion.component.html',
  styleUrls: ['./rol-edicion.component.css']
})
export class RolEdicionComponent implements OnInit {

  form: FormGroup;
  id: number;
  edicion: boolean;  

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private rolService: RolService       
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'id': new FormControl(0),
      'nombre': new FormControl(''),
    })

    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.initForm();
    });        
  }

  private initForm() {
    if (this.edicion) {
      this.rolService.listarPorId(this.id).subscribe(data => {
        this.form = new FormGroup({
          'id': new FormControl(data.idRol),
          'nombre': new FormControl(data.nombre),
        });
      });
    }
  }

  get f() {
    return this.form.controls;
  }
  
  operar() {
    if (this.form.invalid) { return; }

    let rol = new Rol();
    rol.idRol = this.form.value['id'];
    rol.nombre = this.form.value['nombre'];

    if (this.edicion) {     
      this.rolService.modificar(rol).pipe(switchMap(() => {
        return this.rolService.listar();
      }))
      .subscribe(data => {
        this.rolService.setRolCambio(data);
        this.rolService.setMensajeCambio('SE MODIFICO');
      });

    } else {
      //REGISTRAR
      this.rolService.registrar(rol).subscribe(() => {
        this.rolService.listar().subscribe(data => {
          this.rolService.setRolCambio(data);
          this.rolService.setMensajeCambio('SE REGISTRO');
        });
      });
    }

    this.router.navigate(['rol']);

  }

}

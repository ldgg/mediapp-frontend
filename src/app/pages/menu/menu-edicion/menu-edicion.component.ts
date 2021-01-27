import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Menu } from 'src/app/_model/menu';
import { MenuService } from 'src/app/_service/menu.service';

@Component({
  selector: 'app-menu-edicion',
  templateUrl: './menu-edicion.component.html',
  styleUrls: ['./menu-edicion.component.css']
})
export class MenuEdicionComponent implements OnInit {

  form: FormGroup;
  id: number;
  edicion: boolean;  

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private menuService: MenuService    
  ) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'id': new FormControl(0),
      'nombre': new FormControl(''),
      'icono': new FormControl(''),
      'url': new FormControl('')
    })

    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.initForm();
    });    
  }

  private initForm() {
    if (this.edicion) {
      this.menuService.listarPorId(this.id).subscribe(data => {
        this.form = new FormGroup({
          'id': new FormControl(data.idMenu),
          'nombre': new FormControl(data.nombre),
          'icono': new FormControl(data.icono),
          'url': new FormControl(data.url)
        });
      });
    }
  }

  get f() {
    return this.form.controls;
  }
  
  operar() {
    if (this.form.invalid) { return; }

    let menu = new Menu();
    menu.idMenu = this.form.value['id'];
    menu.nombre = this.form.value['nombre'];
    menu.icono = this.form.value['icono'];
    menu.url = this.form.value['url'];

    if (this.edicion) {     
      this.menuService. modificar(menu).pipe(switchMap(() => {
        return this.menuService.listar();
      }))
      .subscribe(data => {
        this.menuService.setMenuCambio(data);
        this.menuService.setMensajeCambio('SE MODIFICO');
      });

    } else {
      //REGISTRAR
      this.menuService.registrar(menu).subscribe(() => {
        this.menuService.listar().subscribe(data => {
          this.menuService.setMenuCambio(data);
          this.menuService.setMensajeCambio('SE REGISTRO');
        });
      });
    }

    this.router.navigate(['menu-rol']);

  }  

}

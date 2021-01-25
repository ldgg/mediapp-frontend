import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { switchMap } from 'rxjs/operators';
import { Menu } from 'src/app/_model/menu';
import { MenuService } from 'src/app/_service/menu.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  displayedColumns = ['idMenu', 'nombre', 'icono', 'url', 'acciones'];
  dataSource: MatTableDataSource<Menu>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  cantidad: number = 0;  

  constructor(
    private menuService: MenuService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.menuService.listarPageable(0, 10).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
    })
    
    this.menuService.getMenuCambio().subscribe(data => {
      this.crearTabla(data);
    })

    this.menuService.getMensajeCambio().subscribe(data => {
      this.snackBar.open(data, 'AVISO', { duration: 2000});
    })

  }

  filtrar(valor: string) {
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  eliminar(idMenu: number) {
    this.menuService.eliminar(idMenu).pipe(switchMap(() => {
      return this.menuService.listar();
    }))
      .subscribe(data => {
        this.menuService.setMenuCambio(data);
        this.menuService.setMensajeCambio('SE ELIMINO');
      });

  }

  crearTabla(data: Menu[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  mostrarMas(e: any) {
    this.menuService.listarPageable(e.pageIndex, e.pageSize).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
    });
  }


}

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { switchMap } from 'rxjs/operators';
import { Rol } from 'src/app/_model/rol';
import { RolService } from 'src/app/_service/rol.service';

@Component({
  selector: 'app-rol',
  templateUrl: './rol.component.html',
  styleUrls: ['./rol.component.css']
})
export class RolComponent implements OnInit {

  displayedColumns = ['idRol', 'nombre', 'acciones'];
  dataSource: MatTableDataSource<Rol>;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  cantidad: number = 0;  

  constructor(
    private rolService: RolService,
    private snackBar: MatSnackBar    
  ) { }

  ngOnInit(): void {
    this.rolService.listarPageable(0, 10).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
    })
    
    this.rolService.getRolCambio().subscribe(data => {
      this.crearTabla(data);
    })

    this.rolService.getMensajeCambio().subscribe(data => {
      this.snackBar.open(data, 'AVISO', { duration: 2000});
    })
  }

  filtrar(valor: string) {
    this.dataSource.filter = valor.trim().toLowerCase();
  }

  eliminar(idRol: number) {
    this.rolService.eliminar(idRol).pipe(switchMap(() => {
      return this.rolService.listar();
    }))
      .subscribe(data => {
        this.rolService.setRolCambio(data);
        this.rolService.setMensajeCambio('SE ELIMINO');
      });

  }

  crearTabla(data: Rol[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  mostrarMas(e: any) {
    this.rolService.listarPageable(e.pageIndex, e.pageSize).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
      this.dataSource.sort = this.sort;
    });
  }

}

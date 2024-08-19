import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { SuppliersService } from '../../services/suppliers.service';
import { Supplier } from '../../interfaces/supplier.interface';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { WebScrapingService } from '../../services/web-scraping.service';
import { ScreeningComponent } from '../../screening/screening.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [MatCardModule, MatTableModule, MatIconModule, MatButtonModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  private supplierService = inject(SuppliersService);
  private webScrapingService = inject(WebScrapingService);
  public suppliersList: Supplier[] = [];
  public displayedColumns: string[] = ["companyName", "taxIdentification", "phoneNumber", "lastEdit", "actions"];

  getSuppliers(){
    this.supplierService.getSuppliers().subscribe({
      next: (data) => {
        if(data.length > 0){
          this.suppliersList = data;
        }
      },
      error: (err) => {
        console.log(err.message)
      }
    })
  }

  addSupplier(){
    this.router.navigate(['/supplier', 0]);
  }
  editSupplier(supplier: Supplier){
    this.router.navigate(['/supplier', supplier.id]);
  }
  deleteSupplier(supplier: Supplier){
    if(confirm("Desea eliminar el proveedor" + supplier.companyName)){
      this.supplierService.deleteSupplier(supplier.id).subscribe({
        next:(data)=>{
          if(data.isSuccess){
            this.getSuppliers();
          }else{
            alert("no se pudo eliminar")
          }
        },
        error:(err)=>{
          console.log(err.message)
        }
      })
    }
  }

  constructor(private router: Router, public dialog: MatDialog){
    this.getSuppliers();
  }

  viewDetails(supplier: Supplier): void {
    this.webScrapingService.searchSanctionsList(supplier.companyName, supplier.country).subscribe({
      next: (response) => {
        this.dialog.open(ScreeningComponent, {
          width: '600px',
          data: { results: response }
        });
      },
      error: (err) => {
        console.error('Error al hacer la solicitud:', err);
      }
    });
  }
}

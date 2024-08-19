import { Component, inject, Input } from '@angular/core';
import { SuppliersService } from '../../services/suppliers.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { SaveSupplier } from '../../interfaces/save-supplier.interface';
import { MatGridList, MatGridTile } from '@angular/material/grid-list';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule, DecimalPipe } from '@angular/common';import { WebScrapingService } from '../../services/web-scraping.service';
import { Supplier } from '../../interfaces/supplier.interface';
import { MatDialog } from '@angular/material/dialog';
import { ScreeningComponent } from '../../screening/screening.component';
; 

@Component({
  selector: 'app-supplier',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatGridList, MatSelectModule, MatError, CommonModule,
    MatDatepickerModule, MatNativeDateModule, ReactiveFormsModule, MatGridTile],
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css'],
  providers: [DecimalPipe]
})
export class SupplierComponent {
  
  @Input('id') supplierId!: number;
  private supplierService = inject(SuppliersService);
  public formBuild = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private decimalPipe = inject(DecimalPipe); // Inyectar DecimalPipe

  public countries: string[] = ['USA', 'Canada', 'Mexico', 'Argentina', 'Russia', 'China', 'Bangladesh', 'Nigeria'];

  public supplierForm: FormGroup = this.formBuild.group({
    companyName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 ./,]+$')]],
    tradeName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9 .,]+$')]],
    taxIdentification: ['', [Validators.required, Validators.pattern('^[0-9]{11}$')]],
    phoneNumber: ['', [Validators.required, Validators.pattern('^\\+?[0-9]{9,15}$')]],
    email: ['', [Validators.required, Validators.email]],
    website: ['', [Validators.pattern('https?://.+')]],
    physicalAddress: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9, -(),.]+$')]],
    country: ['', Validators.required],
    annualBilling: [0, [Validators.required, Validators.min(0)]],
  });

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.supplierId = Number(this.route.snapshot.paramMap.get('id'));

    if (this.supplierId != 0) {
      this.supplierService.getSupplierById(this.supplierId).subscribe({
        next: (data) => {
          this.supplierForm.patchValue({
            companyName: data.companyName,
            tradeName: data.tradeName,
            taxIdentification: data.taxIdentification,
            phoneNumber: data.phoneNumber,
            email: data.email,
            website: data.website,
            physicalAddress: data.physicalAddress,
            country: data.country,
            annualBilling: data.annualBilling,
          });
        },
        error: (err) => {
          console.log(err.message);
        }
      });
    }
  }

  saveSupplier() {
    if (this.supplierForm.invalid) {
      this.supplierForm.markAllAsTouched();
      return;
    }

    const supplier: SaveSupplier = this.supplierForm.value;

    if (this.supplierId == 0) {
      this.supplierService.addSupplier(supplier).subscribe({
        next: (data) => {
          if (data.isSuccess) {
            this.router.navigate(["/"]);
          } else {
            alert("Error al crear");
          }
        },
        error: (err) => {
          console.log(err.message);
        }
      });
    } else {
      this.supplierService.editSupplier(supplier).subscribe({
        next: (data) => {
          if (data.isSuccess) {
            this.router.navigate(["/"]);
          } else {
            alert("Error al editar");
          }
        },
        error: (err) => {
          console.log(err.message);
        }
      });
    }
  }

  goBack() {
    this.router.navigate(["/"]);
  }

  onBlur(event: Event) {
    const target = event.target as HTMLInputElement;
    this.formatCurrency(target);
  }

  formatCurrency(input: HTMLInputElement) {
    const value = parseFloat(input.value.replace(/[^0-9.]/g, ''));
    if (!isNaN(value)) {
      input.value = this.decimalPipe.transform(value, '1.2-2', 'USD') || '';
    }
  }
}
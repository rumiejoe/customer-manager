import { CustomerService } from '../services/customer.service';
import { ICustomer, ICustomers } from '../interfaces/customer';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-customer-modal',
  templateUrl: './edit-customer-modal.component.html',
  styleUrl: './edit-customer-modal.component.css',
})
export class EditCustomerModalComponent {
  dataSource!: ICustomers;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ICustomer,
    public dialogRef: MatDialogRef<EditCustomerModalComponent>,
    private customerService: CustomerService
  ) {}

  ngOnInit(): void {
    this.onGetCustomer();
  }

  editCustomer(data: ICustomer): void {
    this.customerService.editCustomers(data).subscribe({
      next: (updatedCustomer) => {
        const index = this.dataSource.findIndex(
          (c) => c.id === updatedCustomer.id
        );

        if (index !== -1) {
          this.dataSource[index] = updatedCustomer;

        }
        alert('Customer updated successfully');
      },
      error: (err) => {
        alert('Failed to update customer');
      },
    });
  }

  onSave(): void {
    this.customerService.editCustomers(this.data).subscribe({
      next: (updatedCustomer) => {
        this.dialogRef.close(updatedCustomer);
        alert('Customer updated successfully');
      },
      error: (err) => {
        console.error('Error updating customer', err);
      }
    });
  }

  onGetCustomer() {
    this.customerService.getCustomers().subscribe((data) => {
      this.dataSource = data;
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

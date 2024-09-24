import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ICustomer } from '../interfaces/customer';

@Component({
  selector: 'app-view-customer-modal',
  templateUrl: './view-customer-modal.component.html',
  styleUrls: ['./view-customer-modal.component.css']
})
export class ViewCustomerModalComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: ICustomer,
    public dialogRef: MatDialogRef<ViewCustomerModalComponent>
  ) {}

  closeModal(): void {
    this.dialogRef.close();
  }
}

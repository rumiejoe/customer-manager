import { Component, OnInit, ViewEncapsulation, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { Router } from '@angular/router';
import { ChildService } from '../services/child.service';
import { CustomerService } from '../services/customer.service';
import { ICustomer } from '../interfaces/customer';
import { MatDialog } from '@angular/material/dialog';
import { ViewCustomerModalComponent } from '../view-customer-modal/view-customer-modal.component';
import { EditCustomerModalComponent } from '../edit-customer-modal/edit-customer-modal.component';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerComponent implements OnInit {
  searchTerm: string = '';
  displayedColumns: string[] = ['no', 'name', 'email', 'phone', 'address', 'gender', 'actions'];
  dataSource: ICustomer[] = [];
  filteredItems: ICustomer[] = [];
  customers: ICustomer[] =[];

  constructor(
    private router: Router,
    private customerService: CustomerService,
    private changeDetectorRef: ChangeDetectorRef, // Manually triggering change detection
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.getCustomers();
    this.appendCustomers();
  }

  goTo(): void {
    this.router.navigateByUrl('/new-customer');
  }

  openViewModal(customer: ICustomer) {
    this.dialog.open(ViewCustomerModalComponent, {
      width: '400px',
      data: customer,
    });
  }

  openEditModal(customer: ICustomer) {
    const dialogRef = this.dialog.open(EditCustomerModalComponent, {
      width: '400px',
      data: customer,
    });

    dialogRef.afterClosed().subscribe((result: ICustomer | undefined) => {
      if (result) {
        // Update the customers array with the updated customer data
        const index = this.customers.findIndex(c => c.id === result.id);
        if (index !== -1) {
          this.customers[index] = result;
        }
        this.changeDetectorRef.detectChanges(); // Trigger change detection
      }
    });
  }

  goToEdit(element: ICustomer, id: number): void {
    this.customerService.selectedCustomer = element
    this.router.navigateByUrl(`/edit-customer/${id}`);
  }


  initDelete(rowIndex: number): void {
    const customerId = this.filteredItems[rowIndex].id;
    if (customerId) {
      this.customerService.deleteCustomers(customerId).subscribe((data) => {
        alert(JSON.stringify(data));
        this.filteredItems = this.filteredItems.filter((item) => item.id !== customerId);
        this.dataSource = this.filteredItems;
        this.changeDetectorRef.detectChanges();  // Force change detection immediately
      });
    }
  }


  getCustomers(): void {
    this.customerService.getCustomers().subscribe((data) => {
      this.dataSource = data;
      this.filteredItems = [...data];
    });
  }

  async appendCustomers(): Promise<void> {
    this.customerService.getData()?.subscribe((newCustomer) => {
      if (newCustomer) {
        this.dataSource = newCustomer;
        this.filteredItems = newCustomer;
        this.changeDetectorRef.markForCheck();
      }
    });
  }

  onSearch(): void {
    const lowerSearchTerm = this.searchTerm.toLowerCase();
    this.filteredItems = this.dataSource.filter((item: ICustomer) => {
      return (
        item.name.toLowerCase().includes(lowerSearchTerm) ||
        item.email.toLowerCase().includes(lowerSearchTerm) ||
        item.phone.toString().includes(lowerSearchTerm) ||
        item.address.street.toLowerCase().includes(lowerSearchTerm) ||
        item.gender?.toLowerCase().includes(lowerSearchTerm)
      );
    });
    this.changeDetectorRef.detectChanges();
  }
}

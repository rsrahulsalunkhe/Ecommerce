import { Component, OnInit, ViewChild } from '@angular/core';
import { ProductsService } from '../services/products.service';
import { Product, Products } from '../type';
import { ProductComponent } from '../components/product/product.component';
import { CommonModule } from '@angular/common';
import { Paginator, PaginatorModule } from 'primeng/paginator';
import { EditPopupComponent } from '../components/edit-popup/edit-popup.component';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ProductComponent, CommonModule, PaginatorModule, EditPopupComponent, ButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  constructor(private productsService: ProductsService) { }

  @ViewChild('paginator') paginator: Paginator | undefined;

  products: Product[] = [];

  totalRecords: number = 0;
  rows: number = 5;

  displayAddPopup: boolean = false;
  displayEditPopup: boolean = false;

  toggleEditPopup(product: Product) {
    this.selectedProduct = product;
    this.displayEditPopup = true;
  }

  toggleDelete(product: Product) {
    if (!product.id) {
      return;
    }
    this.deleteProduct(product.id)
  }

  toggleAddPopup() {
    this.displayAddPopup = true;

  }

  selectedProduct: Product = {
    id: 0,
    name: '',
    image: '',
    price: '',
    rating: ''
  }

  onConfirmEdit(product: Product) {
    if (!this.selectedProduct.id) {
      return;
    }
    this.editProduct(product, this.selectedProduct.id);
    this.displayEditPopup = false;
  }

  onConfirrmAdd(product: Product) {
    this.addProduct(product);
    this.displayAddPopup = false;
  }

  onProductOutput(product: Product) {
    console.log(product, 'Output');
  }

  onPageChange(event: any) {
    this.fetchProducts(event.page, event.rows);
  }

  resetPaginator() {
    this.paginator?.changePage(0);
  }

  fetchProducts(page: number, perPage: number) {
    this.productsService.getProducts('https://localhost:7261/api/Items', { page, perPage }).subscribe({
      next: (data: Products) => {
        this.products = data.items;
        this.totalRecords = data.total;
      },
      error: (error) => {
        console.log(error);
      }
    })
  }

  editProduct(product: Product, id: number) {
    this.productsService.editProduct(`https://localhost:7261/api/Items/${id}`, product).subscribe(
      {
        next: (data) => {
          console.log(data);
          this.fetchProducts(0, this.rows);
          this.resetPaginator();
        },
        error: (error) => {
          console.log(error);
        }
      }
    );

  }

  deleteProduct(id: number) {
    this.productsService.deleteProduct(`https://localhost:7261/api/Items/${id}`).subscribe(
      {
        next: (data) => {
          console.log(data);
          this.fetchProducts(0, this.rows);
          this.resetPaginator();
        },
        error: (error) => {
          console.log(error);
        }
      }
    );

  }

  addProduct(product: Product) {
    this.productsService.addProduct(`https://localhost:7261/api/Items`, product).subscribe(
      {
        next: (data) => {
          console.log(data);
          this.fetchProducts(0, this.rows);

          this.resetPaginator();
        },
        error: (error) => {
          console.log(error);
        }
      }
    );

  }

  ngOnInit(): void {
    this.fetchProducts(0, this.rows);
  }
}

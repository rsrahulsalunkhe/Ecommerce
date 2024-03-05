import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { Product } from '../../type';
import { FormBuilder, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-edit-popup',
  standalone: true,
  imports: [DialogModule, CommonModule, FormsModule, RatingModule, ButtonModule, ReactiveFormsModule],
  templateUrl: './edit-popup.component.html',
  styleUrl: './edit-popup.component.scss'
})
export class EditPopupComponent implements OnChanges {
  constructor(private formBuilder: FormBuilder) { }

  @Input()
  display: boolean = false;

  @Output()
  displayChange = new EventEmitter<boolean>();

  @Output()
  confirm = new EventEmitter<Product>();

  @Input()
  product: Product = {
    name: '',
    image: '',
    price: '',
    rating: ''
  }

  speciallCharacterVallidator(): ValidatorFn {
    return (control) => {
      const hasSpecialCharacter = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(control.value);
      return hasSpecialCharacter ? { hasSpecialCharacter: true } : null;
    };
  }

  productForm = this.formBuilder.group({
    name: ['', [
      Validators.required, this.speciallCharacterVallidator()
    ]],
    image: ['',],
    price: ['', [Validators.required]],
    rating: ['']
  });

  ngOnChanges() {
    this.productForm.patchValue({
      name: this.product.name,
      image: this.product.image,
      price: this.product.price,
      rating: this.product.rating
    });
  }

  @Input()
  header!: string;

  onConfirm() {
    this.confirm.emit(this.product);
    this.display = false;
    this.displayChange.emit(this.display);
  }

  onCancel() {
    this.display = false;
    this.displayChange.emit(this.display);
  }
}

import { NgClass } from '@angular/common';
import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Icons } from '../icons';

@Component({
  selector: 'app-input',
  imports: [NgClass],
  templateUrl: './input.html',
  styleUrl: './input.css',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputComponent),
      multi: true
    }
  ]
})
export class InputComponent implements ControlValueAccessor, OnInit {
  @Input() label: string = '';
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() disabled: boolean = false;
  @Input() required: boolean = false;
  @Input() id: string = '';
  @Input() class: string = '';
  @Input() icon: string = '';
  
  value: any = '';
  inputId: string = '';

  icons = Icons;
  
  // Callbacks para ControlValueAccessor
  private onChange = (value: any) => {};
  onTouched = () => {};

  ngOnInit() {
    // Gera um ID único se não for fornecido
    this.inputId = this.id || `input-${Math.random().toString(36).substr(2, 9)}`;

    const svgContainer = document.querySelector('svg-container');
    console.log(svgContainer)
    if (!!svgContainer && !!this.icon) {
      svgContainer.innerHTML = this.getIconSvg(this.icon);
      console.log(svgContainer.innerHTML)
    }
  }

  // Implementação do ControlValueAccessor
  writeValue(value: any): void {
    this.value = value || '';
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  // Método para obter o SVG do ícone
  getIconSvg(iconName: string): string {
    return this.icons[iconName as keyof typeof this.icons] || '';
  }

  // Método para lidar com mudanças no input
  onInputChange(event: any): void {
    const value = event.target.value;
    this.value = value;
    this.onChange(value);
    this.onTouched();
  }
}

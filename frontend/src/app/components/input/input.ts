import { NgClass } from '@angular/common';
import { Component, forwardRef, inject, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { IconName, Icons } from '../icons';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

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
  @Input() icon?: IconName;

  private sanitizer = inject(DomSanitizer);
  
  value: any = '';
  inputId: string = '';

  icons = Icons;
  
  // Callbacks para ControlValueAccessor
  private onChange = (value: any) => {};
  onTouched = () => {};

  ngOnInit() {
    // Gera um ID único se não for fornecido
    this.inputId = this.id || `input-${Math.random().toString(36).substr(2, 9)}`;
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
  getIconSvg(iconName: string): SafeHtml {
    const svg = this.icons[iconName as keyof typeof this.icons] || '';
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  }

  // Método para lidar com mudanças no input
  onInputChange(event: any): void {
    const value = event.target.value;
    this.value = value;
    this.onChange(value);
    this.onTouched();
  }

  // Caso seja uma senha, poderá clicar para visualizar
  tooglePassword(): void {
    if (this.icon === 'visibility') {
      this.icon = 'visibilityOff';
      this.type = 'password';
      return;
    }
   
    if (this.icon === 'visibilityOff') {
      this.icon = 'visibility';
      this.type = 'text';
      return;
    }
  }
}

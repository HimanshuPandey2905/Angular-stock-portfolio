import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appLivePrice]',
  standalone: true,
})
export class LivePriceDirective {
  @Input() appLivePrice!: number;
  private prevPrice!: number;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngOnChanges(): void {
    if (this.prevPrice !== undefined) {
      if (this.appLivePrice > this.prevPrice) {
        this.renderer.setStyle(this.el.nativeElement, 'color', 'green');
      } else if (this.appLivePrice < this.prevPrice) {
        this.renderer.setStyle(this.el.nativeElement, 'color', 'red');
      } else {
        this.renderer.setStyle(this.el.nativeElement, 'color', 'black');
      }
    }
    this.prevPrice = this.appLivePrice;
  }
}

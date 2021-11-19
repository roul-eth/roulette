import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
    selector: '[hoverHighlight]',
})

export class HoverHighlightDirective {
    private el: HTMLElement;

    constructor(el: ElementRef){this.el = el.nativeElement;}

    // @Input('hoverHighlight') hoverColor: string;

    @HostListener('mouseenter') onMouseEnter() {
        this.focusOn('rgb(252,247,210,.4)');
    }

    @HostListener('mouseleave')onMouseLeave() {
        this.focusOn('');
    }

    private focusOn(color: string) {
        this.el.style.backgroundColor = color;
    }

}
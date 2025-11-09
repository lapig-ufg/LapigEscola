import { Component } from '@angular/core';
import { StyleClassModule } from 'primeng/styleclass';
import { Router, RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'topbar-widget',
    imports: [CommonModule, RouterModule, StyleClassModule, ButtonModule, RippleModule],
    template: `
        <div class="flex items-center justify-between relative lg:static py-12 px-6 mx-0 md:px-16 lg:px-20 lg:py-12 lg:mx-20">
            <a class="cursor-pointer" (click)="router.navigate(['/landing'])">
                <img
                    src="/layout/images/lapig_escola.png"
                    alt="LapigEscola"
                    class="h-8 w-auto"
                />
            </a>

            <i pStyleClass="@next" enterFromClass="hidden" leaveToClass="hidden" [hideOnOutsideClick]="true" class="pi pi-bars text-4xl! cursor-pointer block md:!hidden text-surface-700 dark:text-surface-100"></i>

            <div
                id="menu"
                class="list-wrapper items-center flex-grow-1 hidden md:flex absolute md:static w-full md:px-0 z-30 shadow md:shadow-none animate-fadein bg-surface-100 dark:bg-surface-700 md:bg-transparent md:dark:bg-transparent"
                [style]="{ top: '80px', right: '0%' }"
            >
                <ul class="list-none p-4 md:p-0 m-0 ml-auto flex md:items-center select-none flex-col md:flex-row cursor-pointer">
                    <a pRipple class="cursor-pointer block md:hidden text-700 text-primary absolute z-5 ms-auto" style="top:1.5rem" pStyleClass="@grandparent" enterFromClass="hidden" leaveToClass="hidden">
                        <i class="pi pi-times text-3xl!"></i>
                    </a>
                    <li>
                        <a (click)="navigate('#home')" pStyleClass="#menu" enterFromClass="hidden" leaveToClass="hidden" pRipple class="flex m-0 md:ml-8 px-0 py-4 text-surface-900 dark:text-surface-0 font-medium leading-normal">
                            <span>Home</span>
                        </a>
                    </li>
                    <li>
                        <a (click)="navigate('#apps')" pRipple pStyleClass="#menu" enterFromClass="hidden" leaveToClass="hidden" class="flex m-0 md:ml-8 px-0 py-4 text-surface-900 dark:text-surface-0 font-medium leading-normal">
                            <span>Apps</span>
                        </a>
                    </li>
                    <li>
                        <a (click)="navigate('#pricing')" pStyleClass="#menu" enterFromClass="hidden" leaveToClass="hidden" pRipple class="flex m-0 md:ml-8 px-0 py-4 text-surface-900 dark:text-surface-0 font-medium leading-normal">
                            <span>Pricing</span>
                        </a>
                    </li>
                    <li>
                        <a (click)="navigate('#features')" pStyleClass="#menu" enterFromClass="hidden" leaveToClass="hidden" pRipple class="flex m-0 md:ml-8 px-0 py-4 text-surface-900 dark:text-surface-0 font-medium leading-normal">
                            <span>Features</span>
                        </a>
                    </li>

                    <li class="flex align-items-center">
                        <button pButton pRipple type="button" label="Buy Now" class="m-0 mt-4 md:mt-0 md:ml-8"></button>
                    </li>
                </ul>
            </div>
        </div>
    `
})
export class TopbarWidget {
    constructor(public router: Router) {}

    navigate(id: any) {
        this.smoothScroll(id);
    }

    smoothScroll(id: any) {
        document.querySelector(id).scrollIntoView({
            behavior: 'smooth'
        });
    }
}

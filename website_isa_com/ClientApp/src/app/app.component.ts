import { animate, state, style, transition, trigger } from '@angular/animations';
import { ViewportScroller } from '@angular/common';
import { Component, ElementRef, OnInit } from '@angular/core';
import { ChildrenOutletContexts, NavigationEnd, NavigationStart, Router, Scroll } from '@angular/router';
import { fadedNavigationAnimation, navigationAnimationDuration } from './animations';
import { ApiService } from './services/api.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    animations: [
        fadedNavigationAnimation,
        trigger('fadeInOut', [
            state('visible', style({
                opacity: 1,
            })),
            state('hidden', style({
                opacity: 0,
                transform: 'translateY(100%)'
            })),
        ])
    ],

})

export class AppComponent implements OnInit {

    public isNavigating: boolean = false;

    constructor(
        private router: Router,
        private elementRef: ElementRef,
        private viewportScroller: ViewportScroller,
        private apiService: ApiService,
        private contexts: ChildrenOutletContexts,
    ) { }

    public getRouteAnimationData() {
        return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
    }

    public onNavigationAnimationDone(event: any) {
        this.isNavigating = false;

    }

    ngOnInit(): void {
        this.elementRef.nativeElement.removeAttribute("ng-version");

        this.apiService.getNavigation().subscribe((result) => {
            console.log("result", result);
        });

        this.router.events.subscribe((val) => {
            if (val instanceof NavigationStart) {
                this.isNavigating = true;
            }

            if (val instanceof Scroll) {
                if (val.position) {
                    // Backward navigation
                    this.viewportScroller.scrollToPosition(val.position);
                }
                else if (val.anchor) {
                    // Anchor navigation
                    this.viewportScroller.scrollToAnchor(val.anchor);
                }
                else {
                    // Forward navigation
                    setTimeout(() => {
                        this.viewportScroller.scrollToPosition([0, 0]);
                    }, navigationAnimationDuration);
                }
            }
        })
    }
}

import { Routes } from '@angular/router';
import { AppLayout } from '@/layout/components/app.layout';
import { Landing } from '@/pages/landing/landing';
import { Notfound } from '@/pages/notfound/notfound';

export const appRoutes: Routes = [
    // Landing page isolada (sem layout)
    {
        path: '',
        loadComponent: () => import('@/pages/landing-home/landing-home.component').then(c => c.LandingHomeComponent)
    },
    // Páginas estáticas com layout da landing
    {
        path: 'page/:slug',
        loadComponent: () => import('@/pages/static-page/static-page-landing.component').then(c => c.StaticPageLandingComponent),
        data: { breadcrumb: 'Página' }
    },
    // Rotas com layout do app
    {
        path: 'app',
        component: AppLayout,
        children: [
            {
                path: '',
                redirectTo: '/app/biomas',
                pathMatch: 'full'
            },
            {
                path: 'biomas',
                loadComponent: () => import('@/pages/home/home.component').then(c => c.HomeComponent),
                data: { breadcrumb: 'Biomas' }
            },
            {
                path: 'page/:slug',
                loadComponent: () => import('@/pages/static-page/static-page.component').then(c => c.StaticPageComponent),
                data: { breadcrumb: 'Página' }
            },
            {
                path: 'bioma/:slug/tema/:temaSlug',
                loadComponent: () => import('@/pages/tema/tema.component').then(c => c.TemaComponent),
                data: { breadcrumb: 'Tema' }
            },
            {
                path: 'bioma/:slug/tema/:temaSlug/:type-:id',
                loadComponent: () => import('@/pages/detail/detail.component').then(c => c.DetailComponent),
                data: { breadcrumb: 'Detalhe' }
            },
            {
                path: 'pages',
                loadChildren: () => import('@/pages/pages.routes'),
            }
        ],
    },
    // Página landing de exemplo (manter para referência)
    { path: 'landing-demo', component: Landing },
    { path: 'notfound', component: Notfound },
    { path: '**', redirectTo: '/notfound' },
];

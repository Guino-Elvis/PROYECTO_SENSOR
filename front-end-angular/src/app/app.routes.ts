import { Routes } from '@angular/router';
import { WelcomeComponent } from './features/welcome/welcome.component';
import { LoginComponent } from './features/auth/login/login.component';
import { authGuard } from './guards/auth.guard';
import { RegisterComponent } from './features/auth/register/register.component';
import { CategoryListComponent } from './admin/page/category/category-list.component';
import { CompanyListComponent } from './admin/page/company/company-list.component';
import { AdministrationUserListComponent } from './admin/page/administration-user/administration-user-list.component';
import { ConfigurationComponent } from './admin/page/configuration/configuration.component';
import { SensorComponent } from './admin/page/sensor/sensor.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'welcome', component: WelcomeComponent, canActivate: [authGuard] },
    { path: 'categoria', component: CategoryListComponent, canActivate: [authGuard] },
    { path: 'company', component: CompanyListComponent, canActivate: [authGuard] },
    { path: 'administration-user', component: AdministrationUserListComponent, canActivate: [authGuard] },
    { path: 'configuration', component: ConfigurationComponent, canActivate: [authGuard] },
    { path: 'sensor', component: SensorComponent, canActivate: [authGuard] },

    { path: '', redirectTo: '/login', pathMatch: 'full' },
    { path: '**', redirectTo: '/login' }
];

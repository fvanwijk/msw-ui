import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MSWModule } from 'msw-ui-angular';
import { setScenario } from 'msw-ui';
import { scenarios } from '../mocks';
import { HomeComponent } from './home/home.component';

const routes: Routes = [{ path: '', component: HomeComponent }];

let mswModule: ModuleWithProviders<MSWModule>[] = [];
if (process.env.NODE_ENV === 'development') {
  mswModule = [MSWModule.forRoot(scenarios, setScenario)];
}

@NgModule({
  imports: [RouterModule.forRoot(routes), mswModule],
  exports: [RouterModule],
})
export class AppRoutingModule {}

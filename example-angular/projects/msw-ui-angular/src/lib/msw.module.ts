import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RestHandler } from 'msw';
import { MSWUIComponent } from './msw-ui.component';

@NgModule({
  declarations: [MSWUIComponent],
  imports: [CommonModule, RouterModule.forRoot([{ path: 'msw', component: MSWUIComponent }])],
  exports: [RouterModule],
})
export class MSWModule {
  static forRoot(
    scenarios: Record<string, RestHandler | RestHandler[]>,
    setScenario: (scenario: string) => void
  ): ModuleWithProviders<MSWModule> {
    return {
      ngModule: MSWModule,
      providers: [
        MSWUIComponent,
        { provide: 'scenarios', useValue: scenarios },
        { provide: 'setScenario', useValue: setScenario },
      ],
    };
  }
}

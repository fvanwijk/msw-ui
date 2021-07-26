import { Component, Inject } from '@angular/core';
import { RestHandler } from 'msw';

@Component({
  selector: 'app-msw-ui',
  templateUrl: './msw-ui.component.html',
  styles: [
    `
      button {
        margin-right: 0.5rem;
      }

      th,
      td {
        text-align: left;
        padding: 0.25rem 1rem;
      }

      th:first-child,
      td:first-child {
        padding-left: 0;
      }
    `,
  ],
})
export class MSWUIComponent {
  constructor(
    @Inject('scenarios') private scenarios: Record<string, RestHandler | RestHandler[]>,
    @Inject('setScenario') public setScenario: (scenario: string) => void
  ) {}

  get globalScenarios() {
    return Object.entries(this.scenarios)
      .filter(([_, handlers]) => Array.isArray(handlers))
      .map(scenario => scenario[0]);
  }

  get scenariosPerHandler() {
    return (Object.values(
      Object.entries(this.scenarios)
        .filter(([_, handlers]) => !Array.isArray(handlers))
        // Group by endpoint (info.header)
        // @ts-ignore
        .reduce((acc, [scenarioName, handler]: [string, RestHandler]) => {
          const key = handler.info.header;
          const [method, path] = key.split(' ');
          if (!(key in acc)) {
            acc[key] = { method, path, scenarios: [] };
          }
          acc[key].scenarios.push(scenarioName);

          return acc;
        }, {} as Record<string, { method: string; path: string; scenarios: string[] }>)
    ) as unknown) as { method: string; path: string; scenarios: string[] }[];
  }
}

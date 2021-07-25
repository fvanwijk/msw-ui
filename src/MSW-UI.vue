<template>
  <div>
    <h1>MSW UI</h1>
    <h2>Set global scenario</h2>
    <button
      v-for="[scenario] of globalScenarios"
      @click="setScenario(scenario)"
    >
      {{ scenario }}
    </button>

    <h2>Set scenario per handler</h2>

    <table>
      <thead>
        <tr>
          <th>Method</th>
          <th>Path</th>
          <th>Scenario</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(endpoint, key) of scenariosPerHandler" :key="key">
          <td>{{ endpoint.method }}</td>
          <td>{{ endpoint.path }}</td>
          <td>
            <button
              v-for="scenario of endpoint.scenarios"
              :key="scenario"
              @click="setScenario(scenario)"
            >
              {{ scenario }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { RestHandler } from 'msw';
import { computed, defineComponent, PropType } from 'vue';
import { setScenario } from '.';

export default defineComponent({
  name: 'Home',
  props: {
    scenarios: {
      required: true,
      type: Object as PropType<Record<string, RestHandler>>,
    },
  },
  setup(props) {
    return {
      scenariosPerHandler: computed(() =>
        Object.entries(props.scenarios)
          .filter(([_, handlers]) => !Array.isArray(handlers))
          // Group by endpoint (info.header)
          .reduce((acc, [scenarioName, { info }]) => {
            const key = info.header;
            const [method, path] = key.split(' ');
            if (!(key in acc)) {
              acc[key] = { method, path, scenarios: [] };
            }
            acc[key].scenarios.push(scenarioName);

            return acc;
          }, {} as Record<string, { method: string; path: string; scenarios: string[] }>)
      ),
      globalScenarios: computed(() =>
        Object.entries(props.scenarios).filter(([_, handlers]) =>
          Array.isArray(handlers)
        )
      ),
      setScenario,
    };
  },
});
</script>

<style>
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
</style>

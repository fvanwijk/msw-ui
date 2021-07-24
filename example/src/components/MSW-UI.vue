<template>
  <div>
    <h1>MSW UI</h1>
    <h2>Set global scenario</h2>
    <button @click="setScenario('success')">Success</button>
    <button @click="setScenario('fail')">Fail</button>

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
        <tr v-for="{ mask, method, header } of handlers" :key="header">
          <td>{{ method }}</td>
          <td>{{ mask }}</td>
          <td>
            <!-- <select @change="setScenarioForHandler(header, $event.target.value)">
              <option v-for="(scenario, scenarioName) of scenariosPerHandler[header]" :key="scenarioName">
                {{ scenarioName }}
              </option>
            </select> -->
            <button
              v-for="(scenario, scenarioName) of scenariosPerHandler[header]"
              :key="scenarioName"
              @click="setScenarioForHandler(header, scenarioName)"
            >
              {{ scenarioName }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { setScenario, setScenarioForHandler } from '../../../src';
import { scenariosPerHandler } from '@/mocks';

export default defineComponent({
  name: 'Home',
  setup() {
    return {
      handlers: computed(() =>
        Object.keys(scenariosPerHandler).map(header => {
          const [method, mask] = header.split(' ');
          return { header, method, mask };
        })
      ),
      scenariosPerHandler,
      setScenario,
      setScenarioForHandler,
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

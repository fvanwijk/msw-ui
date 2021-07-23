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
    <hr />
    <div>
      <button
        @click="
          refetchUser();
          refetchUsers();
        "
      >
        Refresh
      </button>
      <h2>User</h2>
      {{ loadingUser ? 'Loading&hellip;' : '' }}
      {{ errorUser ? 'Error' : '' }}
      <pre v-if="user && !errorUser">{{ JSON.stringify(user, null, 2) }}</pre>
      <h2>Users</h2>
      {{ loadingUsers ? 'Loading&hellip;' : '' }}
      {{ errorUsers ? 'Error' : '' }}
      <pre v-if="users && !errorUsers">{{ JSON.stringify(users, null, 2) }}</pre>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useQuery } from 'vue-query';
import { fetchUser, fetchUsers } from './user-service';
import { setScenario, setScenarioForHandler } from '../msw-ui';
import { scenariosPerHandler } from '@/mocks';

export default defineComponent({
  name: 'Home',
  setup() {
    const {
      isFetching: loadingUser,
      error: errorUser,
      data: user,
      refetch: refetchUser,
    } = useQuery('user', () => fetchUser(123));
    const {
      isFetching: loadingUsers,
      error: errorUsers,
      data: users,
      refetch: refetchUsers,
    } = useQuery('users', fetchUsers);

    return {
      errorUser,
      errorUsers,
      handlers: computed(() =>
        Object.keys(scenariosPerHandler).map(header => {
          const [method, mask] = header.split(' ');
          return { header, method, mask };
        })
      ),
      loadingUser,
      loadingUsers,
      scenariosPerHandler,
      refetchUser,
      refetchUsers,
      setScenario,
      setScenarioForHandler,
      user,
      users,
    };
  },
});
</script>

<style>
pre {
  padding: 1rem;
  background: #dfdfdf;
}

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

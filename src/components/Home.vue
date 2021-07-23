<template>
  <div>
    <h1>Example data</h1>
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
      loadingUser,
      loadingUsers,
      scenariosPerHandler,
      refetchUser,
      refetchUsers,
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
</style>

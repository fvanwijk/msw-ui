<template>
  <div>
    <h1>MSW UI</h1>
    <p>Configure MSW responses using scenarios!</p>
    Set scenario:
    <button @click="setMockScenario('success')">Success</button>
    <button @click="setMockScenario('fail')">Fail</button>
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
import { defineComponent } from 'vue';
import { useQuery } from 'vue-query';
import { fetchUser, fetchUsers } from './user-service';

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

    const setMockScenario = (scenario: string) =>
      fetch('/scenario', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario }),
      });

    return {
      errorUser,
      errorUsers,
      loadingUser,
      loadingUsers,
      refetchUser,
      refetchUsers,
      setMockScenario,
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

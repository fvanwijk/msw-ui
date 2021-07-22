<template>
  <router-view />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useQueryProvider } from 'vue-query';

export default defineComponent({
  name: 'App',
  setup() {
    useQueryProvider({
      // Disable all smart caching and refetching functionalities to mimic default fetch
      defaultOptions: {
        queries: {
          retry: 0,
          cacheTime: 0,
          staleTime: 100000,
          refetchOnMount: false,
          refetchOnWindowFocus: false,
          refetchOnReconnect: false,
          refetchInterval: false,
        },
      },
    });
  },
});
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
</style>

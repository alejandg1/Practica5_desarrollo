<template>
  <div class="app">
    <div class="container">
      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
.app { font-family: Arial, Helvetica, sans-serif; background: #f5f7fb; min-height: 100vh; padding: 40px 0; }
.container { max-width: 480px; margin: 0 auto; background: white; padding: 24px; border-radius: 8px; box-shadow: 0 6px 18px rgba(20,20,50,0.08); }
button { background: #3b82f6; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; }
input { width: 100%; padding: 8px; margin: 6px 0 12px 0; box-sizing: border-box; }
a { color: #2563eb }
</style>

<template>
  <div class="app-account">
    <header>
      <div class="app-account__header">
        <h1>Учетные записи</h1>
        <button>+</button>
      </div>
      <div class="app-account__notify">Для указания нескольких менток одной пары используйте разделитель ;</div>
    </header>
    <main>
      <div class="app-account__body">
        <UserForm />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import UserForm from './components/UserForm.vue';
const props = 'wemwpew';
</script>

<style scoped lang="scss">
.app-account {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;

  &__header {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
    font-size: 2rem;
  }
}
</style>

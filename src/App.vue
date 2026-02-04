<template>
  <div class="app-account">
    <header>
      <div class="app-account__header">
        <h1>Учетные записи</h1>
        <button @click="addNewAccount">+</button>
      </div>
      <div class="app-account__notify">! Для указания нескольких менток одной пары используйте разделитель ;</div>
    </header>
    <main>
      <div class="app-account__body">
        <div
          v-if="store.users.length"
          class="app-account__body-labels"
          :style="{ 'grid-template-columns': `repeat(${countTabs}, 1fr)` }"
        >
          <p>Метки:</p>
          <p>Тип записи:</p>
          <p>Логин:</p>
          <p v-if="countTabs === 4">Пароль:</p>
        </div>
        <UserForm
          v-for="user in store.users"
          :key="user.id"
          :id="user.id"
          :label="user.label"
          :typeRecord="user.typeRecord"
          :login="user.login"
          :password="user.password"
        />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import UserForm from './components/UserForm.vue';
import { useFormStore } from './stores/useFormStore';

const store = useFormStore();

const countTabs = computed(() => {
  return store.checkFieldPassword ? 4 : 3;
});

const addNewAccount = () => {
  store.addUser({
    id: Date.now(),
    label: [],
    login: '',
    password: '',
    typeRecord: '',
  });
};
</script>

<style scoped lang="scss">
.app-account {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;

  &__notify {
    font-weight: bold;
  }

  &__header {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 1rem;
    font-size: 2rem;
  }

  &__body-labels {
    display: none;
    grid-template-rows: 1fr;
    margin-bottom: 1rem;
    grid-gap: 0.5rem;
    font-size: 1rem;
    color: grey;

    @media (min-width: 744px) {
      display: grid;
    }
  }
}
</style>

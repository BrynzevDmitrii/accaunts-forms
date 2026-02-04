import type { UserFormInterface, updatedFieldInterface } from '@/components/type';
import { defineStore } from 'pinia';
import {  ref, watch } from 'vue';

export const useFormStore = defineStore('formStore', () => {
  const users = ref<UserFormInterface[]>([]);
  const usersString = localStorage.getItem('users');
  users.value = usersString !== null ? JSON.parse(usersString) : [];

  const addUser =(user: UserFormInterface)=> {
    users.value.push(user);
  }

  const removeUser=(userId: number) => {
    return  users.value = users.value.filter((user) => user.id !== userId);
  };

  const updateUser =(updatedUser: updatedFieldInterface) => {

    const user = users.value.find((user) => user.id === updatedUser.id);
    if (user && updatedUser && updatedUser.filed && updatedUser.value) {
      users.value[updatedUser.filed] = updatedUser.value;
    }
  };

  watch(
    () => users.value,
    (newUsers) => {
      localStorage.setItem('users', JSON.stringify(newUsers));
      console.log(newUsers);
    },
    { deep: true }
  );

  return { users, addUser, removeUser, updateUser };
},
);

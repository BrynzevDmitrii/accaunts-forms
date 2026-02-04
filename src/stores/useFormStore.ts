import type { UserFormInterface, updatedFieldInterface } from '@/components/type';
import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export const useFormStore = defineStore('formStore', () => {
  const users = ref<UserFormInterface[]>([]);
  const checkFieldPassword = ref(false);
  const usersString = localStorage.getItem('users');
  const checkFieldPasswordString = localStorage.getItem('checkFieldPassword');
  checkFieldPassword.value = checkFieldPasswordString !== null ? JSON.parse(checkFieldPasswordString) : false;
  users.value = usersString !== null ? JSON.parse(usersString) : [];

  const addUser = (user: UserFormInterface) => {
  users.value.push(user);
};

  const removeUser=(userId: number) => {
    return  users.value = users.value.filter((user) => user.id !== userId);
  };

  const updateUser =(updatedUser: updatedFieldInterface) => {
    const user = users.value.find((user) => user.id === updatedUser.id);
    if (user && updatedUser && updatedUser.filed && updatedUser.value) {
      user[updatedUser.filed] = updatedUser.value;
    }
  };


  watch(
    () => users.value,
    (newUsers) => {
      checkFieldPassword.value = newUsers.some((user) => user.typeRecord === 'local');
      localStorage.setItem('users', JSON.stringify(newUsers.map((user) => ({ ...user }))));
      localStorage.setItem('checkFieldPassword', JSON.stringify(checkFieldPassword.value));
    },
    { deep: true }
  );

  return { users, addUser, removeUser, updateUser, checkFieldPassword, checkFieldError };
},
);

import type { UserFormInterface, updatedFieldInterface } from '@/components/type';
import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import * as yup from 'yup';

export const useFormStore = defineStore('formStore', () => {
  const users = ref<UserFormInterface[]>([]);
  const checkFieldPassword = ref(false);
  const errorValidate = ref<Partial<Record<string, string | undefined>>>({});
  const errorsById = ref<Record<number, Partial<Record<string, string | undefined>>>>({});
  const usersString = localStorage.getItem('users');
  const checkFieldPasswordString = localStorage.getItem('checkFieldPassword');
  checkFieldPassword.value = checkFieldPasswordString !== null ? JSON.parse(checkFieldPasswordString) : false;
  users.value = usersString !== null ? JSON.parse(usersString) : [];


  const addUser = (user: UserFormInterface) => {
    users.value.push(user);
  };

  const removeUser = (userId: number) => {
    return (users.value = users.value.filter((user) => user.id !== userId));
  };

  const updateUser = (updatedUser: updatedFieldInterface) => {
    const user = users.value.find((user) => user.id === updatedUser.id);
    if (user && updatedUser && updatedUser.filed && updatedUser.value) {
      // @ts-ignore
      user[updatedUser.filed] = updatedUser.value;
    }
  };

  const setErrorValidate = (error: Partial<Record<string, string | undefined>>) => {
    errorValidate.value = error;
  };

  const getErrorValidate = () => {
    return errorValidate.value;
  };

  // Схема валидации для пользователя
  const userSchema = yup.object({
    label: yup.string().max(50, 'Метки должны содержать максимум 50 символов'),
    typeRecord: yup
      .string()
      .required('Тип записи обязателен для выбора')
      .oneOf(['ldap', 'local'], 'Выберите корректный тип записи'),
    login: yup
      .string()
      .required('Логин обязателен для локального типа')
      .max(100, 'Логин должен содержать максимум 100 символов'),
    password: yup
      .string()
      .required('Пароль обязателен для локального типа')
      .min(6, 'Пароль должен содержать минимум 6 символов')
      .max(100, 'Пароль должен содержать максимум 100 символов'),
  });

  const validateAllUsers = async () => {
    const validations = users.value.map(async (user) => {
      const labelString = Array.isArray(user.label) ? user.label.map((it: any) => it.text).join(';') : (user.label as unknown as string);
      try {
        await userSchema.validate(
          {
            label: labelString,
            typeRecord: user.typeRecord,
            login: user.login,
            password: user.password,
          },
          { abortEarly: false }
        );
        if (errorsById.value[user.id]) delete errorsById.value[user.id];
        return { id: user.id, valid: true };
      } catch (err: any) {
        const details: Record<string, string> = {};
        if (err && err.inner && Array.isArray(err.inner)) {
          err.inner.forEach((e: any) => {
            if (e.path) details[e.path] = e.message;
          });
        } else if (err && err.message) {
          details.general = err.message;
        }
        errorsById.value[user.id] = details;
        return { id: user.id, valid: false, errors: details };
      }
    });

    const results = await Promise.all(validations);
    const valid = results.every((r) => r.valid === true);
    return { valid, errorsById: errorsById.value };
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

  return { users, addUser, removeUser, updateUser, checkFieldPassword, setErrorValidate, getErrorValidate, validateAllUsers, errorsById };
},
);

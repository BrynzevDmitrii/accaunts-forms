<template>
  <div class="user-form">
    <h2>Форма учетной записи</h2>

    <form class="user-form__form">
      <div class="form-group">
        <label for="label">Метки:</label>
        <Field id="label" name="label" type="text" placeholder="Введите метки" v-model="label" />
        <ErrorMessage name="label" class="error-message" />
      </div>

      <div class="form-group">
        <label for="typeRecord">Тип записи:</label>
        <Field id="typeRecord" name="typeRecord" as="select" v-model="typeRecord">
          <option value="">Выберите тип</option>
          <option value="ldap">LDAP</option>
          <option value="local">Локальная</option>
        </Field>
        <ErrorMessage name="typeRecord" class="error-message" />
      </div>

      <div class="form-group">
        <label for="login">Логин:</label>
        <Field id="login" name="login" type="login" placeholder="Введите логин" v-model="login" />
        <ErrorMessage name="login" class="error-message" />
      </div>

      <div v-if="typeRecord === 'local'" class="form-group">
        <label for="password">Пароль:</label>
        <Field id="password" name="password" type="password" placeholder="Введите пароль" v-model="password" />
        <ErrorMessage name="password" class="error-message" />
      </div>

      <button @click="() => store.removeUser(props.id)">
        {{ 'Удалить' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Field, ErrorMessage, useForm } from 'vee-validate';
import * as yup from 'yup';
import type { UserFormInterface } from './type';
import { useFormStore } from '@/stores/useFormStore';

const props = defineProps<UserFormInterface>();

const label = ref(props.label);
const typeRecord = ref(props.typeRecord);
const login = ref(props.login);
const password = ref(props.password);

const store = useFormStore();

const schema = yup.object({
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

useForm({ validationSchema: schema });

watch(
  () => label.value,
  (newValue) => {
    store.updateUser({
      id: props.id,
      filed: 'label',
      value: newValue,
    });
  }
);

watch(
  () => typeRecord.value,
  (newValue) => {
    store.updateUser({
      id: props.id,
      filed: 'typeRecord',
      value: newValue,
    });
  }
);

watch(
  () => login.value,
  (newValue) => {
    store.updateUser({
      id: props.id,
      filed: 'login',
      value: newValue,
    });
  }
);

watch(
  () => password.value,
  (newValue) => {
    store.updateUser({
      id: props.id,
      filed: 'password',
      value: newValue,
    });
  }
);
</script>

<style scoped lang="scss">
.user-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;

  &__form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
  }

  .error-message {
    color: red;
    font-size: 0.8rem;
  }

  input,
  select,
  textarea {
    border: 1px solid red;
    border-radius: 0.25rem;
    padding: 0.5rem;
    outline: none;
  }

  input:invalid,
  select:invalid,
  textarea:invalid {
    border: 1px solid red;
    flex-direction: row;
    gap: 1rem;
  }
}
</style>

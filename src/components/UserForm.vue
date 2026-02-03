<template>
  <div class="user-form">
    <h2>Форма учетной записи</h2>

    <form @submit="onSubmit">
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
        <label for="email">Логин:</label>
        <Field id="email" name="login" type="login" placeholder="Введите логин" v-model="login" />
        <ErrorMessage name="email" class="error-message" />
      </div>

      <div v-if="typeRecord === 'local'" class="form-group">
        <label for="password">Пароль:</label>
        <Field id="password" name="password" type="password" placeholder="Введите пароль" v-model="password" />
        <ErrorMessage name="password" class="error-message" />
      </div>

      <button type="submit" :disabled="isSubmitting">
        {{ isSubmitting ? 'Отправка...' : 'Сохранить' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Field, ErrorMessage, useForm } from 'vee-validate';
import * as yup from 'yup';

const label = ref('');
const typeRecord = ref('');
const login = ref('');
const password = ref('');

const schema = yup.object({
  label: yup.string(),

  typeRecord: yup
    .string()
    .required('Тип записи обязателен для выбора')
    .oneOf(['ldap', 'local'], 'Выберите корректный тип записи'),

  email: yup.string().required('Email обязателен для заполнения').email('Введите корректный email адрес'),

  password: yup
    .string()
    .required('Пароль обязателен для локального типа')
    .min(6, 'Пароль должен содержать минимум 6 символов'),

  terms: yup.boolean().oneOf([true], 'Необходимо согласиться с условиями'),
});

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: schema,
});

const onSubmit = handleSubmit(async (values) => {
  const formData = {
    ...values,
    password: values.typeRecord === 'ldap' ? null : values.password,
  };

  console.log('Форма отправлена:', formData);
  alert('Форма успешно сохранена!');
});
</script>

<style scoped lang="scss"></style>

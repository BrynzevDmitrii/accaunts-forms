<template>
  <div class="user-form">
    <form class="user-form__form">
      <div class="form-group">
        <Field
          id="label"
          name="label"
          type="text"
          placeholder="Введите метки"
          v-model="label"
          :class="{ error: errors.label }"
        />
        <ErrorMessage name="label" class="error-message" />
      </div>

      <div class="form-group">
        <Field id="typeRecord" name="typeRecord" as="select" v-model="typeRecord" :class="{ error: errors.typeRecord }">
          <option value="">Выберите тип</option>
          <option value="ldap">LDAP</option>
          <option value="local">Локальная</option>
        </Field>
        <ErrorMessage name="typeRecord" class="error-message" />
        <span class="required">*</span>
      </div>

      <div class="form-group">
        <Field
          id="login"
          name="login"
          type="login"
          placeholder="Введите логин"
          v-model="login"
          :class="{ error: errors.login }"
        />
        <ErrorMessage name="login" class="error-message" />
        <span class="required">*</span>
      </div>

      <div v-if="typeRecord === 'local'" class="form-group">
        <Field
          id="password"
          name="password"
          type="password"
          placeholder="Введите пароль"
          v-model="password"
          :class="{ error: errors.password }"
        />
        <ErrorMessage name="password" class="error-message" />
        <span class="required">*</span>
      </div>

      <button class="user-form__button-remove" @click="() => store.removeUser(props.id)">
        {{ 'Удалить' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue';
import { Field, ErrorMessage, useForm } from 'vee-validate';
import * as yup from 'yup';
import type { UserFormInterface } from './type';
import { useFormStore } from '@/stores/useFormStore';

const props = defineProps<UserFormInterface>();

const labelValue = computed(() => {
  return props.label.map((item) => item.text).join(';');
});

const label = ref(labelValue.value);
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

const { errors, validate } = useForm({ validationSchema: schema });

const errorValidate = ref('');

const validateAll = async () => {
  const res = await validate();
  if (res.valid) {
    return { valid: true };
  }
  errorValidate.value = errors.value;
  emit('errorValidate', errorValidate.value);
  return { valid: false, errors: errors.value };
};

defineExpose({ validateAll });

watch(
  () => label.value,
  (newValue) => {
    const labelSplit = (newValue as unknown as string).split(';');
    const lableArray = labelSplit.map((item: string) => ({ text: item }));
    store.updateUser({
      id: props.id,
      filed: 'label',
      value: lableArray,
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
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 2rem;

  &__form {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    @media (min-width: 744px) {
      flex-direction: row;
    }
  }

  .form-group {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.1rem;

    .required {
      color: grey;
      position: absolute;
      left: 0.5rem;
      top: -1rem;
    }
  }

  &__button-remove {
    background-color: red;
    color: white;
    border: none;
    border-radius: 0.25rem;
    padding: 0.5rem;
    cursor: pointer;
    height: 2rem;
  }

  .error-message {
    color: red;
    font-size: 0.8rem;
  }

  input,
  select {
    border: 1px solid black;
    border-radius: 0.25rem;
    padding: 0.5rem;
    outline: none;
  }

  input.error,
  select.error {
    border: 1px solid red;
    flex-direction: row;
    gap: 1rem;
  }

  select {
    cursor: pointer;
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    background-image: url('data:image/svg+xml;utf8,<svg fill="black" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>');
    background-repeat: no-repeat;
    background-position: right 10px center;
  }
}
</style>

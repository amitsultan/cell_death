<template>
  <div class="container shadow-lg p-3 mb-5 bg-white rounded">
    <h1 class="title">Login</h1>
    <b-form @submit.prevent="onLogin">
      <b-form-group
        id="input-group-email"
        label-cols-sm="3"
        label="Email:"
        label-for="Email"
      >
        <b-form-input
          id="Email"
          v-model="$v.form.email.$model"
          type="text"
          :state="validateState('email')"
        ></b-form-input>
        <b-form-invalid-feedback>
          email is required
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group
        id="input-group-Password"
        label-cols-sm="3"
        label="Password:"
        label-for="Password"
      >
        <b-form-input
          id="Password"
          type="password"
          v-model="$v.form.password.$model"
          :state="validateState('password')"
        ></b-form-input>
        <b-form-invalid-feedback>
          Password is required
        </b-form-invalid-feedback>
      </b-form-group>

      <b-button
        type="submit"
        variant="primary"
        style="width:100px;display:block;"
        class="mx-auto w-100"
        >Login</b-button
      >
      <div class="mt-2">
        Do not have an account yet?
        <router-link to="register"> Register in here</router-link>
      </div>
    </b-form>
    <b-alert
      class="mt-2"
      v-if="form.submitError"
      variant="warning"
      dismissible
      show
    >
      Login failed: {{ form.submitError }}
    </b-alert>
    <!-- <b-card class="mt-3" header="Form Data Result">
      <pre class="m-0">{{ form }}</pre>
    </b-card> -->
  </div>
</template>

<script>
import { required } from "vuelidate/lib/validators";
export default {
  data() {
    return {
      form: {
        email: "",
        password: "",
        submitError: undefined,
      },
    };
  },
  validations: {
    form: {
      email: {
        required,
      },
      password: {
        required,
      },
    },
  },
  methods: {
    validateState(param) {
      const { $dirty, $error } = this.$v.form[param];
      return $dirty ? !$error : null;
    },
    async Login() {
      try {
        this.axios.defaults.withCredentials = true;
        const response = await this.axios.post(
          this.$root.API_BASE+"/Login",
          {
            email: this.form.email,
            password: this.form.password,
          }
        );
        if (response.status == 200) {
          this.$root.toast(
            "successful",
            "User successfully logged in",
            "success"
          );
          this.$root.store.login(this.form.email);
          this.$router.push("/");
        } else {
          this.$root.toast(
            "Invalid credentials",
            "email or password are incorrect",
            "danger"
          );
        }
      } catch (err) {
        console.log(err);
        this.$root.toast(
          "Invalid credentials",
          "email or password are incorrect",
          "danger"
        );
      }
    },
    onLogin() {
      this.form.submitError = undefined;
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return;
      }
      this.Login();
    },
  },
};
</script>

<style lang="scss">
.container {
  max-width: 450px;
  margin-top: 10px;
}
</style>

<template>
  <div class="container shadow-lg p-3 mb-5 bg-white rounded">
    <h1 class="title">Login</h1>
    <b-form @submit.prevent="onLogin">
      <b-form-group
        id="input-group-Username"
        label-cols-sm="3"
        label="Username:"
        label-for="Username"
      >
        <b-form-input
          id="Username"
          v-model="$v.form.username.$model"
          type="text"
          :state="validateState('username')"
        ></b-form-input>
        <b-form-invalid-feedback>
          Username is required
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
        username: "",
        password: "",
        submitError: undefined,
      },
    };
  },
  validations: {
    form: {
      username: {
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
          this.API_BASE+"/users/login",
          {
            username: this.form.username,
            password: this.form.password,
          }
        );
        if (response.status == 200) {
          this.$root.toast(
            "successful",
            "User successfully logged in",
            "success"
          );
          this.$root.store.login(this.form.username);
          this.axios
            .get(this.API_BASE+"/users/image")
            .then((result) => {
              this.$root.store.setImage(result.data.img);
            })
            .catch((err) => {
              console.log(err);
              this.$root.store.setImage("");
            });
          sessionStorage["MealCount"] = 0;
          sessionStorage["Meal"] = JSON.stringify([])
          this.$router.push("/");
        } else {
          this.$root.toast(
            "Invalid credentials",
            "Username or password are incorrect",
            "danger"
          );
        }
      } catch (err) {
        console.log(err);
        this.$root.toast(
          "Invalid credentials",
          "Username or password are incorrect",
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

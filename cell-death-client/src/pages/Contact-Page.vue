<template>
  <div class='contact_form shadow-lg p-3 mb-5 bg-white rounded'>
    <h2>CONTACT US</h2>
    <p>Email us with any questions or inquiries.
        <br>
        We would be happy to answer your questions and help with any issue.
    </p>
    <b-form @submit.prevent="onSubmit">
      <b-form-group
        id="input-group-Name"
        label-cols-sm="3"
        label="Name:"
        label-for="Name"
      >
        <b-form-input
          id="Name"
          v-model="$v.form.name.$model"
          type="text"
          :state="validateState('name')"
        ></b-form-input>
        <b-form-invalid-feedback>
          name is required
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group
        id="input-group-Email"
        label-cols-sm="3"
        label="Email:"
        label-for="Email"
      >
        <b-form-input
          id="Email"
          type="email"
          v-model="$v.form.email.$model"
          :state="validateState('email')"
        ></b-form-input>
        <b-form-invalid-feedback>
          email is required
        </b-form-invalid-feedback>
      </b-form-group>

    <b-form-group
        id="input-group-Subject"
        label-cols-sm="3"
        label="Subject:"
        label-for="Subject"
      >
        <b-form-input
          id="Subject"
          type="text"
          v-model="$v.form.subject.$model"
          :state="validateState('subject')"
        ></b-form-input>
        <b-form-invalid-feedback>
          subject is required
        </b-form-invalid-feedback>
      </b-form-group>

          <b-form-group
        id="input-group-Message"
        label-cols-sm="3"
        label="Message:"
        label-for="Message"
      >
        <b-form-textarea
          id="Message"
          type="text"
          :rows='6'
          v-model="$v.form.message.$model"
          :state="validateState('message')"
        ></b-form-textarea>
        <b-form-invalid-feedback>
          message is required
        </b-form-invalid-feedback>
      </b-form-group>


      <b-button
        type="submit"
        variant="primary"
        style="width:100px;display:block;"
        class="mx-auto w-100"
        >Submit</b-button
      >
    </b-form>
  </div>
</template>

<script>
import { required } from "vuelidate/lib/validators";
export default {
  data() {
    return {
      form: {
        name: "",
        email: "",
        subject: "",
        message: "",
        submitError: undefined,
      },
    };
  },
  validations: {
    form: {
      name: {
        required,
      },
      email: {
        required,
      },
      subject: {
          required,
      },
      message:{
          required,
      }
    },
  },
  methods: {
    validateState(param) {
      const { $dirty, $error } = this.$v.form[param];
      return $dirty ? !$error : null;
    },
    sendEmail(){

      },
    onSubmit() {
      this.form.submitError = undefined;
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        return;
      }
      this.sendEmail();
    },
  },
}
</script>

<style>
.contact_form{
    max-width: 450px;
    margin: auto;
    margin-top: 10px;
}
</style>
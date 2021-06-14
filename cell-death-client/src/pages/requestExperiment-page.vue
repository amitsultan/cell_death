<template>
<div class='container-request'>
  <h3 class='blurMessage' v-if='!$root.store.email'>Please log in to send requests</h3>
  <div class="container-request shadow-lg p-3 mb-5 bg-white rounded" 
  v-blur='blurConfig'>
    <h1 class="title">Request experiment</h1>
    <b-form @submit.prevent="onRequest">
          <div v-if="form.projectRar" class="progress">
      <div
        class="progress-bar progress-bar-info progress-bar-striped"
        role="progressbar"
        :aria-valuenow="form.progress"
        aria-valuemin="0"
        aria-valuemax="100"
        :style="{ width: form.progress + '%' }"
      >
        {{ form.progress }}%
      </div>
    </div>
      <b-form-group
        id="input-group-ProjectRar"
        label-cols-sm="3"
        label="Project rar:"
        label-for="ProjectRar"
      >
      <b-form-file
      v-model="form.projectRar"
      :state="Boolean(form.projectRar)"
      placeholder="Choose a file or drop it here..."
      drop-placeholder="Drop file here..."
      accept='.zip, .rar'
      :disabled="!$root.store.email"
    ></b-form-file>
        <b-form-invalid-feedback>
          File is required
        </b-form-invalid-feedback>
      </b-form-group>

      <b-form-group>
        <b-form-checkbox 
          v-model="form.selected" 
          name="some-radios" 
          :value=true>Include extra channel
        </b-form-checkbox>
      </b-form-group>



      <b-form-group
        id="input-group-ExtraChannelRar"
        label-cols-sm="3"
        label="Extra channel rar:"
        label-for="ExtraChannel"
        :hidden='!form.selected'
      >
      <b-form-file
      v-model="form.extraChannel"
      :state="Boolean(form.extraChannel)"
      placeholder="Choose a file or drop it here..."
      drop-placeholder="Drop file here..."
      accept='.zip, .rar'
      :disabled="!$root.store.email"
    ></b-form-file>
        <b-form-invalid-feedback>
          File is required
        </b-form-invalid-feedback>
      </b-form-group>

      <b-button
        type="submit"
        variant="primary"
        style="width:100px;display:block;"
        class="mx-auto w-100"
        :disabled="clickButton"
        >Request</b-button
      >
  
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
</div>
</template>

<script>
import { required } from "vuelidate/lib/validators";
import UploadService from "../services/UploadFilesService";

export default {
  data() {
    return {
        form: {
        projectRar: undefined,
        extraChannel: undefined,
        progress: 0,
        message: "",
        selected: false,
        fileInfos: [],
        submitError: undefined,
      },
      clickButton: false,
      blurConfig: {
        isBlurred: !this.$root.store.email,
        opacity: 0.2,
        filter: 'blur(1.4px)',
        transition: 'all 1.3s linear'
      }
    };
  },
  validations: {
    form: {
      projectRar: {
        required,
      }
    },
  },
  methods: {
    validateState(param) {
      const { $dirty, $error } = this.$v.form[param];
      return $dirty ? !$error : null;
    },
    async request() {
      this.form.progress = 0;
      UploadService.upload(this.form.projectRar, this.form.extraChannel, event => {
        this.form.progress = Math.round((100 * event.loaded) / event.total);
      })
        .then(response => {
          this.clickButton = false;
          this.$root.toast(
            "successful",
            "File successfully sent",
            "success"
          );
        })
        .catch((err) => {
          this.clickButton = false;
          this.form.progress = 0;
          this.form.message = "Could not upload the file!";
          this.$root.toast(
            "Error",
            this.form.message,
            "danger"
          );
          this.form.projectRar = undefined;
        });
    },
    onRequest() {
      this.form.submitError = undefined;
      this.clickButton = true;
      this.$v.form.$touch();
      if (this.$v.form.$anyError) {
        this.clickButton = false;
        return;
      }
      this.request();
    },
  },
};
</script>

<style lang="scss">
.container-request {
  max-width: 600px;
  margin: auto;
  margin-top: 10px;
}
.blurMessage{
  position: fixed;
  text-align: center;
  z-index: 1;
  margin: 5% auto; /* Will not center vertically and won't work in IE6/7. */
  left: 0;
  right: 0;
}
</style>

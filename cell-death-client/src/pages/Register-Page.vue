<template>
<div class="container shadow-lg p-3 mb-5 bg-white rounded">
    <h1 class="title">Register</h1>
    <b-form @submit.prevent="onRegister" @reset.prevent="onReset">

        <b-form-group id="input-group-email" label-cols-sm="3" label="Email:" label-for="email">
            <b-form-input id="email" type="text" v-model="$v.form.email.$model" :state="validateState('email')"></b-form-input>
            <b-form-invalid-feedback v-if="!$v.form.email.required">
                Email is required
            </b-form-invalid-feedback>
            <b-form-invalid-feedback v-else-if="!$v.form.email.valid">
                Email must be vaild! (Exmaple: some@domain.com)
            </b-form-invalid-feedback>
        </b-form-group>

        <b-form-group id="input-group-first-name" label-cols-sm="3" label="First name:" label-for="firstname">
            <b-form-input id="firstname" v-model="$v.form.firstName.$model" type="text" :state="validateState('firstName')"></b-form-input>
            <b-form-invalid-feedback v-if="!$v.form.firstName.required">
                First name is required
            </b-form-invalid-feedback>
        </b-form-group>

        <b-form-group id="input-group-last-name" label-cols-sm="3" label="Last name:" label-for="lastname">
            <b-form-input id="lastname" v-model="$v.form.lastName.$model" type="text" :state="validateState('lastName')"></b-form-input>
            <b-form-invalid-feedback v-if="!$v.form.lastName.required">
                Last name is required
            </b-form-invalid-feedback>
        </b-form-group>
        <b-form-group id="input-group-Password" label-cols-sm="3" label="Password:" label-for="password">
            <b-form-input id="password" type="password" autocomplete="new-password" v-model="$v.form.password.$model" :state="validateState('password')"></b-form-input>
            <b-form-invalid-feedback v-if="!$v.form.password.required">
                Password is required
            </b-form-invalid-feedback>
            <b-form-text v-else-if="$v.form.password.$error" text-variant="info">
                Your password should be <strong>strong</strong>. <br />
                For that, your password should be also:
            </b-form-text>
            <b-form-invalid-feedback v-if="$v.form.password.required && !$v.form.password.length">
                Have length between 5-10 characters long
            </b-form-invalid-feedback>
            <b-form-invalid-feedback v-else-if="!$v.form.password.regex">
                Password must contain atleast one character, number and special character
            </b-form-invalid-feedback>
        </b-form-group>

        <b-form-group id="input-group-confirmedPassword" label-cols-sm="3" label="Confirm Password:" label-for="confirmedPassword">
            <b-form-input id="confirmedPassword" type="password" v-model="$v.form.confirmedPassword.$model" :state="validateState('confirmedPassword')"></b-form-input>
            <b-form-invalid-feedback v-if="!$v.form.confirmedPassword.required">
                Password confirmation is required
            </b-form-invalid-feedback>
            <b-form-invalid-feedback v-else-if="!$v.form.confirmedPassword.sameAsPassword">
                The confirmed password is not equal to the original password
            </b-form-invalid-feedback>
        </b-form-group>

        <div class='buttons'>

            <b-button type="reset" variant="danger" style="width:240px;margin-right:5px;">Reset</b-button>
            <b-button type="submit" variant="primary" style="width:240px; margin-left:5px;">Register</b-button>
        </div>
        <div class="mt-2">
            You have an account already?
            <router-link to="login"> Log in here</router-link>
        </div>
    </b-form>
    <b-alert class="mt-2" v-if="form.submitError" variant="warning" dismissible show>
        Register failed: {{ form.submitError }}
    </b-alert>
    <!-- <b-card class="mt-3 md-3" header="Form Data Result">
      <pre class="m-0"><strong>form:</strong> {{ form }}</pre>
      <pre class="m-0"><strong>$v.form:</strong> {{ $v.form }}</pre>
    </b-card> -->
</div>
</template>

<script>
import {
    required,
    minLength,
    maxLength,
    alpha,
    sameAs,
    email
} from "vuelidate/lib/validators";

export default {
    name: "Register",
    data() {
        return {
            form: {
                firstName: "",
                lastName: "",
                password: "",
                confirmedPassword: "",
                email: "",
                submitError: undefined
            },
            errors: [],
            validated: false
        };
    },
    validations: {
        form: {
            firstName: {
                required
            },
            lastName: {
                required
            },
            password: {
                required,
                length: (p) => minLength(5)(p) && maxLength(10)(p),
                regex: (p) => /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{5,10}$/.test(p)
            },
            confirmedPassword: {
                required,
                sameAsPassword: sameAs("password")
            },
            email: {
                valid: (e) => /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(e),
                required
            }
        }
    },
    methods: {
        validateState(param) {
            const {
                $dirty,
                $error
            } = this.$v.form[param];
            return $dirty ? !$error : null;
        },
        async Register() {
            try {
                const response = await this.axios.post(
                    this.$root.API_BASE + "Register", {
                        email: this.form.email,
                        password: this.form.password,
                        firstname: this.form.firstName,
                        lastname: this.form.lastName,
                    }
                );
                if(response.status === 200){
                    this.$root.toast(
                        "successful",
                        "User registerd successfully",
                        "success"
                    );
                    this.$router.push("/Login");
                }else{
                    this.form.submitError = response.data.message;   
                }
            } catch (err) {
                this.form.submitError = err.response.data.message;
            }
        },
        onRegister() {
            this.$v.form.$touch();
            if (this.$v.form.$anyError) {
                return;
            }
            // console.log("register method go");
            this.Register();
        },
        onReset() {
            this.form = {
                username: "haim",
                firstName: "Haim",
                lastName: "Reyes",
                password: "aA123456!",
                confirmedPassword: "aA123456!",
                email: "reyes@post.bgu.ac.il",
                submitError: undefined
            };
            this.$nextTick(() => {
                this.$v.$reset();
            });
        }
    }
};
</script>

<style lang="scss" scoped>
.container {
    max-width: 500px;
    margin-top: 10px;
}

.buttons {
    display: flex;
}
</style>

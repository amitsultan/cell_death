<template>
<div>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item active :to="{ name: 'main' }">Home</b-nav-item>
          <b-nav-item :to="{ name: 'Experiments'}">Experiments</b-nav-item>
          <b-nav-item :to="{ name: 'requestPage'}">Request-experiment</b-nav-item>
          <b-nav-item :to="{ name: 'AboutPage'}">About</b-nav-item>
          <b-nav-item :to="{ name: 'ContactPage'}">Contact</b-nav-item>
        </b-navbar-nav>
  
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item-dropdown right v-if="!$root.store.email" text="Hello Guest">
            <div>  
              <b-dropdown-item :to="{ name: 'login' }">Login</b-dropdown-item>
              <b-dropdown-item :to="{ name: 'register' }">Sign up</b-dropdown-item>
            </div>
          </b-nav-item-dropdown>

          <!-- <b-nav-item-dropdown right v-if="$root.store.email" text="User"> -->
          <b-nav-item right v-if="$root.store.email" :to="{ name: 'ProfilePage' }">
           <b> {{ $root.store.firstName }} {{ $root.store.lastName }} </b>
          </b-nav-item>
          <b-nav-item-dropdown right v-if="$root.store.email">
            <b-dropdown-item :to="{ name: 'ProfilePage' }">Profile Page</b-dropdown-item>
            <b-dropdown-item v-on:click='Logout'>Sign Out</b-dropdown-item>
          </b-nav-item-dropdown>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
  <router-view />
</div>
</template>

<script>
export default {
 name: "App",
  mounted(){
    console.log("session: "+this.$root.store.email)
  },
  methods:{
    async Logout() {
        this.axios.defaults.withCredentials = true;
        const response = await this.axios.post(
          this.$root.API_BASE+"signout"
        );
        if(response.status == 200){
          this.$root.store.logout();
          this.$root.toast("Logout", "User logged out successfully", "success");
          this.$router.push("/").catch(() => {
            this.$forceUpdate();
          });
        }else{
          this.$root.toast("Logout", "Failed to logout, please contact us", "danger");
        }
      },
  }
}
</script>

<style lang="scss">
  @import "@/scss/form-style.scss";
</style>
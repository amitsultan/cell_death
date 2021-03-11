<template>
<div>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item active :to="{ name: 'Home' }">Home</b-nav-item>
          <b-nav-item active :to="{ name: 'Experiments'}">Experiments</b-nav-item>
          <b-nav-item active :to="{ name: 'requestPage'}">Request-experiment</b-nav-item>
          <b-nav-item active :to="{ name: 'AboutPage'}">About</b-nav-item>
          <b-nav-item active :to="{ name: 'ContactPage'}">Contact</b-nav-item>
        </b-navbar-nav>
        <!-- Modal for requesting experiemnts   -->
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-form>
            <b-form-input size="sm" class="mr-sm-2" placeholder="Search"></b-form-input>
            <b-button size="sm" class="my-2 my-sm-0" type="submit">Search</b-button>
          </b-nav-form>
          <b-nav-item-dropdown right>
            <!-- Using 'button-content' slot -->
            <template v-slot:button-content>
              <em>User</em>
            </template>
            <div v-if="$root.store.email">
              <b-dropdown-item href="#">Profile</b-dropdown-item>
              <b-dropdown-item v-on:click='Logout'>Sign Out</b-dropdown-item>
            </div>
            <div v-else>
              <b-dropdown-item :to="{ name: 'login' }">Login</b-dropdown-item>
              <b-dropdown-item :to="{ name: 'register' }">Sign up</b-dropdown-item>
            </div>
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
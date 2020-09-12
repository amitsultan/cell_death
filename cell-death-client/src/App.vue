<template>
<div id='app'>
  <img alt="Vue logo" src="./assets/logo.png">
  <HelloWorld msg="Welcome to Your Vue.js App"/>
</div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: "App",
  components: {
    HelloWorld
  },
  mounted(){
     this.axios.get('http://localhost:8081/test').then((res)=>{
       alert(res.data)
     }).catch((err)=>{
       console.log(err)
     })
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

<template>
<div>
  
</div>
</template>

<script>
export default {
 name: "App",
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

</style>
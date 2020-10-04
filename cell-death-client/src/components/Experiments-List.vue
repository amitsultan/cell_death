<template>
    <div class="list-container shadow-lg p-3 mb-5 bg-white rounded">
      <h6 class='list-title'>Experiments</h6>
      <ul class='list'>
          <li v-for="exp in experiments" :key="exp.serial" v-on:click='experimentOnClick'> 
            <span>{{ exp }}</span>
          </li>
      </ul>
    </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  data(){
      return{
    }
  },
  props:{
      experiments: Array
},methods:{
        experimentOnClick(event){
          let experiment = event.target.innerText
          this.$emit('clicked',experiment)
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.list-container{
    width: 200px;
    margin-left: 10px;
    margin-top: 10px;
}
.list-title{
    text-align: center;
}
ul {
  list-style:none;
  padding-left: 1em;
}
li::before{
    content: '';
    display: inline-block;
    height: 1em;
    width: 1em;
    background-image: url('../../public/clipboard-list-solid.svg');
    background-size: contain;
    background-repeat: no-repeat;
    margin-right:0.5em;
}

</style>

<template>
  <div class="container left shadow-lg p-3 mb-5 bg-white rounded">
    <h1>hello {{this.$root.store.first_name?this.$root.store.first_name+'!':'guest,'}}</h1><br>
    <h1>My Experiments</h1>
      <div class="container shadow-lg p-3 mb-5 bg-white rounded">
    <div  v-if='Object.keys(this.experiments).length==0'>  no experiments for you... yet!</div>
    <ul>
      {{this.experiments}}
      <li :v-for="experiment in computed_experiments" v-bind:key="experiment">
        {{experiment?experiment:experiment+"."}}
        <b-button v-on:click="test2()" class="add_btn">
          Remove Permissions
        </b-button>
        <b-button v-on:click="test()" class="add_btn">
          Add Permissions
        </b-button>
      </li>
      <!-- <ExperimentItem :v-if="experiment" :name="experiment">
       </ExperimentItem>-->
    </ul>
    </div>
  </div>
</template>

<script>
// import ExperimentItem from '../components/Experiment_Item.vue'
export default {
    name: 'ProfilePage',
    data() {
      return {
        experiments: []
      }
    },
    computed:{
      // permissions: this.experiments.permissions
      computed_experiments: function(){return this.experiments}

    },
    components:{
     // ExperimentItem
    },
    methods: {
        async getUserExperiments(id){
            let val = "2021-05-02"
            let res = Array()
            res.push(val)
            return res
        },
        test(){
            // this.permissions = ["loading one...","loading two...","loading three..."]
            this.experiments.push("another one")
            for (val in this.experiments)
              console.log(val)
            console.log(this.experiments)
        },
        test1(){console.log(this.experiments)},
        test2(){
            // this.permissions = ["loading one...","loading two...","loading three..."]
            this.experiments.pop()
            console.log(this.experiments)
        },
    },
    props:{

    },
    async beforeMount(){
      // experiments = {'2021-05-02':{permissions: ["reyes@post.co.il"]}}
      this.experiments = await this.getUserExperiments(0)
      console.log(this.experiments)
    },
};
</script>

<style lang="scss">
.container {
  max-width: 80%;
  margin-top: 10px;
}
.add_btn{
    color: #000000;
    float: right;
    background-color: #CCCCCC;
    margin-right: 10px;
}
.add_btn.hover{
    color: #FFFFFF;
    float: right;
    background-color: #d65151;
}
li::before{
    content: '';
    font-weight: bold;
}
.add_btn{
    color: #000000;
    float: right;
    background-color: #CCCCCC;
}
</style>

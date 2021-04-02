<template>
  <div class="container shadow-lg p-3 mb-5 bg-white rounded">
      <b>{{name}}</b>        
      <b-button class="add_btn" v-on:click="test()">Add Permissions</b-button><br>
    &#9;<ul>
            <li :v-if="Object.keys(this.permissions).length!=0" 
            :v-for="permission in this.permissions" 
            :key="value"
            class="premissions_list">
                {{value?value:'loading...'}}<b-button v-on:click="test2()" class="remove_btn">Remove</b-button>
            </li>
        </ul>
  </div>
</template>

<script>
export default {
    name: 'experiment_item',
    data() {
        return {
            permissions(){ return[]}
        };
    },
    computed:{
      // permissions: this.experiments.permissions
    },
    components:{
    },
    methods: {
        test(){
            // this.permissions = ["loading one...","loading two...","loading three..."]
            this.permissions.push("another one")
        },
        test2(){console.log(this.permissions)},
        async getPermissions(experiment){return ["loading one...","loading two...","loading three..."]},
        async givePremission(id,experiment){return undefined},
        async deleteExperiment(experiment){}
    },
    props:{
        name: {
            type: String,
            default: "..."
        },
    },
    async mounted() {
        this.permissions = await this.getPermissions(this.name)
        console.log(this.permissions)
    },
};
</script>

<style lang="scss">
.container {
  max-width: 20%;
  margin-top: 10px;
}
.remove_btn{
    color: #000000;
    float: right;
    background-color: #CCCCCC;
}
.remove_btn.hover{
    color: #FFFFFF;
    float: right;
    background-color: #d65151;
}
.premissions_list{
    padding-top: 30px;
    padding-bottom: 10px
}
.premissions_list::before{
    content: '  ';
    font-weight: bold;
}
</style>

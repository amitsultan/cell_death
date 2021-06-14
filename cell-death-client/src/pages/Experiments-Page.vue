<template>
<div>
    <div class='list-container'>
        <Experiments_List :experiments='experiments' @clicked="onClickListItem"/>
    </div>
    <div class='experiment-view'>
      <Experiment v-if="showExperiment" :id='id' :key='id'></Experiment>
    </div>
    <!-- <img :src="src"> -->
</div>
</template>

<script>
import Experiments_List from '../components/Experiments-List.vue'
import Experiment from '../components/Experiment.vue'
export default {
    data(){
        return{
            experiments: null,
            showExperiment: false,
            id: null,
            marks: null,
        }
    },
    components: {
        Experiments_List,
        Experiment
    },methods:{
        onClickListItem(value){
            this.id = value
            this.showExperiment = true
        }
    },async beforeMount(){
        try{
            if(!this.$root.store.email||!this.$root.store.userID){
                // send request for users ID
                let config = {
                    url: this.$root.API_BASE + 'profile/getUserIdByEmail',
                    method: 'Post',
                    data: {email: this.$root.store.email}
                    }
                await this.axios(config).then((response) =>{
                    if(response.status && response.status === 200){
                    this.$root.store.userID = response.data.message
                    }
                }).then(async ()=>{
                //set the request for the user's experiments
                let config = {
                url: this.$root.API_BASE + 'profile/getProfile',
                method: 'Post',
                data: {userId: this.$root.store.userID}
                }
                // send the request and extract the experiments' names
                await this.axios(config).then((response) =>{
                if(response.status && response.status === 200){
                    this.experiments = response.data
                }else{
                    this.experiments = []
                    this.$root.toast(
                        "Error occurred",
                        "Couldn't fatch experiments",
                        "danger"
                );
                }
                }).catch((err)=>{console.log(err)})
            }).catch((err)=>{console.log('no user with email addres: "'+this.email+'"')})
            
            }else{
                //set the request for the user's experiments
                let config = {
                url: this.$root.API_BASE + 'profile/getProfile',
                method: 'Post',
                data: {userId: this.$root.store.userID}
                }
                // send the request and extract the experiments' names
                await this.axios(config).then((response) =>{
                if(response.status && response.status === 200){
                    this.experiments = response.data
                }else{
                    this.experiments = []
                    this.$root.toast(
                        "Error occurred",
                        "Couldn't fatch experiments",
                        "danger"
                );
                }
                }).catch((err)=>{console.log(err)})
            }
            // const response = await this.axios.get(this.$root.API_BASE + "experiments/getExperiments");
            // if(response.status && response.status === 200){
            //     this.experiments = response.data
            // }else{
            //     this.experiments = []
            //     this.$root.toast(
            //         "Error occurred",
            //         "Couldn't fatch experiments",
            //         "danger"
            //     );
            // }
        }catch(error){
            this.$root.toast(
                "Server timed out",
                "Couldn't fatch experiments",
                "danger"
            );
            console.log(error)
        }
        
    }
}
</script>

<style>
.list-container{
    position: absolute;
}
</style>
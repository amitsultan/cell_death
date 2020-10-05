<template>
<div>
    <div class='list-container'>
        <Experiments_List :experiments='experiments' @clicked="onClickListItem"/>
    </div>
    <div class='experiment-view'>
      <Experiment v-if="showExperiment" :id='id' :marks='marks' :type='type'></Experiment>
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
            type: null
        }
    },
    components: {
        Experiments_List,
        Experiment
    },methods:{
        onClickListItem(value){
            this.id = value
            this.marks = []
            this.type = 1
            this.showExperiment = true
        }
    },async beforeMount(){
        try{
            const response = await this.axios.get(this.$root.API_BASE + "/experiments/getExperiments");
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
    position: fixed;
}
</style>
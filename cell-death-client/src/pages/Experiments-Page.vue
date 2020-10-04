<template>
  <Experiments_List :experiments='experiments'/>
</template>

<script>
import Experiments_List from '../components/Experiments-List.vue'
export default {
    data(){
        return{
            experiments: null
        }
    },
    components: {
        Experiments_List
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
        }
    }
}
</script>

<style>

</style>
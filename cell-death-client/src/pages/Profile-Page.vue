<template>
  <div class="shadow-lg p-3 bg-white rounded container" style="width:80%;">
    <h4>Hello {{$root.store.firstName?$root.store.firstName+'!':'guest,'}}</h4><br>
    <h1>My Experiments</h1>
    <div v-if='active' style="float:right;width:30%;" class="shadow-lg p-4 bg-white rounded">
      <h4>Experiment: {{current}}</h4>
      {{add?'add':'remove'}} a user {{add?'to':'from'}} the <b>{{current?"\'"+current+"\'":''}}</b> permissions by entering a user's email:<br>
      <input v-model="email" value="enter email" /><br><br>
      Note: You can't edit permissions for an experiment you dont own! <br><br>
      <input type="button" :value="add?'Add':'Remove'" v-on:click="EditPermission(email,current)" style="float:right;"/>
      <input type="button" value="Cancel" v-on:click="active=false" style="float:left;"/>
    </div>
    <div v-if='Object.keys(this.experiments).length==0'>  no experiments for you... yet!</div>
    <div v-else>Edit permissions on your Experiments:</div>
    <div v-for="exp in experiments" :key="exp" style="width:68%;margin-top:10px" class="shadow-lg p-4 bg-white rounded">
          {{exp}}
    <!-- <b-button class="remove_btn" v-on:click="removeButton(exp)">Remove</b-button> -->
    <b-button class="add_btn" v-on:click="removePermissionsButton(exp)">Remove Permissions</b-button>
    <b-button class="add_btn" v-on:click="addPermissionsButton(exp)">Add Permissions</b-button>
    </div>
  </div>
</template>

<script>
export default {
    name: 'ProfilePage',
    data() {
      return {
        experiments: Array(),
        active: false,
        current: '',
        add: true,
        email: '',
        userID: '',
      }
    },
    computed:{
    },
    components:{
    },
    props:{
    },
    methods: {
        async removeButton(experiment){
          this.active = false
          this.current = experiment
          let pop = true
          let res = confirm("Are you sure you want to remove your Premissions to \'"+experiment+"\'?")
          if (!res) return // dont continue if user doesnt confirm
          let config = {
            url: this.$root.API_BASE + 'profile/removePermissions',
            method: 'Post',
            data: {
              user_id: this.$root.store.userID,
              email: this.$root.store.email,
              projectId: experiment,
            }
          }
          await this.axios(config).then((response) =>{
            if(response.status && response.status === 200){
              console.log('permission updated')
            }
            if(response.status && response.status === 400){
              console.log(response.body.message)
            }
          }).catch((err)=>{
            console.log(err)
            pop = false
            })
           if (pop) { // remove experiment from display iff permission was removed
             this.experiments.pop(experiment)
            console.log('remove premission :('+this.$root.store.firstName+","+experiment+')')
           }else{
             console.log('premission unchanged')
           }
        },
        async addPermissionsButton(experiment){
          this.active = true
          this.current = experiment
          this.add = true
        },
        async removePermissionsButton(experiment){
          this.active = true
          this.current = experiment
          this.add = false
        },
      async EditPermission(email,experiment){
        let message = "Are you sure you want to give "+email+" your Premissions to \'"+experiment+"\'?"
        if (!this.add){
          message = "Are you sure you want to remove "+email+"'s Premissions to \'"+experiment+"\'?"
        }
        let res = confirm(message)
        //first we get the user ID
        let config = {
          url: this.$root.API_BASE + 'profile/getUserIdByEmail',
          method: 'Post',
          data: {
            email: email,
          }
        }
        console.log(config)
        await this.axios(config).then((response) =>{
          if(response.status && response.status === 200){
            this.userID = response.data.message
          }
        }).catch((err)=>{
          console.log('no user with email addres: "'+this.email+'"')
          res = false // dont continue if not found
        })
        if (res){
          // second we send a request to add record to permissions table
          let path = 'profile/addPermissions'
          if(!this.add) // remove instead of add
            path = 'profile/deletePermissions'
          config = {
            url: this.$root.API_BASE + path,
            method: 'Post',
            data: {
              user_id: this.$root.store.userID,
              email: this.email,
              projectId: experiment,
            }
          }
          let message = this.add?'added':'removed'
          await this.axios(config).then((response) =>{
            if(response.status && response.status === 200){
              message = 'permission ' + message
              console.log(message)
              this.$root.toast(
                'successfuly updated!',
                message,
                "success")
                this.email=''
            }else{
              // console.log(response.message)
              this.$root.toast(
                'permission unchanged!',
                response.data.message,
                "danger")
            }
          }).catch((err) =>{         
              console.log('permission unchanged')
              this.$root.toast(
                'permission unchanged',
                'permission has not been '+message,
                "danger")})
        }else{
          console.log('permission unchanged')
          this.$root.toast(
                'permission unchanged!',
                'error while updating permission!',
                "danger")
        }
      },
    },
    async beforeCreate(){
      const res = {}
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
            response.data.forEach((exp)=> {
              this.experiments.push(exp)
            })
          }
        }).catch((err)=>{console.log(err)})
      }).catch((err)=>{console.log('no user with email addres: "'+this.email+'"')})

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
li{
  // margin-bottom: 30px;
}
li::before{
    content: '';
    font-weight: bold;
}
.remove_btn{
    color: #000000;
    float: right;
    margin-right: 15px;
    background-color: #CCCCCC;
}
.remove_btn.hover{
    color: #FFFFFF;
    float: right;
    background-color: #d65151;
}
</style>
<template>

  <div class="text-center shadow-lg p-3 mb-5 bg-white rounded left cards_container">
    <table class='cards_table'>
      <tr>
        <td>
          <card class="card_css" :title="cards[0].title" :details="cards[0].details" :src="cards[0].src"></card>
        </td>
        <td>
          <card class= "card_css" :title="cards[1].title" :details="cards[1].details" :src="cards[1].src"></card>
        </td>
        <td>
          <card class= "card_css" :title="cards[2].title" :details="cards[2].details" :src="cards[2].src"></card>
        </td>
        <td>
          <card class= "card_css" :title="cards[3].title" :details="cards[3].details" :src="cards[3].src"></card>
        </td>
      </tr>

    </table>
  </div>
</template>

<script>
import card from "../components/Card"

export default {
  components:{
        card
  },
  data() {
     return {
       cards:
       [
         {
           title:"Haim Reyes",
          details:{
            email:"reyes@post.bgu.ac.il",
            facebook: "https://www.facebook.com/haim.reyes",
            linkedin: "https://www.linkedin.com/in/haim-reyes-7a6126190/"
            },
          src:"https://raw.githubusercontent.com/amitsultan/cell_death/master/cell-death-client/src/assets/team/haim.png"
         },
         {
           title:"Liat Cohen",
          details:{ 
            email:"liatp@post.bgu.ac.il",
            facebook: "https://www.facebook.com/liati177",
            linkedin: "https://www.linkedin.com/in/liat-cohen-101a89205/"
          },
          src:"https://raw.githubusercontent.com/amitsultan/cell_death/master/cell-death-client/src/assets/team/liat.png"
         },
         {
           title:"Yarin Hayun",
          details:{
            email:"yarinbo@post.bgu.ac.il",
            facebook: "https://www.facebook.com/yarin.bokobza.1",
            linkedin: "https://www.linkedin.com/in/yarin-hayun-57491b204/"
            },
          src:"https://raw.githubusercontent.com/amitsultan/cell_death/master/cell-death-client/src/assets/team/yarin.png"
          },
         {
           title:"Amit Sultan",
          details:{
            email:"Amitsultan@gmail.com",
            facebook: "https://www.facebook.com/amit.sultan/",
            linkedin: "https://www.linkedin.com/in/sultanamit/"
            },
          src:"https://raw.githubusercontent.com/amitsultan/cell_death/master/cell-death-client/src/assets/team/amit.png"
         },
       ],
      tools:
      [
        'axios v0.19.2',
        'bootstrap v4.5.0',
        'jquery v3.5.1',
        'vue v2.6.11',
        'crypto-js v4.0.0',
        'express v4.17.1',
        'mysql v2.18.1'
      ],
      
    }
  }
}

</script>

<style>
.text-center {
  font-family: "Comic Sans MS", cursive, sans-serif;
  text-align: center;
}
.wrapper {
  height: 100vh;
}
.cards_container{
  height: 400px;
  width: max-content;
  margin: auto;
  align-items: center;
}
</style>

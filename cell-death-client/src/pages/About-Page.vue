<template>

  <div class="text-center container shadow-lg p-3 mb-5 bg-white rounded left">
                <img src=""/>

    <table>
      <tr>
        <td>
          <card class="card_css" :title="cards[0].title" :subTitle="cards[0].subTitle" :src="cards[0].src"></card>
        </td>
        <td>
          <card class= "card_css" :title="cards[1].title" :subTitle="cards[1].subTitle" :src="cards[1].src"></card>
        </td>
      </tr>
      <tr> 
        <td>
          <card class= "card_css" :title="cards[2].title" :subTitle="cards[2].subTitle" :src="cards[2].src"></card>
        </td>
        <td>
          <card class= "card_css" :title="cards[3].title" :subTitle="cards[3].subTitle" :src="cards[3].src"></card>
        </td>
      </tr>

    </table>
    <!--<cards title="Our Team Members" subTitle="meet our team!" :cards="cards"></cards>-->
  </div>
</template>

<script>
//import cards from "../components/AllCards"
import card from "../components/Card"

export default {
  components:{
        //cards,
        card
    },
  data() {
     return {
       cards:
       [
         {
           title:"Haim Reyes",
          subTitle:"reyes@post.bgu.ac.il",
          src: "https://github.com/amitsultan/cell_death/blob/534bb4f620e04a0a76b64743ad2d126493b4a237/cell-death-client/src/assets/team/haim.png?raw=true",
         },
         {
           title:"Liat Cohen",
          subTitle: "liatp@post.bgu.ac.il",
          src:"https://github.com/amitsultan/cell_death/blob/master/cell-death-client/src/assets/team/liat.jfif"
         },
         {
           title:"Yarin Hayun",
          subTitle:"yarinbo@post.bgu.ac.il",
          src:"https://github.com/amitsultan/cell_death/blob/master/cell-death-client/src/assets/team/yarin.jfif"
          },
         {
           title:"Amit Sultan",
          subTitle:"Amitsultan@gmail.com",
          src:"https://github.com/amitsultan/cell_death/blob/master/cell-death-client/src/assets/team/amit.jfif"
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
.card_css{
  width: 300px;
  height: 300px;
  margin: 10px 10px 10px 10px;
}
</style>

<template>

  <b-container class="cards">
      <h1>{{title}}</h1>
        <h5>{{subTitle}}</h5>
    <!--<div class="card-category" v-if="subTitle">{{subTitle}}</div>-->
        <b-col v-for="card in cards" :key="card.title" >
            <slot>
            <b-row>
                <card
                 :title="card.title" 
                 :subTitle="card.subTitle"
                 :src="crad.src"
                 />
            </b-row>
            </slot>
        </b-col>
  </b-container>
</template>
<script>
import card from "./Card"

  export default {
  components: { card },
    name: "card",
    props: {
      title: {
        type: String,
        description: "Card title"
      },
      subTitle: {
        type: String,
        description: "Card subtitle"
      },
      cards: {
            type: Object,
            description: "card components"
        }
    }
  };
</script>
<style>
</style>

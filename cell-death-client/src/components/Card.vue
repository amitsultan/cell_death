<template>
  <div class="card" style="height:430px">
    <div class="card-image" v-if="$slots.image">
      <slot name="image"></slot>
    </div>
    <div class="card-header" v-if="$slots.header || title" :class="headerClasses">
      <slot name="header">
        <h4 class="card-title">{{title}}</h4>
        <p class="card-category" v-if="subTitle">{{subTitle}}</p>
      </slot>
    </div>
    <div class="card-body" :class="bodyClasses">
      <slot>
          <img loading="lazy" :src="src" width=160px height=160px /><br>
          <!--:src="require(`@/assets/img/${filename}`)"-->
          <br>{{about}}
      </slot>
    </div>
    <slot name="raw-content"></slot>
    <div class="card-footer" :class="footerClasses" v-if="$slots.footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
<script>
  export default {
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
      src: {
        type: String,
        description: "Card image src"
      },
      about: {
        type: String,
        default: 'An awesome teammate!',
        description: "some text about the team/person"
      }
    }
  };
</script>
<style>
</style>

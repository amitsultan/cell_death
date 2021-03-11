<template>
  <div class="card">
    <div class="card-image" v-if="$slots.image">
      <slot name="image"></slot>
    </div>
    <div class="card-header" v-if="$slots.header || title" :class="headerClasses">
      <slot name="header">
        <h4 class="card-title">{{title}}</h4>
        <p class="card-category" v-if="subTitle">{{subTitle}}</p>
      </slot>
    </div>
    <div class="card-body">
      <slot>
          <img :src="src" height=165px width=165px/>
      </slot>
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
      }
    }
  };
</script>
<style>
</style>

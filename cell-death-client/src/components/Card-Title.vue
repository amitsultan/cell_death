<template>
  <div class="card" style="height: 150px" :class="[type && `card-${type}`]">
    <div class="card-image">
      <slot name="image"></slot>
    </div>
    <div class="card-header" :class="headerClasses">
      <slot name="header">
        <h4 class="card-title">{{title}}</h4>

      </slot>
    </div>
    <div class="card-body" :class="bodyClasses">
      <slot>
                  <p class="card-category" v-if="subTitle">{{subTitle}}</p>
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
    name: "CardTitle",
    props: {
      title: {
        type: String,
        description: "Card title"
      },    
      subTitle: {
        type: String,
        description: "Card title"
      },
      
    }
  };
</script>
<style>
</style>

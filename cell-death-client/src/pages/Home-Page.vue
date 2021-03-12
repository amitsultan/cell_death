<template>
 <div class="shadow-lg p-3 mb-5 bg-white rounded left home_text" width=80%>
    <h1>
        Welcome to Cell Tracking Tool 
    </h1>
    <div>
    Our cell tracking tool is a multi-purpose tool for various microscope images analysis.
    Our goal is to provide an easy way to detect certain states of cells or other moving organisms.
    Our tool will serve for phenomena as Cell Death and Calcium Signaling, hopefully for more in the future.
     <br><br>Enjoy your visit in our site :) 
    </div>
    <br><br>
    <div class="bottom">
    <img class='gif' loading="lazy" src="../assets/celldeath.gif">

    <img class='gif' loading="lazy"  src="../assets/calcium.gif">
    </div>
    <!--<video-player :options="videoOptions"/>-->
</div>
</template>

<script>
export default {
  name: "Home",
  data(){return{}}
 }
</script>
<style>
.left {
  font-family: "Comic Sans MS", cursive, sans-serif;
  text-align: left;
  margin-left: 100px;
  margin-top: 30px;
}
.right {
  text-align: right;
  margin-right: 200px;
}
.bottom {
  margin-top: 200px;
  margin-left: 100px;
}
.gif {
  
  width:320px;
  height:280px;
  margin: 15px 15px 15px 15px;
}
.gif:hover { 
transform: scale(1.1); 
}
.home_text{
  font-size: 6mm ;
  margin: 15px 0px 0px 20px;
  width: 1000px
}
</style>
<template>
<div>
  <canvas id='tif_image'></canvas>
</div>
</template>

<script>
export default {
 name: "App",
  mounted(){
     this.axios.get('http://localhost:8081/img').then((res)=>{
        var c = document.getElementById("tif_image");
        c.width = 1392
        c.height = 1040
        var tlCtx = c.getContext('2d');
        var imgData= tlCtx.createImageData(1392, 1040)
        imgData.data.set(res.data);  
        tlCtx.putImageData(imgData, 0, 0); 
       }).catch((err)=>{
       console.log(err)
     })
  }
}
</script>

<style>

</style>
<template>
  <h1>Vue Maze</h1>
  <div class="threeCanvas" ref="canvas"></div>
</template>

<script>
import threeMotion from "./assets/script/threeMotion.js"

export default {
  name: 'App',
  components: {
    
  },
  mounted() {
    const canvasWrap = this.$refs.canvas;
    let three = new threeMotion();
    three.init(canvasWrap);
  }
}
</script>

<style>
html.body {position:relative;width:100%;height:100%;}
.threeCanvas {position:absolute;top:0;left:0;width:100%;height:100%;}
canvas {position:relative;width:100%;height:100%;}
</style>

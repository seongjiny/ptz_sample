<template>
  <button @click="moveCamera('left')"> Left </button>
  <button @click="moveCamera('right')"> Right </button>
  <button @click="moveCamera('up')"> Up </button>
  <button @click="moveCamera('down')"> Down </button>
  <br/>
  <button @click="moveCamera('zoomin')"> Zoom In </button>
  <button @click="moveCamera('zoomout')"> Zoom Out </button>
  <br />
  <button @click="updatePosition()"> Get Position</button>
  <br />
  <span> {{printPos()}} </span>
</template>

<script>
import axios from 'axios';
export default {
  name: 'App',
  data() {
    return {
      url: 'http://localhost:3000/',
      pos : {x: '', y : '', zoom: ''},
    };
  },
  components: {
  },
  methods: {
    moveCamera(direction) {
      axios
        .get(this.url + direction)
        .then(res => {
          console.log(res);
          this.updatePosition();
        })
        .catch(err => {
          console.log(err);
        });  
    },
    updatePosition() {
      axios
        .get(this.url + 'pos')
        .then(res => {
          console.log(res);
          this.pos = res.data;
        })
        .catch(err => {
          console.log(err);
        });
    },
    keyDownHandler(e) {
      if(e.key.startsWith('Arrow')) {
        this.moveCamera(e.key.substring(5).toLowerCase());
      }
    },
    printPos() {
      return `x: ${this.pos.x}, y: ${this.pos.y}, zoom: ${this.pos.zoom}`;
    }
  },
  created() {
    window.addEventListener('keydown', this.keyDownHandler);
    this.updatePosition();
  },
}
</script>

<style>
#app {
  text-align: center;
}
button {
  margin: 5px;
}
</style>

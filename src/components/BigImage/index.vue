<!--  -->
<template>
  <div class="contain" v-if="imageshow" @click.self="imageShow">
    <img
      :src="url"
      alt=""
    />
  </div>
</template>

<script>
export default {
  props: {
    url: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      imageshow: false,
    };
  },

  //   components: {},

  //   computed: {},

  //   mounted: {},

  methods: {
    show() {
      this.imageshow = true;
    },
    hidden() {
      this.imageshow = false;
    },
    imageShow() {
      this.imageshow = false;
    }
  },
};
</script>
<style lang='scss' scoped>
.contain {
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.7);
  width: 100%;
  height: 100%;
  overflow: hidden;
  img {
    width: auto;
    height: 100%;
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    margin: auto;
    z-index: 9999;
  }
}
</style>
<template>
  <div class="text-input">
    <span class="header">{{ header }}</span>
    <input :disabled="loading" :class="{ border : error }" @change="change" type="text" v-model="content">

    <span v-if="error" class="error">{{ error }}</span>
    <span v-if="!error" class="subtitle">{{ subtitle }}</span>
  </div>
</template>

<script>
  export default {
    name: 'TextInput',

    data() {
      return {
        content: ``,
      }
    },

    props: {
      error: String,
      header: String,
      loading: Boolean,
      subtitle: String,
    },

    methods: {
      change: function() {
        this.$emit('change', this.content);
      }
    }
  }
</script>

<style>
  .text-input input {
    width: 100%;
    margin: 5px 0px;
    padding: 12px 20px;

    font-size: 18px;
    border-radius: 4px;
    box-sizing: border-box;
    border: 1px solid #ccc;
  }
</style>

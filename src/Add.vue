<template>
  <div id="add" @click="$emit('click')">
    +
  </div>
</template>

<script>
  export default {
    name: 'Add',
  }
</script>

<style>
  #add {
    right: 4vw;
    width: 75px;
    bottom: 4vw;
    height: 75px;
    z-index: 1;
    position: absolute;

    color: white;
    cursor: pointer;
    border: 1px solid #731d1d;
    border-radius: 50%;

    background-color: #933735;
    box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);

    font-size: 36px;
    font-weight: 100;

    display: flex;
    text-align: center;
    flex-direction: column;
    justify-content: center;
  }
</style>

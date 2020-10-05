<template>
  <div class="date-input">
    <span class="header">{{ header }}</span>
    <date-picker :disabled="loading" :class="{ border : error }" format='DD-MM-YYYY' @change="change" v-model="content" valueType="format"></date-picker>

    <span v-if="error" class="error">{{ error }}</span>
    <span v-if="!error" class="subtitle">{{ subtitle }}</span>
  </div>
</template>

<script>
  import 'vue2-datepicker/index.css';

  import DatePicker from 'vue2-datepicker';

  export default {
    name: 'DateInput',

    data() {
      return {
        content: ``,
      }
    },

    props: {
      error: String,
      value: !String,
      header: String,
      loading: Boolean,
      subtitle: String,
    },

    components: {
      DatePicker,
    },

    methods: {
      change: function() {
        this.$emit('change', this.content);
      }
    },

    watch: {
      value: function(value) {
        if (value) this.content = value;
        // console.log(value);
        // console.log(this.$refs.date.currentValue);
      }
    }
  }
</script>

<style>
  .date-input input {
    width: 100%;
    height: auto;
    margin: 5px 0px;
    padding: 12px 20px;

    font-size: 18px;
    border-radius: 4px;
    box-sizing: border-box;
    border: 1px solid #ccc;
  }

  .date-input .mx-datepicker { 
    width: 100%;
  }

  .date-input .mx-icon-clear {
    margin-right: 10px;
  }

  .date-input .mx-icon-calendar {
    display: none;
  }
</style>

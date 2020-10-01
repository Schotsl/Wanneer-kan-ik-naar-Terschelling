<template>
  <div id="window">
    <modal name="modal" classes="modal" height="auto">

      <div class="container">
        <span class="title">Start datum</span>
        <date-picker v-model="start"></date-picker>
        <span class="description">De start datum van de vakantie</span>
      </div>

      <div class="container">
        <span class="title">Eind datum</span>
        <date-picker v-model="ending"></date-picker>
        <span class="description">De eind datum van de vakantie</span>
      </div>

      <div class="container">
        <span class="title">Titel</span>
        <input type="text" v-model="name">
        <span class="description">De titel van het vakantie blok</span>
      </div>

      <div class="line"></div>

      <div class="container">
        <span class="title">Familie(s)</span><br/>
        <span class="description">Welke families gaan op vakantie</span><br/>

        <div style="margin-top: 5px;">
          <input type="checkbox" id="holst" name="holst" v-model="holst">
          <label for="holst" class="title"> van Holst / Steenmeijer</label><br>
          <input type="checkbox" id="steenmeijer" name="steenmeijer" v-model="steenmeijer">
          <label for="steenmeijer" class="title"> Steenmeijer / Anoesjka</label><br>
          <input type="checkbox" id="hartman" name="hartman" v-model="hartman">
          <label for="hartman" class="title"> Hartman / Steenmeijer</label><br>
          <input type="checkbox" id="other" name="other" v-model="other">
          <label for="other" class="title"> Anders..</label><br>
        </div>
      </div>

      <div class="line"></div>
      <button class="fc-button-primary">Vakantie toevoegen</button>
      
    </modal>
  </div>
</template>

<script>
  import 'vue-js-modal/dist/styles.css';
  import 'vue2-datepicker/index.css';

  import DatePicker from 'vue2-datepicker';

  export default {
    name: 'Window',

    data() {
      return {
        name: ``,
        color: ``,
        start: ``,
        ending: ``,

        holst: false,
        other: false,
        hartman: false,
        steenmeijer: false,
      }
    },

    components: {
      DatePicker,
    },

    computed: {
      averageColor: function() {
        const colorArray = [];
        const averageColor = require('@bencevans/color-array-average');

        if (this.holst) colorArray.push(`#f8efd4`);
        if (this.other) colorArray.push(`#edc988`);
        if (this.hartman) colorArray.push(`#de4463`);
        if (this.steenmeijer) colorArray.push(`#821752`);

        return averageColor(colorArray);
      }
    },

    mounted() {
      this.show();
    },

    methods: {
      show () {
        this.$modal.show('modal');
      },
      hide () {
        this.$modal.hide('modal');
      }
    }
  }
</script>

<style>
  #window button {
    width: 100%;
    color: white;
    padding: 13px 32px;

    font-size: 22px;
    text-align: center;
    font-weight: 100;
    border-radius: 5px;
  }
  
  #window .title {
    font-size: 18px;
    font-weight: 300;
  }

  #window .container {
    margin: 16px 0px;
  }

  #window .description {
    opacity: .65;
    font-size: 16px;
    margin-bottom: 10px;
  }

  #window .line {
    margin-top: 16px;
    margin-bottom: 16px;
    border-top: 1px solid rgb(51, 51, 51, .1);
  }

  #window .modal {
    padding: 0 15px 15px 15px;
  }

  #window .mx-datepicker { 
    width: 100%;
  }

  #window .mx-icon-calendar {
    display: none;
  }

  #window input[type="text"] {
    margin-top: 5px;
    margin-bottom: 5px;
    
    height: auto !important;
    padding: 12px 20px !important;
    font-size: 18px !important;

    width: 100%;
    border: 1px solid #ccc;
    border-radius: 4px;
    box-sizing: border-box;
  }
</style>

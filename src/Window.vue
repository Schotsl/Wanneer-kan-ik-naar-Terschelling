<template>
  <div id="window">
    <modal name="modal" classes="modal" height="auto" @closed="$emit('closed')">
      
      <Spinner v-if="loading"></Spinner>

      <div :class="{ loading : loading }">
        <TextInput :loading="loading" @change="updateName" header="Eind datum" subtitle="De eind datum van de vakantie" :error="errors.name"></TextInput>
        <DateInput :loading="loading" @change="updateStart" header="Eind datum" subtitle="De eind datum van de vakantie" :error="errors.start"></DateInput>
        <DateInput :loading="loading" @change="updateEnding" header="Eind datum" subtitle="De eind datum van de vakantie" :error="errors.ending"></DateInput>

        <div class="line"></div>

        <span class="title">Familie(s)</span><br/>
        <span class="description">Welke families gaan op vakantie</span><br/>

        <input type="checkbox" id="holst" v-model="family.holst">
        <label for="holst" class="title"> van Holst / Steenmeijer</label><br>

        <input type="checkbox" id="steenmeijer" v-model="family.steenmeijer">
        <label for="steenmeijer" class="title"> Steenmeijer / Anoesjka</label><br>

        <input type="checkbox" id="hartman" v-model="family.hartman">
        <label for="hartman" class="title"> Hartman / Steenmeijer</label><br>

        <input type="checkbox" id="other" v-model="family.other">
        <label for="other" class="title"> Anders..</label><br>

        <div class="line"></div>

        <button :disabled="loading" class="fc-button-primary" @click="createVacation">Vakantie toevoegen</button>
      </div>
    </modal>
  </div>
</template>

<script>
  import 'vue-js-modal/dist/styles.css';

  import TextInput from './Text';
  import DateInput from './Date';
  import Spinner from './Spinner';


  import axios from 'axios';

  export default {
    name: 'Window',

    components: {
      Spinner,
      TextInput,
      DateInput,
    },

    data() {
      return {
        loading: false,

        vacation: {
          name: ``,
          start: ``,
          ending: ``,
        },

        errors: {
          name: ``,
          start: ``,
          ending: ``,
        },

        family: {
          holst: false,
          other: false,
          hartman: false,
          steenmeijer: false,
        },
      }
    },

    props: {
      open: Boolean,
    },

    computed: {
      averageColor: function() {
        const colorArray = [];
        const averageColor = require('@bencevans/color-array-average');

        if (this.family.holst) colorArray.push(`#f8efd4`);
        if (this.family.other) colorArray.push(`#edc988`);
        if (this.family.hartman) colorArray.push(`#de4463`);
        if (this.family.steenmeijer) colorArray.push(`#821752`);

        return averageColor(colorArray);
      },
    },

    methods: {
      updateName(name) {
        this.vacation.name = name;
      },
      updateStart(start) {
        this.vacation.start = start;
      },
      updateEnding(ending) {
        this.vacation.ending = ending;
      },

      resetErrors() {
        this.errors.name = ``;
        this.errors.start = ``;
        this.errors.ending = ``;
      },

      validateInput() {
        const validation = require('validator');

        if (!validation.isLength(this.vacation.name, {'min': 3, 'max': 255})) this.errors.name = `Vul hier een titel in`;
        if (!validation.isDate(this.vacation.ending)) this.errors.ending = `Vul hier een eind datum in`;
        if (!validation.isDate(this.vacation.start)) this.errors.start = `Vul hier een start datum in`;

        return this.errors.name.length === 0 &&
               this.errors.start.length === 0 &&
               this.errors.ending.length === 0;    
      },

      async createVacation() {
        // Clear the old errors
        this.resetErrors();

        // Check for new errors
        if (!this.validateInput()) return;

        // Start the loading
        this.loading = true;
        this.vacation.color = this.averageColor;

        // Send creation process
        await axios({
          url: `https://us-central1-wanneer-naar-terschellin-ba99f.cloudfunctions.net/app/api/v1/vacation`,
          data: this.vacation,
          method: `post`
        });

        // Once we're done loading disable spinner
        this.loading = false;
      }
    },

    watch: {
      open: function() {
        if (this.open) this.$modal.show('modal');
      }
    }
  }
</script>

<style>
  .loading {
    opacity: .15;
  }

  #window button {
    width: 100%;
    color: white;
    padding: 13px 32px;

    font-size: 22px;
    text-align: center;
    font-weight: 100;
    border-radius: 5px;
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
</style>

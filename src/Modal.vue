<template>
  <div>
    <!-- Background and escape of the modal -->
    <div class="modal-container" @click="closeModal"></div>

    <!-- The modal and the actual content -->
    <div class="modal-content" :style="styleHeight">
      <Spinner v-if="loading"></Spinner>

      <div :style="[ loading ? { opacity: 0.15 } : null ]">
        <TextInput placeholder="Titel" :loading="loading" :value="vacation.title" @change="updateTitle" header="Vakantie titel" subtitle="De titel van de vakantie" :error="errors.title"></TextInput>
        <TextInput placeholder="23/04/2000" :loading="loading" :value="vacation.start" @change="updateStart" header="Start datum" subtitle="De start datum van de vakantie" :error="errors.start"></TextInput>
        <TextInput placeholder="26/04/2000" :loading="loading" :value="vacation.end" @change="updateEnd" header="Eind datum" subtitle="De eind datum van de vakantie" :error="errors.end"></TextInput>

        <div class="line"></div>

        <span class="header">Familie(s)</span><br/>
        <span class="subtitle">Welke families gaan op vakantie</span><br/>

        <div class="list-input">
          <input type="checkbox" id="holst" v-model="vacation.family.holst">
          <label for="holst" class="header"> van Holst / Steenmeijer</label><br>

          <input type="checkbox" id="steenmeijer" v-model="vacation.family.steenmeijer">
          <label for="steenmeijer" class="header"> Steenmeijer / Anoesjka</label><br>

          <input type="checkbox" id="hartman" v-model="vacation.family.hartman">
          <label for="hartman" class="header"> Hartman / Steenmeijer</label><br>

          <input type="checkbox" id="other" v-model="vacation.family.other">
          <label for="other" class="header"> Anders..</label><br>
        </div>

        <span v-if="errors.family" class="error">{{ errors.family }}</span>
        <div class="line"></div>

        <div class="button-container">
          <button :disabled="loading" v-if="id" class="fc-button-primary" @click="deleteVacation">Vakantie verwijderen</button>
          <button :disabled="loading" v-if="id" class="fc-button-primary second-button" @click="updateVacation">Vakantie bijwerken</button>
          <button :disabled="loading" v-if="!id" class="fc-button-primary" @click="createVacation">Vakantie toevoegen</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import TextInput from './Text';
  import Spinner from './Spinner';

  import axios from 'axios';

  export default {
    name: 'Modal',

    components: {
      TextInput,
      Spinner,
    },

    data() {
      return {
        loading: false,

        vacation: {
          end: ``,
          name: ``,
          start: ``,
          family: {
            holst: false,
            other: false,
            hartman: false,
            steenmeijer: false,
          }
        },

        errors: {
          end: ``,
          name: ``,
          start: ``,
          family: ``,
        },
      }
    },

    props: {
      id: String,
      height: Number,
    },

    computed: {
      styleHeight: function() {
        const height = Math.round(this.height / 2);
        return `top: ${height}px`;
      },

      averageColor: function() {
        const colorArray = [];
        const averageColor = require('@bencevans/color-array-average');

        if (this.vacation.family.holst) colorArray.push(`#960019`);
        if (this.vacation.family.other) colorArray.push(`#B80F0A`);
        if (this.vacation.family.hartman) colorArray.push(`#C21807`);
        if (this.vacation.family.steenmeijer) colorArray.push(`#B22222`);

        return averageColor(colorArray);
      },

      familySelected: function() {
        return this.vacation.family.holst ||
               this.vacation.family.other ||
               this.vacation.family.hartman ||
               this.vacation.family.steenmeijer;
      }
    },

    methods: {
      updateTitle(title) {
        this.vacation.title = title;
      },
      updateStart(start) {
        this.errors.start = ``;
        this.vacation.start = start;

        const validation = require('validator');
        if (!validation.isDate(start, 'DD/MM/YYYY')) this.errors.start = `Vul een geldige start datum in`;
      },
      updateEnd(end) {
        this.errors.end = ``;
        this.vacation.end = end;

        const validation = require('validator');
        if (!validation.isDate(end, 'DD/MM/YYYY')) this.errors.start = `Vul een geldige eind datum in`;
      },

      resetErrors() {
        this.errors.end = ``;
        this.errors.title = ``;
        this.errors.start = ``;
        this.errors.family = ``;
      },

      resetValues() {
        this.vacation.end = ``;
        this.vacation.start = ``;
        this.vacation.title = ``;
        this.vacation.family.holst = ``;
        this.vacation.family.other = ``;
        this.vacation.family.hartman = ``;
        this.vacation.family.steenmeijer = ``;
      },

      closeModal() {
        this.resetValues();
        this.resetErrors();
        this.$emit('closed');
      },

      validateInput() {
        const validation = require('validator');

        if (!validation.isLength(this.vacation.end, {'min': 3, 'max': 255})) this.errors.end = `Vul hier een eind datum in`;
        if (!validation.isLength(this.vacation.start, {'min': 3, 'max': 255})) this.errors.start = `Vul hier een start datum in`;
        if (!validation.isLength(this.vacation.title, {'min': 3, 'max': 255})) this.errors.title = `Vul hier een titel in`;
        if (!this.familySelected) this.errors.family = `Selecteer een of meerdere families`

        return this.errors.end.length === 0 &&
               this.errors.title.length === 0 &&
               this.errors.start.length === 0 &&
               this.errors.family.length === 0; 
      },

      async getVacation() {
        this.loading = true;

        const vacation = await axios.get(`https://us-central1-wanneer-naar-terschellin-ba99f.cloudfunctions.net/app/api/v1/vacation/${this.id}`);
        
        this.loading = false;
        this.vacation.end = vacation.data.end;
        this.vacation.start = vacation.data.start;
        this.vacation.title = vacation.data.title;
        this.vacation.family = vacation.data.family;
      },

      async createVacation() {
        this.resetErrors();

        if (this.validateInput()) {
          this.vacation.color = this.averageColor;
          this.$emit(`create`, this.vacation);
          this.closeModal();
        }
      },

      updateVacation() {
        this.resetErrors();

        if (this.validateInput()) {
          this.vacation.id = this.id;
          this.vacation.color = this.averageColor;
          this.$emit(`update`, this.vacation);
          this.closeModal();
        }
      },

      deleteVacation() {
        this.vacation.id = this.id;
        this.$emit(`delete`, this.vacation);
        this.closeModal();
      },
    },

    mounted() {
      if (this.id) this.getVacation();
    }
  }
</script>

<style>
  /* Styling for the modal background */
  .modal-container {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    position: fixed;

    z-index: 2;
    background-color: rgba(0,0,0,0.4);
  }

  /* Styling for the modal itself */
  .modal-content {
    left: 50%;
    width: 80%;
    border: 1px solid #888;
    padding: 20px;
    position: absolute;
    transform: translate(-50%,-50%);

    z-index: 3;
    background-color: #fefefe;
  }

  /* Styling for input containers */
  .text-input,
  .date-input { margin: 15px 0; }
  .list-input { margin: 6px 0; }

  /* Styling for input fonts */
  .subtitle,
  .error {
    opacity: .65;
    font-size: 16px;
    font-weight: 100;
  }

  .header {
    font-size: 20px;
    font-weight: 300;
  }

  /* Styling for input errors */
  .border,
  .border input {
    border-color: #dc3545 !important;
  }

  .error { color: #dc3545 !important; }

  /* Styling for submit button */
  button {
    width: 100%;
    color: white;
    padding: 13px 32px;

    font-size: 22px;
    text-align: center;
    font-weight: 100;
    border-radius: 5px;
  }

  .second-button {
    margin-top: 21px;
  }

  .line {
    margin-top: 21px;
    margin-bottom: 21px;
    border-top: 1px solid rgb(51, 51, 51, .1);
  }

  .modal { padding: 10px 25px 25px 25px; }

  /* Mobile styling */
  
  @media only screen and (max-width: 600px) {
    .header { font-size: 18px; }
    .subtitle { font-size: 15px; }
    .second-button { margin-top: 11px; }
    .button-container { margin-top: 16px; }

    label {
      font-size: 16px !important;
    }

    .text-input, 
    .date-input {
      margin: 8px 0px;
    }

    .text-input input,
    .date-input input {
      margin: 4px 0px !important;
    }

    .line {
      margin-top: 11px;
      margin-bottom: 11px;
    }

    .text-input input,
    .mx-input-wrapper input {
      padding: 6px 10px !important;
    }

    .fc-button-primary {
      font-size: 20px;
      padding: 8px;
    }
  }

</style>

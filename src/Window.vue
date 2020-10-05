<template>
  <div id="window">
    <modal name="modal" height="auto" classes="modal" :focusTrap="loading" @closed="closeModal">
      
      <Spinner v-if="loading"></Spinner>

      <div :style="[ loading ? { opacity: 0.15 } : null ]">
        <TextInput :loading="loading" :value="vacation.name" @change="updateName" header="Vakantie titel" subtitle="De titel van de vakantie" :error="errors.name"></TextInput>
        <DateInput :loading="loading" :value="vacation.start" @change="updateStart" header="Start datum" subtitle="De start datum van de vakantie" :error="errors.start"></DateInput>
        <DateInput :loading="loading" :value="vacation.ending" @change="updateEnding" header="Eind datum" subtitle="De eind datum van de vakantie" :error="errors.ending"></DateInput>

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

        <button :disabled="loading" v-if="id" class="fc-button-primary" @click="deleteVacation">Vakantie verwijderen</button>
        <button :disabled="loading" v-if="id" class="fc-button-primary" @click="updateVacation" style="margin-top: 21px;">Vakantie bijwerken</button>
        <button :disabled="loading" v-if="!id" class="fc-button-primary" @click="createVacation">Vakantie toevoegen</button>
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
          family: {
            holst: false,
            other: false,
            hartman: false,
            steenmeijer: false,
          }
        },

        errors: {
          name: ``,
          start: ``,
          ending: ``,
          family: ``,
        },
      }
    },

    props: {
      id: String,
      open: Boolean,
    },

    computed: {
      averageColor: function() {
        const colorArray = [];
        const averageColor = require('@bencevans/color-array-average');

        if (this.vacation.family.holst) colorArray.push(`#f8efd4`);
        if (this.vacation.family.other) colorArray.push(`#edc988`);
        if (this.vacation.family.hartman) colorArray.push(`#de4463`);
        if (this.vacation.family.steenmeijer) colorArray.push(`#821752`);

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
        this.errors.family = ``;
      },

      resetValues() {
        this.vacation.name = ``;
        this.vacation.start = ``;
        this.vacation.ending = ``;
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

        if (!validation.isLength(this.vacation.name, {'min': 3, 'max': 255})) this.errors.name = `Vul hier een titel in`;
        if (!validation.isDate(this.vacation.ending, 'DD-MM-YYYY')) this.errors.ending = `Vul hier een eind datum in`;
        if (!validation.isDate(this.vacation.start, 'DD-MM-YYYY')) this.errors.start = `Vul hier een start datum in`;
        if (!this.familySelected) this.errors.family = `Selecteer een of meerdere families`

        return this.errors.name.length === 0 &&
               this.errors.start.length === 0 &&
               this.errors.ending.length === 0 &&
               this.errors.family.length === 0; 
      },

      async getVacation() {
        this.loading = true;

        const vacation = await axios.get(`https://us-central1-wanneer-naar-terschellin-ba99f.cloudfunctions.net/app/api/v1/vacation/${this.id}`);
        
        this.loading = false;
        this.vacation.name = vacation.data.name;
        this.vacation.start = vacation.data.start;
        this.vacation.ending = vacation.data.ending;
        this.vacation.family = vacation.data.family;
      },

      async createVacation() {
        this.resetErrors();

        if (this.validateInput()) {
          this.loading = true;
          this.vacation.color = this.averageColor;

          await axios({
            url: `https://us-central1-wanneer-naar-terschellin-ba99f.cloudfunctions.net/app/api/v1/vacation`,
            data: this.vacation,
            method: `post`
          });

          this.loading = false;
          this.closeModal();
          this.$emit(`fetch`);
        }
      },

      async deleteVacation() {
        this.loading = true;
        await axios.delete(`https://us-central1-wanneer-naar-terschellin-ba99f.cloudfunctions.net/app/api/v1/vacation/${this.id}`);
        
        this.loading = false;
        this.closeModal();
        this.$emit(`fetch`);
      },

      async updateVacation() {

      }
    },

    watch: {
      open: function() {
        if (this.open) {
          this.$modal.show(`modal`);
          if (this.id) this.getVacation();
        } else {
          this.$modal.hide(`modal`);
        }
      }
    }
  }
</script>

<style>
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

  .line {
    margin-top: 21px;
    margin-bottom: 21px;
    border-top: 1px solid rgb(51, 51, 51, .1);
  }

  .modal { padding: 10px 25px 25px 25px; }
</style>

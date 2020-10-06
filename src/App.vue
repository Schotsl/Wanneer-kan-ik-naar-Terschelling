<template>
  <div id="app">
    <div :class="{ loading : vacationLoading }">
      <FullCalendar :options="calendarOptions" />
    </div>
    
    <Spinner v-if="vacationLoading" />

    <transition name="fade">
      <div v-if="isAllowed">
        <Window :open="vacationModal" :id="vacationId" @closed="closeModal" @update="updateVacation" @create="createVacation" @delete="deleteVacation" />
        <Add @click="openModal" />
      </div>
    </transition>
  </div>
</template>

<script>
  import Add from './Add';
  import Window from './Window';
  import Spinner from './Spinner';

  import FullCalendar from '@fullcalendar/vue';
  import dayGridPlugin from '@fullcalendar/daygrid';
  import interactionPlugin from '@fullcalendar/interaction'

  import axios from 'axios';

  export default {
    name: 'App',

    components: {
      FullCalendar,
      Spinner,
      Window,
      Add,
    },

    data() {
      return {
        viewportIp: ``,
        viewportWidth: 0,
        viewportHeight: 0,

        vacationId: '',
        vacationModal: false,
        vacationLoading: true,

        calendarOptions: {
          events: [],
          plugins: [ dayGridPlugin, interactionPlugin ],
          eventClick: this.handleDateClick,
          initialView: 'dayGridMonth',
        }
      }
    },

    mounted() {
      // Fetch the vacations
      this.vacationLoading = true;
      this.fetchVacations();
      this.vacationLoading = false;
      this.fetchIp();

      // Mount viewport size watch
      this.$nextTick(() => {
        window.addEventListener('resize', this.onResize);
        this.onResize();
      });
    },

    beforeDestroy() { 
      window.removeEventListener('resize', this.onResize); 
    },

    methods: {
      onResize() {
        this.viewportWidth = window.innerWidth;
        this.viewportHeight = window.innerHeight;
      },

      openModal() {
        this.vacationModal = true;
      },

      closeModal() {
        this.vacationModal = false;
        this.vacationId = null;
      },

      toDate(dateString) {
        const dateArray = dateString.split(`-`);
        const dateObject = new Date(dateArray[2], dateArray[1] - 1, dateArray[0]);
        return dateObject;
      },

      handleDateClick(dateObject) {
        if (dateObject.el.fcSeg.eventRange.def.publicId !== `null`) {
          this.vacationId = dateObject.el.fcSeg.eventRange.def.publicId;
          this.vacationModal = true;
        }
      },

      async fetchVacations() {
        const vacations = await axios.get(`https://us-central1-wanneer-naar-terschellin-ba99f.cloudfunctions.net/app/api/v1/vacation`);
        this.calendarOptions.events = vacations.data.map(vacationObject => ({ ...vacationObject, display: 'block', end: this.toDate(vacationObject.end), start: this.toDate(vacationObject.start) }));
      },

      async fetchIp() {
        const results = await axios.get(`https://api.ipify.org?format=json`);
        this.viewportIp = results.data.ip;
      },

      async createVacation(vacation) {
        this.vacationLoading = true;
        await axios({ url: `https://us-central1-wanneer-naar-terschellin-ba99f.cloudfunctions.net/app/api/v1/vacation`, data: vacation, method: `post` });
        await this.fetchVacations();
        this.vacationLoading = false;
      },

      async updateVacation(vacation) {
        this.vacationLoading = true;
        await axios({ url: `https://us-central1-wanneer-naar-terschellin-ba99f.cloudfunctions.net/app/api/v1/vacation/${vacation.id}`, data: vacation, method: `put` });
        await this.fetchVacations();
        this.vacationLoading = false;
      },

      async deleteVacation(vacation) {
        this.vacationLoading = true;
        await axios.delete(`https://us-central1-wanneer-naar-terschellin-ba99f.cloudfunctions.net/app/api/v1/vacation/${vacation.id}`);
        await this.fetchVacations();
        this.vacationLoading = false;
      },
    },

    computed: {
      calendarHeight() {
        return this.viewportHeight - this.viewportWidth * 0.08;
      },
      isAllowed() {
        return this.viewportIp === `80.61.199.248`;
      }
    }
  }
</script>

<style>
  @import '~@fullcalendar/daygrid/main.css';

  html, body {
    margin: 0px;
    height: 100%;
    width: 100%;
  }

  .loading {
    opacity: 0.15;
  }

  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    color: #2c3e50;
    padding: 4vw;
  }

  .fc-day-grid-event {
    line-height: 1.8;
    padding-left: 6px;
  }

  .fc-button-primary {
    background-color: #933735 !important;
    border-color: #731d1d !important;
  }

  .fc-toolbar-chunk { display: flex; }
  .fc-event-title { margin: 5px 8px; }
  .fc-event-time { display: none; }

  .fc-button-group,
  .fc-today-button {
    margin-bottom: 6px !important;
  }

  .fade-enter-active, .fade-leave-active { transition: opacity 2.5s; }
  .fade-enter, .fade-leave-to { opacity: 0; }
</style>

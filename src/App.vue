<template>
  <div id="app">
    <div :class="{ loading : vacationLoading }">
      <FullCalendar :options="calendarOptions" />
    </div>
    
    <Spinner v-if="vacationLoading" />
    <Window :open="vacationModal" @closed="closeModal" />
    <Add @click="openModal" />
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
        viewportWidth: 0,
        viewportHeight: 0,

        vacationModal: false,
        vacationLoading: true,

        calendarOptions: {
          style: 'opacity: 0;',
          events: [],
          plugins: [ dayGridPlugin, interactionPlugin ],
          eventClick: this.handleDateClick,
          initialView: 'dayGridMonth',
        }
      }
    },

    mounted() {
      // Fetch the vacations
      this.fetchVacations();

      // Mount viewport size watch
      this.$nextTick(() => {
        window.addEventListener('resize', this.onResize);
        this.onResize();
      })
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
      },
      fetchVacations() {
        axios.get(`https://us-central1-wanneer-naar-terschellin-ba99f.cloudfunctions.net/app/api/v1/vacation`).then((vacationData) => {
          const vacationArray = [];

          vacationData.data.forEach((vacationObject) => {
            vacationArray.push({
              color: vacationObject.color,
              title: vacationObject.name,
              start: vacationObject.start,
              end: vacationObject.ending,
              id: vacationObject.id,
            });
          });

          this.calendarOptions.events = vacationArray;
          this.vacationLoading = false;
        })
      },
      handleDateClick(data) {
        const id = data.el.fcSeg.eventRange.def.publicId;
      }
    },

    computed: {
      calendarHeight() {
        return this.viewportHeight - this.viewportWidth * 0.08;
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
</style>

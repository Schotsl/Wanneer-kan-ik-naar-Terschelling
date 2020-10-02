<template>
  <div id="app">
    <Spinner v-if="vacationLoading"></Spinner>
    <Window :open="vacationModal" @closed="closeModal"></Window>
    <FullCalendar defaultView="dayGridMonth" :events="getVacations" :height=calendarHeight :plugins="calendarPlugins" :style="[ vacationLoading ? { opacity: 0.15 } : null ]" />
    <Add @click="openModal"></Add>
  </div>
</template>

<script>
  import Add from './Add';
  import Window from './Window';
  import Spinner from './Spinner';

  import FullCalendar from '@fullcalendar/vue';
  import dayGridPlugin from '@fullcalendar/daygrid';

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
        width: 0,
        height: 0,

        vacationArray: [],
        vacationModal: false,
        vacationLoading: true,

        calendarPlugins: [ dayGridPlugin ]
      }
    },

    mounted() {
      this.fetchVacations();
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
        this.width = window.innerWidth;
        this.height = window.innerHeight;
      },
      openModal() {
        this.vacationModal = true;
      },
      closeModal() {
        this.vacationModal = false;
      },
      fetchVacations() {
        axios.get(`https://us-central1-wanneer-naar-terschellin-ba99f.cloudfunctions.net/app/api/v1/vacation`).then((vacation) =>{
          this.vacationArray = vacation.data;
          this.vacationLoading = false;
        })
      }
    },

    computed: {
      getVacations() {
        const vacationArray = [];

        this.vacationArray.forEach((vacationObject) => {
          vacationArray.push({
            color: vacationObject.color,
            title: vacationObject.name,
            start: vacationObject.start,
            end: vacationObject.ending,
          });
        });

        return vacationArray;
      },
      calendarHeight() {
        return this.height - this.width * 0.08;
      }
    }
  }
</script>

<style>
  @import '~@fullcalendar/core/main.css';
  @import '~@fullcalendar/daygrid/main.css';

  html, body {
    margin: 0px;
    height: 100%;
    width: 100%;
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

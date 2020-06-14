<template>
  <div id="app">
    <FullCalendar defaultView="dayGridMonth" :events="calendarData" :height=calendarHeight :plugins="calendarPlugins" />
  </div>
</template>

<script>
  import FullCalendar from '@fullcalendar/vue';
  import dayGridPlugin from '@fullcalendar/daygrid';

  import calendarData from './data.json';

  export default {
    name: 'App',

    components: {
      FullCalendar
    },

    data() {
      return {
        width: 0,
        height: 0,

        // Carola: #801515
        // Geert: #550000
        // Anne-Marie: #D46A6A
        // Oma: #FFAAAA

        calendarData: calendarData,
        calendarPlugins: [ dayGridPlugin ]
      }
    },

    mounted() {
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
      }
    },

    computed: {
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

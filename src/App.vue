<template>
  <div id="app">
    <FullCalendar defaultView="dayGridMonth" :events="calendarData" :height=calendarHeight :plugins="calendarPlugins" />
  </div>
</template>

<script>
  import FullCalendar from '@fullcalendar/vue';
  import dayGridPlugin from '@fullcalendar/daygrid';

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

        calendarPlugins: [ dayGridPlugin ],
        calendarData: [
          // Added a single day to every end day
          { color: '#7e2624', title: 'Timo, Mattijn en Sjors', start: '2020-06-08', end: '2020-06-16' },
          { color: '#D46A6A', title: 'Max en Pim', start: '2020-06-15', end: '2020-06-22' },
          { color: '#801515', title: 'Carola', start: '2020-06-27', end: '2020-06-29' },
          { color: '#D46A6A', title: 'Pim', start: '2020-06-28', end: '2020-06-31' },
          { color: '#801515', title: 'Ingmar', start: '2020-06-30', end: '2020-07-05' },
          { color: '#550000', title: 'Geert, Anoesjka, Timo en Mattijn', start: '2020-07-04', end: '2020-07-14' },
          { color: '#D46A6A', title: 'Anne-Marie, Jan Willem, Sjors, Max en Pim', start: '2020-07-16', end: '2020-07-30' },
          { color: '#550000', title: 'Geert, Anoesjka, Timo en Mattijn', start: '2020-07-29', end: '2020-08-03' },
          { color: '#550000', title: 'Mattijn en vrienden', start: '2020-08-07', end: '2020-08-15' },
        ]
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

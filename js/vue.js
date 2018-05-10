var vue = new Vue({
  el: "#app",
  data() {
    return {
      show: true,
      mainCard: true,
      fullSideBar: false,
      cameraShow: false,
      approved: false,
      scanner: false,
      picTaken: true,
      spinner: false,
      userApproved: false,
      cardTwoShow: false,
      message: '',
      users: [],
      person: '',
      personUrl: '',
      counter: Math.floor(Math.random() * 160),

    };
  },
  created() {
    fetch('../data.json').then(res => res.json()).then(data => {
      this.users = data
      console.log(this.users)
      this.personUrl = data[this.counter].recipients[0].logo
      this.person = data[this.counter].recipients[0].name
      this.message = data[this.counter].message.replace(/<(?:.|\n)*?>/gm, '')
      console.log(data[0])
      // console.log(data[0])
    })
  },

  updated() {
    this.updateCounter()
    this.fetchData()


  },
  mounted() {
    this.slideShow()
  },
  methods: {
    slideShow() {
      var slide =
        setTimeout(() => {
          this.show = !this.show
          var slideTwo = setInterval(() => {
            this.show = !this.show
          }, 4000)
        }, 4000);

    },

    updateCounter() {
      var updateCounter = setTimeout(() => {
        this.counter = Math.floor(Math.random() * 160)
        console.log(this.counter)
      }, 4000);
    },
    fetchData() {
      setInterval(() => {
        fetch('../data.json').then(res => res.json()).then(data => {
          this.personUrl = data[this.counter].recipients[0].logo
          this.person = data[this.counter].recipients[0].name
          this.message = data[this.counter].message.replace(/<(?:.|\n)*?>/gm, '')
        })
      }, 4000);

    },

    runCamera() {
      this.mainCard = !this.mainCard;
      this.cameraShow = !this.cameraShow;
      this.scanner = !this.scanner;
      if (!this.mainCard)
        this.openCamera();
      else if (this.mainCard)
        this.closeCamera();
    },
    clearAllTime() {
      console.log('cleared timeouts')
      var highestTimeoutId = setTimeout(";");
      for (var i = 0; i < highestTimeoutId; i++) {
        clearTimeout(i);
      }
    },
    slideCards() {
      const vm = this;
      const seq = [{
          e: vm.$refs.card,
          p: "transition.slideUpBigOut",
          o: {
            delay: 800,
            duration: 800
          }
        },
        {
          e: vm.$refs.card,
          // p: "transition.expandIn",
          p: "transition.slideUpBigIn",
          o: {
            duration: 800
          }
        }
      ];
      Velocity.RunSequence(seq);
    },

    openCamera(el, done) {
      const vm = this;
      el = vm.$refs.defaultdiv
      Velocity(el, {
        translateX: -1000
      }, {
        duration: 1200,
        complete: done
      });
      Velocity(vm.$refs.sidebarTwo, {
        width: "100%"
      }, {
        duration: 1200,
        complete: done
      });
      Velocity(vm.$refs.cameraDiv, {
        scale: 1
      }, {
        delay: 300,
        duration: 1500,
        complete: done
      });
    },
    closeCamera(el, done) {
      const vm = this;
      el = vm.$refs.defaultdiv
      Velocity(el, {
        translateX: 0,
        scale: 1,
        display: 'block'
      }, {
        duration: 1000,
        complete: done
      });

      Velocity(vm.$refs.sidebarTwo, {
        width: "330px"
      }, {
        duration: 1000,
        complete: done
      });
      Velocity(vm.$refs.cameraDiv, {
        scale: 0
      }, {
        delay: 300,
        duration: 1500,
        complete: done
      });
    }

  },

});
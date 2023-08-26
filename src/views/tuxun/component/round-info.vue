<template>
  <div class="round-info" v-if="gameData && gameData.type === 'challenge' && !gameData.rounds[gameData.rounds.length - 1].endTime">
    <div v-if="!ISPHONE" class="map">
      <div class="name">题库</div>
      <div class="info">{{getMapsName()}}</div>
    </div>
    <div class="round">
      <div class="name">轮次</div>
      <div class="info">{{gameData.currentRound}}/{{gameData.roundNumber}}</div>
    </div>
    <div class="score">
      <div class="name">得分</div>
      <div class="info">{{gameData.player.totalScore}}</div>
    </div>
  </div>
</template>

<script>
export default {
  name: "round-info",
  data() {
    return {}
  },
  props: {
    gameData: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  created() {

  },
  methods: {
    init() {
    },
    getMapsName() {
      if (this.gameData) {
        if ( this.gameData.mapsName.length > 13) {
          return this.gameData.mapsName.slice(0, 10) + '...'
        } else {
          return this.gameData.mapsName
        }
      } else {
        return '';
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.round-info {
  padding-left: 10px;
  background-color: rgba(255, 255, 255, 0.7);
  z-index: 2000;
  position: absolute;
  right: 0;
  top: 2rem;
  display: flex;
  .map {
    padding-left: 5px;
    .name {
      font-size: 16px;
    }
    .info {
      font-size: 20px;
    }
    .small-info {
      font-size: 10px;
    }
  }
  .round {
    padding-left: 10px;
    .name {
      font-size: 16px;
    }
    .info {
      font-size: 20px;
    }
  }
  .score {
    padding-left: 10px;
    padding-right: 5px;
    .name {
      font-size: 16px;
    }
    .info {
      font-size: 20px;
    }
  }
}

@media only screen and (max-width: 768px) {
 .round-info {
   .round {
     padding-left: 5px;
   }
 }
}
</style>

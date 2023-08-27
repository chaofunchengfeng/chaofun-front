<template>
  <div class="game_header_title">
    <div v-if="gameData.type === 'solo_match'">匹配Solo</div>
    <div v-if="gameData.type === 'challenge' || gameData.type === 'infinity'">练习 - {{gameData.mapsName}}</div>
    <div v-if="gameData.type === 'team_match'">组队匹配</div>
    <div v-if="gameData.type === 'solo'">派对 - 1v1对决</div>
    <div v-if="gameData.type === 'team'">派对 - 组队对决</div>
    <div v-if="gameData.type === 'battle_royale' && gameData.partyId">派对 - 淘汰赛</div>
    <div v-if="gameData.type === 'battle_royale'">淘汰赛</div>
    <div v-if="gameData.type === 'daily_challenge'">每日挑战<span v-if="gameData.mapsId !== 9">(全球)</span><span v-if="gameData.mapsId === 9">(中国)</span> </div>
    <div v-if="gameData.type === 'country_streak'">国家连胜<span v-if="gameData.move">(移动)</span><span v-if="!gameData.move">(固定)</span></div>
    <div v-if="gameData.type === 'map_country_streak'">题库国家连胜</div>
    <div v-if="gameData.type === 'province_streak'">省份连胜</div>
    <div style="font-size: 15px" v-if="gameData.type !== 'daily_challenge' && gameData.type.type !== 'country_streak' && gameData.type !== 'country_streak'" >
      <span>{{gameData.mapsName}}</span>
      <span v-if="!gameData.move"> | 固定街景</span>
      <span v-if="gameData.move"> | 移动街景</span>
      <span v-if="gameData.pan && gameData.zoom"> | 自由视角</span>
      <span v-if="!gameData.pan && !gameData.zoom"> | 固定视角</span>
      <span v-if="gameData.type === 'challenge' && gameData.roundTimePeriod"> | {{gameData.roundTimePeriod / 1000}} 秒 </span>
      <span v-if="gameData.type === 'challenge' && !gameData.roundTimePeriod"> | 无限轮次时间 </span>
      <span v-if="gameData.type === 'infinity'"> | 无限轮次 </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "game-header-title",
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
  }
}
</script>

<style lang="scss" scoped>
.game_header_title {
  color: white;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 1rem;
}
</style>

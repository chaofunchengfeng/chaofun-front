<template>
  <div class="container">
  </div>
</template>

<script>
// @ is an alias to /src
// import Header from '@/components/common/Header.vue'
import * as api from '@/api/api';
import {tuxunJump, tuxunOpen} from './common';
export default {
  name: 'tuxunRank',
  components: {

  },
  created(){
  },
  mounted(){
  },
};
</script>
<style scoped lang="scss">
.container{
  position: absolute;
  width: 100%;
  min-height: 120%;
  text-align: center;
  background-color:  $tuxunBackgroundColor;
  .nav {
    color: white;
    font-size: 48px;
    font-weight: bold;
    padding-top: 3rem;
  }

  .back_home {
    position: absolute;
    padding-top: 1rem;
    padding-left: 1rem;
  }
  section {
    padding-top: 3rem;
    display: block;
  }

  .game_entrance {
    box-sizing: border-box;
    display: block;
    width: 100%;
    padding: 0 2rem;
    margin: 0 auto;
    max-width: 80rem;
    margin-top: 3rem;
    margin-bottom: 5rem;

    .line {
      width: 100%;
      height: 2px;
      background-color: white;
      margin-bottom: 2rem;
      margin-top: 1rem;
    }
    .first_session_head {
      font-size: 24px;
      color: whitesmoke;
      font-weight: bolder;
    }
    .session_head {
      font-size: 24px;
      color: whitesmoke;
      padding-top: 2rem;
      font-weight: bolder;
    }
    .grid_main {
      display: grid;
      grid-row-gap: 1.5rem;
      grid-column-gap: 1.5rem;
      grid-template-columns: repeat(3, 1fr);

      .card {
        border-radius: 1rem;
        background-color: rgb(25,26,46, 0.9);
        background-position: 50%;
        background-repeat: no-repeat;
        background-size: 100%;
        box-sizing: border-box;
        box-radius: 1rem;
        flex-direction: column;
        display: flex;
        flex-direction: column;
        align-items: center;
        height: 100%;
        padding: 4rem;
        min-height: 110px;
        .title {
          font-size: 20px;
          color: white;
          font-weight: 700;
          padding-bottom: 0.2rem;
        }
        .describe {
          color: yellow;
          font-size: 1rem;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }
        .players {
          color: white;
          font-size: 1px;
          font-weight: 700;
          margin-bottom: 0.25rem;
        }
      }
    }
  }
}


@media only screen and (max-width: 768px) {
  .container {
    .game_entrance {
      .grid_main {
        grid-template-columns: repeat(1, 1fr);
      }
    }
  }
}
</style>

<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted() {
    new MutationObserver(() => {
      const querys = ['a[href^="https://maps.google.com/maps"]', 'a[href^="http://maps.google.com/maps"]', 'a[href^="https://www.google.com/maps"]', 'a[href^="http://www.google.com/maps"]', '.gm-iv-address', '.gm-style-cc'];
      querys.forEach(query => {
        const all = document.querySelectorAll(query);
        all.forEach(item => {
          item.remove();
        });
      });
    }).observe(document.getElementById('app'), { attributes: false, childList: true, subtree: true });
  }
};
</script>

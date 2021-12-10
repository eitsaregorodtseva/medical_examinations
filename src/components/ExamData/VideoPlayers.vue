<template>
  <div class="row">
    <video
      ref="video1"
      :src="source1"
      controls
      autoplay
      muted
      class="col-xxl mt-2"
      @seeked="syncVideoPlayers('video1','video2')"
    />
    <video
      ref="video2"
      :src="source2"
      controls
      autoplay
      muted
      class="col-xxl mt-2"
      @seeked="syncVideoPlayers('video2','video1')"
    />
  </div>
</template>

<script>
export default {
props : {
    source1: String,
    source2: String
},
data () { return {
  currentTime : 0,
  isMounted : false,
  syncInProgress : false
}},
mounted () {
  this.isMounted = true
},
methods : {
  delay(delayInms) {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(2);
      }, delayInms);
    });
  },
  async syncVideoPlayers(source, destination) {
    if (!this.isMounted || this.syncInProgress) {
      return;
    }
    this.syncInProgress = true;
    const time = this.$refs[source].currentTime;
    this.$refs[destination].currentTime = time;

    await this.delay(2000);
    this.syncInProgress = false;

  }
}
}
</script>

<style>

</style>

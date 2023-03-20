<template>
    <div class="text-center">
      <v-dialog
        v-model="localDialog"
        width="500"
      >
        <v-card>
            <slot></slot>
        </v-card>
      </v-dialog>
    </div>
  </template>
<script>
export default {
    name: 'DialogNotPersistentComponent',
    data: () => ({
        localDialog: false,
    }),

    watch: {
        dialogNew() {
            this.localDialog = true
        }
    },

    props: {
        dialogNew: Boolean
    }
}
</script>
<style lang="">
    
</style>
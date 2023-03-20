<template>
    <v-row justify="center">
      <v-dialog
        v-model="localDialog"
        persistent
        max-width="800"
      >
        <v-card>
          <v-card-title class="text-h5">
            {{tituloDialog}}
            <v-spacer/>
            <v-icon
                @click="closeDialog()"
            >
                mdi-close
            </v-icon>
          </v-card-title>
          <v-card-text>
            <slot name="text"></slot>
          </v-card-text>
          <v-card-actions>
            <v-spacer/>
            <slot name="actions"></slot>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
</template>

<script>

import LoadComponent from './LoadComponent.vue'
import AlertComponent from './AlertComponent.vue'

export default {
  components: { LoadComponent, AlertComponent },
    name: 'DialogComponent',
    data: () => ({
        localDialog: false,
    }),

    methods: {

        closeDialog() {
            this.$emit('close', false)
        },
    },

    watch: {
        dialog(val) {
            this.localDialog = val    
        }
    },

    props: {
        dialog: Boolean,
        tituloDialog: String
    }
}
</script>
<style>
    
</style>
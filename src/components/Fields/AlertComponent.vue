<template>
    <v-alert 
        :type='tipo'
        class="alert mt-3"
        dense
        border="left"
        >
        {{ textoAlerta }}
    </v-alert>
</template>
<script>

export default {
    name: 'AlertComponent',

    data: () => ({

    }),
    props: {
        textoAlerta: String,
        tipo: String
    }
}
</script>
<style>
    .alert {
        position: absolute !important;
        width: auto;
        right: 1% !important;
        z-index: 9999999
    }
</style>
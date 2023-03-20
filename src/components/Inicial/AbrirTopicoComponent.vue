<template>
    <dialog-component
        :tituloDialog="tituloDialog"
        @close="closeDialog"
        :dialog="dialog"
    >
        <template v-slot:text>
            <v-container fluid class="font">
                <p v-html="quebraLibra(item.descricao)"></p>
                <v-row 
                    v-if="item.Imagens.length > 0"
                >
                    <v-col
                        cols="12"
                        sm="3"
                        lg="3"
                        xl="3"
                        class="my-5"
                        v-for="(item, position) in item.Imagens"
                        :key="item.id"
                    >
                        <p>{{ item.nome }}</p>
                        <v-card
                            elevation="8"
                            max-height="150"
                            max-width="270"
                        >
                            <v-img 
                                max-height="150"
                                max-width="270"
                                :lazy-src="ExibirImagem(item)"
                                :src="ExibirImagem(item)"
                            >
                            </v-img>
                        <v-card-actions
                            class="justify"
                        >
                            <v-btn
                                outlined
                                color="green"
                                @click="AbrirImagem(ExibirImagem(item))"
                            >
                                Abrir
                            </v-btn>
                            <v-btn
                                outlined
                                color="red"
                                @click="ExcluirImagem(position, item)"
                            >
                                Excluir
                            </v-btn>
                        </v-card-actions>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
            <dialog-not-persistent-component :dialogNew="dialogImagem">
                <v-img 
                    max-height="500"
                    max-width="500"
                    :src="imagemShow"></v-img>
            </dialog-not-persistent-component>
            <load-component :Ativo="loader"/>
        </template>
    </dialog-component>
</template>
<script>

import api from '@/services/api.js'
import DialogComponent from '../Fields/DialogComponent.vue'
import DialogNotPersistentComponent from '../Fields/DialogNotPersistentComponent.vue'
import LoadComponent from '../Fields/LoadComponent.vue'

export default {
  components: { DialogComponent, DialogNotPersistentComponent, LoadComponent },
    name: 'AbrirTopicoComponent.vue',
    data: () => ({
        tituloDialog: 'Tópico',
        overlay: false,
        imagemShow: null,
        dialogImagem: false,
        loader: false,
    }),
    
    methods: {
        closeDialog() {
            this.$emit('close', false)
        },

        quebraLibra(descricao) {
            if (!descricao) return

            descricao = descricao.replaceAll("\n", '<br/>')

            return descricao
        },

        AbrirImagem(img){
            this.imagemShow = img;
            this.dialogImagem = !this.dialogImagem
        },

        ExcluirImagem(position, item) {

            this.loader = !this.loader;
            debugger

            api.delete('Topico/Imagem/'+item.id)
            .then(response => {
                this.item.Imagens.splice(position, 1)
                //this.$emit('salvar', { success: true, response: response })
            })
            .catch(error => {
                //this.$emit('salvar', { success: false, response: error })
                console.log(error)
            })
            .finally(() => this.loader = !this.loader)
        },

        ExibirImagem(item) {
            debugger
            this.item.Imagens
            return window.atob(item.imagem)
        }
    },

    watch: {
        item(val) {
            this.tituloDialog = val.codigo +' - ' + val.titulo
        }
    },

    props: {
        dialog: Boolean,
        item: Object
    }
}
</script>
<style>

    .quebralinha{
        word-break: break-all;
    }

    .font {
        color: black;
    }
    
</style>
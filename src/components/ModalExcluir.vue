<template>
    <v-dialog
        v-model="excluir"
        max-width="290"
        >
        <v-card>
            <v-card-title class="text-h5">
                Excluir               
            </v-card-title>
            <v-card-text>
                Deseja realmente excluir?
            </v-card-text>
            <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
                color="red"
                text
                @click="() => {this.$emit('fechar', true)}"
            >
                Cancelar
            </v-btn>

            <v-btn
                color="success"
                text
                @click="Deletar()"
            >
                Excluir
            </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>

import api from '@/services/api.js'

export default {
    name: 'ModalExcluir',
    data: () => ({
    }),
    methods: {
        Deletar() {
            api.delete('/Pergunta', {
                data: {
                    id: this.item.id,
                    titulo: this.item.titulo,
                    descricao: this.item.descricao
                }
            }
            ).then(response => {
                if (response.data == true) {
                    this.excluir = !this.excluir;

                    this.$emit('retorno', {
                        modalExcluir: false,
                        success: true
                    });
                }
            }).catch(function (error) {
                console.log(error);
            })
        }
    },
    props: {
        excluir: false,
        item: Object,
        index: Number
    },
}
</script>
<style>
    
</style>
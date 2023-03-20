<template>
    <dialog-component
        :tituloDialog="tituloDialog"
        :dialog="dialog"
        @close="closeDialog"
    >
        <template v-slot:text>
            <v-form
                ref="form" 
                class="px-4 mt-3"
            >
                <v-text-field
                    v-model="titulo"
                    label="Titulo"
                    prepend-icon="mdi-text-box-edit"
                    :rules="required"
                />
                <v-textarea
                    v-model="descricao"
                    label="Descrição"
                    prepend-icon="mdi-text-box-edit"
                    counter="5000"
                    :rules="requiredDescricao"
                />
                <v-file-input
                    v-model="imagem"
                    accept="image/*"
                    label="Imagem"
                    prepend-icon="mdi-camera"
                    @change="onFilePicked"
                    multiple
                />
            </v-form>
        </template>
        <template v-slot:actions>
            <v-btn
                color="green darken-1"
                text
                @click="Acao()"
                >
                Salvar
            </v-btn>
        </template>
        <load-component :Ativo="loader"/>
    </dialog-component>
</template>
<script>

import api from '@/services/api.js'
import DialogComponent from '../Fields/DialogComponent.vue'
import LoadComponent from '../Fields/LoadComponent.vue'

export default {
  components: { DialogComponent, LoadComponent },
    name: 'CadastrarEditarTopicoComponent',
    data: () => ({
        tituloDialog: 'Tópico',
        titulo: null,
        imagem: null,
        descricao: null,
        loader: false,
        DadosImage: [],
        required: [
            v => !!v || 'Campo Obrigatório'
        ],
        requiredDescricao: [
            v => !!v || 'Campo Obrigatório',
            v => v.length < 5000 || 'Maximo 5000 caracteres'
        ]
    }),

    methods: {
        onFilePicked(e) {
            
            this.DadosImage = []

            if (e == null) {
                return
            }

            e.forEach(element => {
                if(element.name.lastIndexOf('.') <= 0) {
                    return
                }
                const fr = new FileReader ()
                fr.readAsDataURL(element)
                fr.addEventListener('load', () => {
                    this.DadosImage.push(
                        {
                            Id: element.id,
                            Nome: element.name,
                            Imagem: window.btoa(fr.result)
                        })
                })
            });
        },

        limparCampos() {
            this.titulo = null
            this.descricao = null
        },

        closeDialog() {
            this.limparCampos()
            this.$emit('close', false)
        },

        Acao() {
            if (this.acao == 'Editar') {
                this.Editar()
            }
            else
            {
                this.Salvar()
            }
        },

        Salvar() {
            if (!this.$refs.form.validate()) 
                return

            this.loader = !this.loader;

            api.post('Topico',
            {
                Titulo: this.titulo,
                Descricao: this.descricao,
                MenuId: this.menuId,
                Imagens: this.DadosImage
            })
            .then(response => {
                this.$emit('salvar', { success: true, response: response })
            })
            .catch(error => {
                this.$emit('salvar', { success: false, response: error })
                console.log(error)
            })
            .finally(() => this.loader = !this.loader)
        },

        Editar() {
            if (!this.$refs.form.validate())
                return

            this.loader = !this.loader;

            api.put('Topico',
            {
                Id: this.item.codigo,
                Titulo: this.titulo,
                Descricao: this.descricao,
                MenuId: this.menuId,
                Imagens: this.DadosImage
            })
            .then(response => {
                debugger
                this.$emit('salvar', { success: true, response: response })
            })
            .catch(error => {
                debugger
                this.$emit('salvar', { success: false, response: error })
                console.log(error)
            })
            .finally(() => this.loader = !this.loader)
        },
    },

    watch: {
        dialog(val) {

            if (!val) return

            this.imagem = null
            this.DadosImage = []

            if (this.acao != 'Editar') {
                this.limparCampos()
            }
            else 
            {
                this.titulo = this.item.titulo,
                this.descricao = this.item.descricao
            }
        }
    },

    props: {
        dialog: Boolean,
        menuId: Number,
        item: Object,
        acao: String
    }
}
</script>
<style>
    
</style>
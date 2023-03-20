<template>
    <v-container 
        fluid
        >
        <v-row justify="center" class="my-15" >
            <h1>Fac - Empresarial</h1>
        </v-row >
        <v-row justify="center">
            <v-col cols="3">
                
                <v-text-field
                    label="Pesquisar"
                    v-model="pesquisa"
                    @keyup="Pesquisar"
                ></v-text-field>
            </v-col>
        </v-row>
        <v-row class="ma-15">
            <v-expansion-panels popout>
            <v-expansion-panel
                v-for="(item,i) in itens"
                :key="i"
            >
                <v-expansion-panel-header>
                    <div>
                        <v-icon>mdi-cloud-question</v-icon>
                        <span class="ml-3">{{item.id}} - {{item.titulo}}</span>
                    </div>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                    <v-row class="ma-3 quebralinha" v-html="item.descricao">
                    </v-row>
                    <v-row 
                        class="ma-4 mt-10"
                        v-if="imgs.length > 0"
                    >
                        <v-col
                            cols="12"
                            sm="3"
                            lg="3"
                            xl="3"
                            v-for="(img, i) in imgs"
                            :key="i"
                        >
                            <v-card
                                elevation="8"
                                @click="overlay = !overlay"
                                max-height="150"
                                max-width="270"
                            >
                                <v-img 
                                    max-height="150"
                                    max-width="270"
                                    :lazy-src="img.url"
                                    :src="img.url"
                                    @click="AbrirImagem(img.url)"
                                >
                                </v-img>
                                <v-overlay :value="overlay">
                                    <v-img 
                                        max-height="500"
                                        max-width="500"
                                        :src="imagemShow"></v-img>
                                </v-overlay>
                            </v-card>
                        </v-col>
                    </v-row>
                    <v-row class="ma-2">
                        <v-spacer></v-spacer>
                        <button
                            @click="ExibirExcluir(item, i)"
                        >
                            <v-icon>mdi-delete</v-icon>
                        </button>
                    </v-row>
                </v-expansion-panel-content>
            </v-expansion-panel>
            </v-expansion-panels>
            <v-row 
                justify="center"
                class="mt-8" 
                v-if="carregar">
                <v-progress-circular
                    :size="50"
                    color="primary"
                    indeterminate
                ></v-progress-circular>
            </v-row>
            <v-btn
                color="blue"
                fab
                large
                dark
                bottom
                right
                flex
                absolute
                class="mb-15 mr-5"
                @click="dialog = !dialog"
                >
                <v-icon>mdi-plus</v-icon>
            </v-btn>
        </v-row>
        <v-dialog
                v-model="dialog"
                max-width="1000px"
            >
                <v-card class="pa-5">
                    <v-card-title>
                        Pergunta
                    </v-card-title>
                    <v-card-text>
                        <v-text-field
                            v-model="titulo"
                            label="Titulo"
                            :rules="tituloRules"
                            required
                         ></v-text-field>
                        <v-textarea
                            counter
                            v-model="descricao"
                            label="Descricao"
                            :rules="descricaoRules"
                            required
                        ></v-textarea>
                        <v-file-input
                            v-model="files"
                            color="deep-purple accent-4"
                            counter
                            label="Inserir imagem"
                            accept="image/png, image/jpeg, image/bmp"
                            multiple
                            placeholder="Inserir imagens"
                            prepend-icon="mdi-paperclip"
                            outlined
                            :show-size="1000"
                            class="mt-6"
                        >
                            <template v-slot:selection="{ index, text }">
                            <v-chip
                                v-if="index < 2"
                                color="deep-purple accent-4"
                                dark
                                label
                                small
                            >
                                {{ text }}
                            </v-chip>

                            <span
                                v-else-if="index === 2"
                                class="text-overline grey--text text--darken-3 mx-2"
                            >
                                +{{ files.length - 2 }} Arquivo(s)
                            </span>
                            </template>
                        </v-file-input>
                    </v-card-text>
        
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                        text
                        color="success"
                        @click="Salvar()"
                        >
                        Salvar
                        </v-btn>
                    </v-card-actions>
                    </v-card>
        </v-dialog>
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
                @click="excluir = false"
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
    </v-container>
</template>
<script>

import api from '@/services/api.js'
import ModalExcluir from './ModalExcluir.vue';

export default {
    name: 'Principal',
    components: { 
        ModalExcluir 
    },
    data() {
        return {
            dialog: false,
            excluir: false,
            titulo: '',
            descricao: '',
            itensRetornados: [],
            itens: [],
            pesquisa: '',
            carregar: false,
            bottom: false,
            paginacao: 1,
            item: {},
            index: 0,
            overlay: false,
            imagemShow: '',
            tituloRules: [v => !!v || 'Título é Obrigatório!'],
            descricaoRules: [v => !!v || 'Descrição é Obrigatório!'],
            imgs: [
                {
                    url: 'https://images8.alphacoders.com/101/thumbbig-1013802.webp'
                },
                {
                    url: 'https://i.pinimg.com/564x/03/cc/ec/03ccecff3b40772af123a5de9b05b604.jpg'
                },
                {
                    url: 'https://images8.alphacoders.com/101/thumbbig-1013802.webp'
                },
                {
                    url: 'https://images8.alphacoders.com/101/thumbbig-1013802.webp'
                }
            ],
            files: []
        }
    },
    methods: {
        ExibirExcluir(item, i){
            this.excluir = !this.excluir;
            this.item = item;
            this.index = i;
        },
        Deletar(){
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
                    this.Buscar()
                    this.itens.splice(this.index, 1)
                }
            }).catch(function (error) {
                console.log(error);
            })
        },
        bottomVisible() {
            const scrollY = window.scrollY
            const visible = document.documentElement.clientHeight
            const pageHeight = document.documentElement.scrollHeight
            const bottomOfPage = visible + scrollY >= pageHeight
            return bottomOfPage || pageHeight < visible
        },
        Pesquisar(){
            this.itens = []
            
            if(this.pesquisa == "")
                this.itens = this.itensRetornados;
            else
            {
                this.itens = this.itensRetornados.filter(x => x.titulo.toUpperCase().includes(this.pesquisa.toUpperCase()) || 
                                                         x.id.toString().toUpperCase().includes(this.pesquisa.toUpperCase()) ||
                                                         x.descricao.toUpperCase().includes(this.pesquisa.toUpperCase()));

                if (this.itens.length <= 0)
                    this.PesquisarPalavraChave(this.pesquisa)
            }

        },
        PesquisarPalavraChave(palavra){
            api.get('/Pergunta/palavrachave/' + palavra.toUpperCase())
            .then(response => {
                response.data.forEach(item => {
                  this.itens.push({
                    id: item.id,
                    titulo: item.titulo,
                    descricao: item.descricao   
                  })  
                })
            })
        },
        Salvar() {
            if(this.titulo == "" || this.descricao == "") return
            api.post('/Pergunta', 
            {
                titulo: this.titulo,
                descricao: this.descricao
            }).then(response => {
                this.itensRetornados.push({
                    id: response.data,
                    titulo: this.titulo,
                    descricao: this.descricao.replaceAll('\n', '<br\>')
                })

                this.titulo = "";
                this.descricao = "";
                this.pesquisa = "";
                this.itens = this.itensRetornados;
                this.dialog = false;

                this.SalvarImagem()

            }).catch(function (error) {
                console.log(error);
            })
        },
        SalvarImagem(){
            var reader = new FileReader();
            reader.readAsDataURL(this.files)
            console.log(this.files)
        },
        Buscar(){
            api.get('/Pergunta/?pagina='+ this.paginacao)
            .then(response => { 
                this.itens = [];
                this.carregar = false
                this.paginacao ++
                response.data.forEach(item => {
                    this.itensRetornados.push({
                        id: item.id,
                        titulo: item.titulo,
                        descricao: item.descricao.replaceAll('\n', '<br\>')
                    })
                });

                this.itens = this.itensRetornados;
            });
        },
        AbrirImagem(img){
            this.imagemShow = img;
        }
    },
    watch: {
        bottom(bottom) {
            if (bottom) {
                this.carregar = true;
                this.Buscar()
            }
        },
    },
    created(){
        window.addEventListener('scroll', () => {
            this.bottom = this.bottomVisible()
        });
        this.Buscar();
    }
}
</script>
<style>
    .quebralinha{
        word-break: break-all;
    }
</style>
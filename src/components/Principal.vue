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
                    <v-row class="ma-3">
                        {{item.descricao}}
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
        </v-row>
    </v-container>
</template>
<script>

import api from '@/services/api.js'

export default {
    name: 'Principal',
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
            tituloRules: [v => !!v || 'Título é Obrigatório!'],
            descricaoRules: [v => !!v || 'Descrição é Obrigatório!']
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
            if(this.pesquisa == "")
                this.itens = this.itensRetornados;
            else
                this.itens = this.itensRetornados.filter(x => x.titulo.toUpperCase().includes(this.pesquisa.toUpperCase()) || 
                                                         x.id.toString().toUpperCase().includes(this.pesquisa.toUpperCase()) ||
                                                         x.descricao.toUpperCase().includes(this.pesquisa.toUpperCase()));
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
                    descricao: this.descricao
                })

                this.titulo = "";
                this.descricao = "";
                this.pesquisa = "";
                this.itens = this.itensRetornados;
                this.dialog = false;

                console.log(response.data);
            }).catch(function (error) {
                console.log(error);
            })
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
                        descricao: item.descricao
                    })
                });

                this.itens = this.itensRetornados;
            });
        }
    },
    watch: {
        bottom(bottom) {
            if (bottom) {
                this.carregar = true;
                this.Buscar()
            }
        }
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
    
</style>
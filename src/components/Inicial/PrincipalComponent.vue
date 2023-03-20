<template>
    <v-app id="inspire">
        <v-navigation-drawer
        v-model="drawer"
        app
        dark
        >
            <v-container>
                <v-list>
                    <v-list-item-group
                        v-model="list"
                    >
                        <v-list-item
                        v-for="item in menus"
                        :key="item.title"
                        link
                        @click="Acesso(item)"
                        >
                            <v-list-item-icon>
                                <v-icon>{{ item.icon }}</v-icon>
                            </v-list-item-icon>

                            <v-list-item-content>
                                <v-list-item-title>{{ item.title }}</v-list-item-title>
                            </v-list-item-content>
                        </v-list-item>
                    </v-list-item-group>
                </v-list>
            </v-container>
        </v-navigation-drawer>

        <v-app-bar app dark>
            <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
        </v-app-bar>

        <v-main>
            <alert-component :texto-alerta="textoAlerta" :tipo='tipoAlerta' v-if="alerta == true" hidden/>
            <v-card>
                <v-card-title>
                    {{titulo}}
                <v-spacer></v-spacer>
                <v-text-field
                    v-model="search"
                    append-icon="mdi-magnify"
                    label="Pesquisar"
                    single-line
                    hide-details
                ></v-text-field>
                <v-btn
                    class="text-right ml-10 mr-5"
                    large
                    right
                    color="primary"
                    @click="Novo()"
                    >
                    Novo
                </v-btn>
                </v-card-title>
            <v-data-table
            :headers="headers"
            :items="topicos"
            :search="search"
            :footer-props="{
                'items-per-page-text':'Linhas por pagina',
                'items-per-page-options': [5, 10, 20, 50]
            }"
            :header-props="{
                'sortByText': 'Ordenar'
            }"
            :sort-desc.sync="sortDesc"
            :sort-by.sync="sortBy"
            >
                <template v-slot:item.acessar="{ item }">
                    <v-icon
                        midium
                        class="mr-3"
                        @click="AbrirTopico(item)"
                        color="green"
                    >
                        mdi-arrow-right-bold-circle
                    </v-icon>
                </template>
                <template v-slot:item.actions="{ item }">
                    <v-icon
                        midium
                        class="mr-3"
                        @click="Editar(item)"
                    >
                        mdi-pencil
                    </v-icon>
                    <v-icon
                        class="mr-3"
                        midium
                        @click="Deletar(item)"
                    >
                        mdi-delete
                    </v-icon>
                </template>
            </v-data-table>
            </v-card>
        </v-main>
        <load-component :Ativo="loader"/>
        <!-- <dialog-component :dialog="dialog" @close="retonoDialog" @salvar="retonoDialogSalvar" :menuId="menuId" hidden/> -->
        <cadastrar-editar-topico-component :acao="acao" :item="itemEditar" :dialog="dialog" :menuId="menuId" @close="retonoDialog" @salvar="retonoDialogSalvar"  hidden/>
        <abrir-topico-component :dialog="dialogTopico" @close="retonoDialog" @salvar="retonoDialogSalvar" :item="itemTopico" hidden/>
  </v-app>
</template>
<script>

import api from '@/services/api.js'
import LoadComponent from '../Fields/LoadComponent.vue'
import DialogComponent from '../Fields/DialogComponent.vue'
import AlertComponent from '../Fields/AlertComponent.vue'
import CadastrarEditarTopicoComponent from './CadastrarEditarTopicoComponent.vue'
import AbrirTopicoComponent from './AbrirTopicoComponent.vue'

export default {
  components: { LoadComponent, DialogComponent, AlertComponent, CadastrarEditarTopicoComponent, AbrirTopicoComponent },
    name: 'PrincipalComponent',
    data: () => ({
        drawer: null,
        menus: [],
        list: null,
        loader: false,
        dialog: false,
        dialogTopico: false,
        alerta: false,
        search: '',
        textoAlerta: '',
        tipoAlerta: '',
        titulo: null,
        menuId: null,
        itemTopico: {},
        itemEditar: {},
        acao: null,
        headers: [
            { text: '', value: 'acessar', width: "30", align: "center" },
            { text: 'Código', value: 'codigo', width: "100", align: "center" },
            { text: 'Titulo', value: 'titulo', width: "720"},
            { text: 'Ações', value: 'actions', sortable: false, align: "center" }
        ],
        sortBy: 'codigo',
        sortDesc: true,
        topicos: []
    }),

    methods: {

        Acesso(item) {
            this.BuscarTopicos(item.id)
            this.titulo = item.title
            this.menuId = item.id
        },

        AbrirTopico(item) {
            this.itemTopico = item
            this.dialogTopico = !this.dialogTopico
        },

        Novo() {
            this.itemEditar = {}
            this.acao = 'Novo'
            this.dialog = true
        },
        
        Editar(item) {
            this.acao = 'Editar'
            this.itemEditar = item
            this.dialog = !this.dialog
        },

        Deletar(item) {

            this.loader = !this.loader;

            api.delete('Topico/'+item.codigo)
            .then(response => {
                this.EnableAlert('Excluido com sucesso!', 'success')
                this.BuscarTopicos(this.menuId)
            })
            .catch(error => {
                console.log(error)
            })
            .finally(() => this.loader = !this.loader)

        },

        EnableAlert(texto, tipoAlerta) {
            this.alerta = true
            this.tipoAlerta = tipoAlerta
            this.textoAlerta = texto

            setTimeout(() => {
                this.alerta = false
            }, 2300)
        },

        retonoDialog(retorno) {
            this.dialog = false
            this.dialogTopico = false
        },

        retonoDialogSalvar(retorno) {
            if (retorno.success) {
                this.EnableAlert('Salvo com sucesso!', 'success')
                this.BuscarTopicos(this.menuId)
                this.dialog = false
            }
            else {
                this.EnableAlert(retorno.data, 'error')
                this.BuscarTopicos(this.menuId)
                this.dialog = false
            }
        },

        BuscarMenu() {
            
            this.loader = !this.loader;

            api.get('Topico/Menu')
            .then(response => {
                this.menus = []
                response.data.$values.forEach(element => {
                    this.menus.push({
                        id: element.id,
                        title: element.title,
                        icon: element.icon
                    })
                });

                this.titulo = this.menus[0].title
                this.menuId = this.menus[0].id
                this.BuscarTopicos(this.menus[0].id)
            })
            .catch(error => {
                console.log(error)
            })
            .finally(() => this.loader = !this.loader)
        },

        BuscarTopicos(menuId) {

            this.loader = !this.loader;

            api.get('Topico/MenuId/'+menuId)
            .then(response => {
                this.topicos = []
                response.data.$values.forEach(element => {
                    this.topicos.push({
                        codigo: element.id,
                        titulo: element.titulo,
                        descricao: element.descricao,
                        Imagens: element.topicoImagens.$values
                    })
                });
            })
            .catch(error => {
                console.log(error)
            })
            .finally(() => this.loader = !this.loader)
        }
    },

    created() {
        this.BuscarMenu()
    },

}

</script>
<style scoped>
    .v-main {
        padding: 15px 15px 0px 15px !important;
    }

    

</style>>
  
</style>
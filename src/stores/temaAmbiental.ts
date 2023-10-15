import { defineStore } from 'pinia'
import biomesData from "/@src/assets/data/temaAmbiental.json";
import axios from "axios"

export const useTemaAmbiental = defineStore('temaAmbiental', {
  state() {
    return {
      temas: {//'geomorfologia', 'pedologia', 'clima', 'vegetacao', 'hidrografia', 'uso-do-solo', 'impactos-ambientais'],
        'geologia':{id:1,name:'Geologia',icon:'fa fa-globe-americas',nickname:'geologia',text:''},
        'solos':{id:2,name:'Solos',icon:'iconoir iconoir-soil-alt',nickname:'solos',text:''},
        'vegetacao':{id:3,name:'Vegetação',icon:'fa fa-tree',nickname:'vegetacao',text:''},
        'clima':{id:4,name:'Clima',icon:'fa fa-cloud-sun', nickname:'clima',text:''},
        'relevo':{id:5,name:'Relevo',icon:'fa fa-mountain',  nickname:'relevo',text:''},
        'hidrografia':{id:6,name:'Hidrografia',icon:'fa fa-water', nickname:'hidrografia',text:''},
        'uso-do-solo':{id:7,name:'Uso do Solo',icon:'fa fa-map-marked-alt', nickname:'uso-do-solo',text:''},
        'impactos-ambientais':{id:8,name:'Impactos Ambientais',icon:'fa fa-exclamation-triangle', nickname:'impactos-ambientais',text:''},
      },
      tema: 'geologia',
      bioma: 'cerrado',
      biomas: biomesData,
      text:''
    }
  },

  actions: {
    async setTemas(tema: string) {
      try {
        const response = await axios.get('/data/'+this.bioma+'/'+tema+'.md');
        this.temas[tema]['text'] = response.data;

      } catch (error) {
        console.error('Erro ao carregar o conteúdo MD:', error);
        this.temas[tema]['text'] = 'Erro ao carregar o conteúdo MD';
      }
    },

    setTema(tema: string) {
      this.tema = tema
    },

    setFocos(divId: string) {
      this.tema = divId
      const divElement = document.getElementById('title-'+divId);
      if (divElement) {
        divElement.focus();
      }
    },
    setTemaByID(tema:string) {
      this.tema = tema
      console.log(tema)
    }

  },


  getters: {

    getTema(): string {
      return this.biomas[this.bioma][this.tema]
    },
    getTemaName(): string {
      return this.temas[this.tema]['name']
    },
    getBiomaName(): string {
        return this.biomas[this.bioma]['nome']
    },
    getBiomaDescricao(): string {
        return this.biomas[this.bioma]['descricao']
    },

  },
})

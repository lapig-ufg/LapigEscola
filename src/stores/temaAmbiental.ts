import { defineStore } from 'pinia'
import biomesData from "/@src/assets/data/temaAmbiental.json";
import axios from "axios"

export const useTemaAmbiental = defineStore('temaAmbiental', {
  state() {
    return {
      tema: 'geologia',
      bioma: 'cerrado',
      biomas: biomesData,
      modal: false,
      text:''
    }
  },

  actions: {
    async setTema(tema: string) {
      this.tema = tema
      
      try {
        const response = await axios.get('/data/'+this.bioma+'/'+this.tema+'.md');
        this.text = response.data;
        this.modal = true
      } catch (error) {
        console.error('Erro ao carregar o conteúdo MD:', error);
        this.text = 'Erro ao carregar o conteúdo MD';
        this.modal = true
      }
    },
    closeModal() {
      this.modal = false
    },
    
    

  },



  getters: {
    
    getTema(): string {
      return this.biomas[this.bioma][this.tema]
    },

    getBiomaName(): string {
        return this.biomas[this.bioma]['nome']
    },
    getBiomaDescricao(): string {
        return this.biomas[this.bioma]['descricao']
    },

  },
})

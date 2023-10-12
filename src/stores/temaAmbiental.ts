import { defineStore } from 'pinia'
import biomesData from "@/assets/biomes.json";

export const useTemaAmbiental = defineStore('temaAmbiental', {
  state() {
    return {
      tema: 'geologia',
      bioma: 'cerrado',
      biomas: biomesData,
    }
  },

  actions: {
    setTema(tema: string) {
      this.tema = tema
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

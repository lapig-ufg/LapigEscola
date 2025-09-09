

export default function useAPI(path:string) {
  const runtimeConfig = useRuntimeConfig()

  return useFetch(`${runtimeConfig.public.apiBase}${path}`)

}

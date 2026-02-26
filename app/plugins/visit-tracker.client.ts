export default defineNuxtPlugin(() => {
  const pieces = [
    'signal', 'threshold', 'decay', 'grow', 'echo', 'tide',
    'absence', 'shift', 'return', 'interference', 'resonance',
    'room', 'drift', 'path', 'void', 'erasure', 'thread',
  ]

  const router = useRouter()
  router.afterEach((to) => {
    const name = to.path.slice(1)
    if (pieces.includes(name)) {
      try {
        const key = 'sq-visited'
        const visited: string[] = JSON.parse(localStorage.getItem(key) || '[]')
        if (!visited.includes(name)) {
          visited.push(name)
          localStorage.setItem(key, JSON.stringify(visited))
        }
      } catch {}
    }
  })
})

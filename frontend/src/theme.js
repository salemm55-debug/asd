export function getStoredTheme() {
  return localStorage.getItem('theme') || 'light'
}

export function applyTheme(theme) {
  const root = document.documentElement
  const body = document.body
  if (theme === 'dark') {
    body.classList.add('dark')
  } else {
    body.classList.remove('dark')
  }
  localStorage.setItem('theme', theme)
}



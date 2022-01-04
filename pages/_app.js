import Index from './index'
import { buildLayout } from '@/util/layout'
import '@/styles/index.scss'

function App({ Component, pageProps, router }) {
   
  // Default to a blank component until we figure out what we're rendering based on auth
  let ValidComponent = () => <></>

  // just do default behavior
  ValidComponent = Component

  // Wrap component in layouts (if it has them) and inject props, user and token
  return buildLayout(ValidComponent.Layouts || [], ValidComponent, {...pageProps})
}

export default App
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

function SimpleApp() {
    return <h1>Hello World - React is working!</h1>
}

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <SimpleApp />
    </StrictMode>,
)

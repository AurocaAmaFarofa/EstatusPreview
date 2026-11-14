// Dados usados em várias partes do site. Atualize este arquivo para mudar
// contatos, endereço, links, programação e fotos sem precisar editar os componentes.

// Função para gerar caminhos compatíveis com o Vite e GitHub Pages.
// Os arquivos devem ficar dentro de public/img.
const IMG = (name) => `${import.meta.env.BASE_URL}img/${name}`

// WhatsApp no formato internacional: código do país + DDD + número, sem "+" ou espaços.
export const WHATS = '5549991132624'

// Cria um link de conversa. O texto opcional aparece preenchido no WhatsApp.
export const wa = (t = 'Olá! Vim pelo site da Estatus Lounge.') =>
  `https://wa.me/${WHATS}?text=${encodeURIComponent(t)}`

// Endereço mostrado no site.
export const ADDRESS = 'Rua Sete de Setembro, 1011, Dionísio Cerqueira – SC'

// Endereço usado nas buscas e rotas do Google Maps.
const q = encodeURIComponent(
  'Rua Sete de Setembro 1011, Dionísio Cerqueira, SC'
)

export const MAP_EMBED = `https://www.google.com/maps?q=${q}&output=embed`
export const MAP_ROUTE = `https://www.google.com/maps/dir/?api=1&destination=${q}`

// Link do perfil oficial do Instagram.
export const INSTAGRAM_URL = 'https://www.instagram.com/estatuslounge/'

// Imagem de fundo da primeira seção.
export const HERO_BG = IMG('foto-estatus.webp')

// Itens do menu. O id precisa corresponder ao id de uma seção da página.
export const LINKS = [
  { id: 'inicio', label: 'Início' },
  { id: 'sobre', label: 'Sobre' },
  { id: 'eventos', label: 'Eventos' },
  { id: 'galeria', label: 'Galeria' },
  { id: 'contato', label: 'Contato' },
]

// Programação exibida na seção "Próximos eventos".
export const EVENTS = [
  {
    title: 'Dj Arana',
    date: '11 de dezembro',
    time: '23:00',
    desc: 'Show do Dj arana.',
    img: IMG('DjArana-Show.webp'),
    poster: IMG('DjArana-Show.webp'),
    grad: '',
    isExample: false,
  },
]

// Fotos exibidas na galeria.
// Coloque os arquivos em public/img e informe o nome em src.
export const GALLERY = [
  {
    label: '',
    src: IMG('foto-estatus.webp'),
    size: 'square',
    isRealPhoto: true,
  },
  {
    label: '',
    src: IMG('foto-cantores-estatus.png'),
    size: 'landscape',
    isRealPhoto: true,
  },
  {
    label: '',
    src: IMG('Faxada-estatus.webp'),
    size: 'landscape',
    isRealPhoto: true,
  },
]

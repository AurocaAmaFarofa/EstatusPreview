// Dados usados em várias partes do site. Atualize este arquivo para mudar
// contatos, endereço, links, programação e fotos sem precisar editar os componentes.

// WhatsApp no formato internacional: código do país + DDD + número, sem "+" ou espaços.
export const WHATS = '5549991132624'

// Cria um link de conversa. O texto opcional aparece preenchido no WhatsApp.
export const wa = (t = 'Olá! Vim pelo site da Estatus Lounge.') =>
  `https://wa.me/${WHATS}?text=${encodeURIComponent(t)}`

// Endereço mostrado no site.
export const ADDRESS = 'Rua Sete de Setembro, 1011, Dionísio Cerqueira – SC'

// Endereço usado nas buscas e rotas do Google Maps (mantenha-o atualizado junto com ADDRESS).
const q = encodeURIComponent(
  'Rua Sete de Setembro 1011, Dionísio Cerqueira, SC'
)
export const MAP_EMBED = `https://www.google.com/maps?q=${q}&output=embed`
export const MAP_ROUTE = `https://www.google.com/maps/dir/?api=1&destination=${q}`

// Link do perfil oficial do Instagram.
export const INSTAGRAM_URL = 'https://www.instagram.com/estatuslounge/'

// Imagem de fundo da primeira seção. Os arquivos devem ficar em public/img.
export const HERO_BG = '/img/foto-estatus.webp'

// Itens do menu. O id precisa corresponder ao id de uma seção da página.
export const LINKS = [
  { id: 'inicio', label: 'Início' },
  { id: 'sobre', label: 'Sobre' },
  { id: 'eventos', label: 'Eventos' },
  { id: 'galeria', label: 'Galeria' },
  { id: 'contato', label: 'Contato' },
]

// Programação exibida na seção "Próximos eventos".
// Para adicionar um evento, copie um objeto e atualize seus dados:
// - title: nome; date e time: data e horário exibidos no card e nos detalhes.
// - desc: descrição; img: imagem de capa do card.
// - poster: cartaz mostrado nos detalhes (se omitido, usa img).
// - grad: classes Tailwind para o fundo quando a imagem não preencher a área.
// - isExample: true mostra o selo "Evento de exemplo"; use false em eventos reais.
export const EVENTS = [
  {
    title: 'Dj Arana',
    date: '11 de dezembro',
    time: '23:00',
    desc: 'Show do Dj arana.',
    img: '/img/DjArana-Show.webp',
    poster: '/img/DjArana-Show.webp',
    grad: '',
    isExample: false,
  },
]

// Fotos exibidas na galeria. Coloque os arquivos em public/img e informe o caminho em src.
// label é o texto acessível da foto; size controla o formato: "square" (3x3)
// ou "landscape" (4x3). isRealPhoto: false oculta a foto da galeria.
export const GALLERY = [
  {
    label: '',
    src: '/img/foto-estatus.webp',
    size: 'square',
    isRealPhoto: true,
  },
  {
    label: '',
    src: '/img/foto-cantores-estatus.png',
    size: 'landscape',
    isRealPhoto: true,
  },
  {
    label: '',
    src: '/img/Faxada-estatus.webp',
    size: 'landscape',
    isRealPhoto: true,
  },
]

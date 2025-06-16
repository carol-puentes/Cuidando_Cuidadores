// Screens/semanas/semana1.js
const semana1 = {
  semana: 1,
  titulo: 'Bienvenida y Primeros Pasos',
  objetivos: `
  Esta semana nos enfocaremos en:
  - Conocer el programa.
  - Identificar tus necesidades como cuidador(a).
  - Aprender una técnica sencilla y efectiva para relajarte: la Relajación Muscular de Benson.
  - Comenzar tu práctica diaria de autocuidado.
  `,
  recursos: [
    {
      tipo: 'pantalla',
      texto: 'Bienvenida al Taller',
      contenido: '¡Bienvenido(a) al taller "Cuidando a Cuidadores"! Durante las próximas 6 semanas, te acompañaremos con herramientas prácticas, reflexiones y apoyo para que puedas cuidar sin descuidarte. Este espacio es para ti. 💙'
    },
    {
      tipo: 'pantalla',
      texto: 'Diagnóstico Inicial',
      url: 'https://forms.gle/tu-formulario-ejemplo', // <-- Cambia por el link real
    },
    {
      tipo: 'video',
      texto: 'Instrucciones de la Técnica Benson',
      url: 'https://www.youtube.com/watch?v=tu-video-ejemplo', // <-- Cambia por el link real
    },
    {
      tipo: 'texto',
      texto: 'Pasos de la técnica de relajación Benson',
      contenido: `
        1. Busca un lugar tranquilo y siéntate cómodamente.
        2. Cierra los ojos lentamente.
        3. Relaja tus músculos desde los pies hasta la cara.
        4. Respira profundamente por la nariz, y al exhalar repite mentalmente una palabra que te calme (como "paz", "tranquilidad", "amor").
        5. Hazlo por 10-15 minutos.
        6. Al terminar, abre los ojos lentamente y descansa unos minutos más.
      `
    },
    {
      tipo: 'formulario',
      texto: 'Bitácora emocional',
      url: 'https://forms.gle/tu-bitacora-emocional', // <-- Cambia por el link real
    },
    {
      tipo: 'pantalla',
      texto: 'Resumen de la Semana',
      contenido: '✅ Participaste en la bienvenida.\n✅ Completaste tu diagnóstico inicial.\n✅ Aprendiste la técnica de relajación de Benson.\n✅ Comenzaste tu práctica diaria.\n\n¡Muy bien! Has dado el primer paso hacia tu bienestar. Nos vemos la próxima semana con nuevas herramientas para seguir cuidando de ti.'
    }
  ]
};

export default semana1;

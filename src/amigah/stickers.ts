// Sticker oracle deck. Images live in public/amigah/<id in lowercase>.webp
export interface StickerOracleItem {
  id: string;
  /** Release batch; the newest batch is announced in the collection */
  batch: number;
  message: string;
}

/** The greeting sticker that opens every chat; not part of the random draw */
export const GREETING_ID = 'AMIGAH';

export const STICKER_ORACLE_ITEMS: StickerOracleItem[] = [
  // --- Tanda 1 (2026/09) ---
  { id: 'CONSECUENCIAS', batch: 1, message: 'TE TOCA SOPORTARLA' },
  { id: 'AMIGAH', batch: 1, message: 'AMIGAH' },
  { id: 'FRENOS', batch: 1, message: '«Dale para adelante hasta que explote todo»\n-Julieta Banana' },
  { id: 'ASOCAFETAL', batch: 1, message: '¿POR QUÉ TAN CONSERVA?' },
  { id: 'VENDO', batch: 1, message: '¿POR QUÉ NO?' },
  { id: 'YANADA', batch: 1, message: 'DEJA ESE RESENTIMIENTO' },
  { id: 'SITUACION', batch: 1, message: 'ORDEN EN LA PEA ¡¡¡¡¡¡¡¡¡¡YA!!!!!!!!!!!!' },
  { id: 'HORRIBLE', batch: 1, message: 'A VECES LO FEO PEGA LA VUELTA Y SE VE HASTA BONITO' },
  { id: 'CERRANDO', batch: 1, message: 'NO PUEDES PASAR TODA LA VIDA PEGAD@ CON LA MISMA VAINA' },
  { id: 'DESVIARNOS', batch: 1, message: 'DUÉRMETE UN RATO Y DESPUÉS PIENSAS EN ESO' },
  { id: 'MOCO', batch: 1, message: '«¿A quién le importa lo que yo haga? ¿A quién le importa lo que yo diga?»\n-Alaska o Thalía, según a quién le preguntes.' },
  { id: 'TIERNO', batch: 1, message: 'NO IMPORTA LO QUE PASE, NUNCA PIERDAS TU TERNURA' },
  { id: 'STICKER', batch: 1, message: 'MEJOR NO DIGAS NADA ENTONCES' },
  { id: 'MEVOY', batch: 1, message: 'O MEJOR VETE SIN DESPEDIRTE' },
  { id: 'RETORNO', batch: 1, message: 'PARA ATRÁS NI PARA RETROCEDER EL CARRO' },
  { id: 'TRANQUILA', batch: 1, message: '¡¡¡¡¡¡¡¡¡¡¡¡¡¡CÁLMATE!!!!!!!!!!!!!!!!!!!!! ¡¡¡¡¡¡¡¡BASTA!!!!!!!!!!!!!' },
  { id: 'IMPAKTADA', batch: 1, message: 'NUNCA DEJARÁS DE SORPRENDERTE DEL ABSURDO DE LA VIDA' },
  { id: 'GRACIAS', batch: 1, message: 'MÁNDALE UNA CAPTURA DE ESTO A ESA PERSONA EN LA QUE ESTABAS PENSANDO, A MENOS QUE SEA UN EX NOVIO MANIPULADOR' },
  { id: 'PODAMOS', batch: 1, message: 'NUNCA SABES LO QUE PUEDE PASAR MAÑANA, CARPE DIEM' },
  { id: 'CONFIANZA', batch: 1, message: 'SI NO VAS A CONFIAR EN NADIE ENTONCES VETE A VIVIR A UNA CUEVA' },
  { id: 'DIOS', batch: 1, message: 'GOOD VIBES ONLY' },
  { id: 'DEMENCIA', batch: 1, message: 'QUE PASÓ QUÉ? AH? YO NO HABLO BIEN ESPAÑOL' },
  { id: 'ALGUIEN', batch: 1, message: '«No tengo imágen sin espejos\nNo tengo música sin ruido\nNo tengo brazos sin abrazos\nNo tengo vida si no tengo a mis amigos»\n-Robi Draco Rosa' },
  { id: 'INES', batch: 1, message: 'BÁJALE 2' },
  { id: 'LLORAR', batch: 1, message: 'NUNCA DEJES DE LLORAR CUANDO TE DE LA GANA' },
  { id: 'FRACASAR', batch: 1, message: 'RECUERDA TOMAR TU PASTILLA PARA LA CALVICIE' },
  // --- Tanda 2 (2026/10) ---
  { id: 'CERATI', batch: 2, message: 'TIENES QUE HABLAR CON ALGUIEN DE ESTO' },
  { id: 'TAZA', batch: 2, message: 'CUÉNTALO TODO, SUÉLTALO...AQUÍ ESTAMOS PARA ESCUCHARTE' },
  { id: 'ARTISTA', batch: 2, message: 'MÁS SEGURIDAD EN TI MISM@! HAY GENTE QUE NO PUEDE VER LA GENIALIDAD NI TROPEZÁNDOSE CON ELLA' },
  { id: 'SORPRENDE', batch: 2, message: 'DE VERDAD NO TE ESPERABAS QUE PASARA LO QUE TE ESTÁ PASANDO?' },
  { id: 'MEDIANAS', batch: 2, message: 'BAJA TUS EXPECTATIVAS, NO TODO TIENE QUE SER PERFECTO' },
  { id: 'MEZCLA', batch: 2, message: 'ACEPTA LAS CONTRADICCIONES DE LO QUE SIENTES' },
  { id: 'FELIZNOCHE', batch: 2, message: 'AY YA, DÉJALO IR, MAÑANA PIENSAS EN ESO' },
  { id: 'MENTIROSO', batch: 2, message: 'OJO CON LAS MENTIRAS!!! ;)' },
  { id: 'FASIL', batch: 2, message: 'QUIZÁS ES MÁS FASIL DE LO QUE PARECE ;)' },
  { id: 'CADAQUIEN', batch: 2, message: '«Las opiniones son como el culo: todos tenemos uno y a nadie le gusta el ajeno» PARDON MY FRENCH' },
  { id: 'MOSCA', batch: 2, message: 'MOMENTO PARA TENER UNA NOCHE ROMÁNTICA' },
  { id: 'FAVORES', batch: 2, message: 'UNA COSA ES SER BUENA GENTE, OTRA COSA ES SER PENDEJ@' },
  { id: 'LORENA', batch: 2, message: 'CREO QUE TÚ MISM@ SABES LA RESPUESTA...' },
  { id: 'DOLA', batch: 2, message: 'PÁGALE A LA GENTE POR LO QUE HACE...NO SEAS ASÍ' },
  { id: 'WEY', batch: 2, message: 'DILE A TUS AMIG@S QUE L@S QUIERES' },
  { id: 'CRACK', batch: 2, message: 'ERES UNA INCREÍBLE PERSONA, QUE NADIE DIGA LO CONTRARIO (AL MENOS QUE LO PUEDA DEMOSTRAR)' },
  { id: 'ABRAZO', batch: 2, message: 'TQM Y TE ABRAZO EN ESTE MOMENTO' },
  { id: 'VOS', batch: 2, message: 'SIN COMENTARIOS...' },
  { id: 'SENSACAO', batch: 2, message: 'CONECTA CON ESA SENSAÇÃO' },
];

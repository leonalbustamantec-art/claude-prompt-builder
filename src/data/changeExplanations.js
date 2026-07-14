export const CHANGE_EXPLANATIONS = {
  personaje: 'Cambiaste el personaje. Con otro protagonista, toda la historia se siente distinta.',
  accion: 'Cambiaste la acción. Con algo distinto ocurriendo, la historia cambia de ritmo.',
  lugar: 'Cambiaste el lugar. En otro escenario, la misma historia se ve completamente distinta.',
  estilo: 'Cambiaste el estilo. Con otro ánimo, la misma historia se siente como una idea nueva.',
}

export const SURPRISE_EXPLANATIONS = {
  personaje: (valor) =>
    `Cambiamos el personaje. Ahora es ${valor}, y toda la historia se lee distinta a su alrededor.`,
  accion: (valor) => `Cambiamos la acción. Ahora ${valor}, y eso le da otro ritmo a toda la historia.`,
  lugar: (valor) =>
    `Cambiamos el lugar. Ahora la historia sucede ${valor}, y se siente completamente distinta.`,
  estilo: (valor) => `Cambiamos el estilo. Ahora es ${valor}, y la misma idea se siente como otra historia.`,
}

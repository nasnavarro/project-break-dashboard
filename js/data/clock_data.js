// Guardamos las horas from / to expresados en minutos desde medianoche (h*60+m),
// para que sea más sencillo comparar con el momento actual.
// Uso: const m = new Date().getHours() * 60 + new Date().getMinutes();
//      TIME_MESSAGES.find(s => m >= s.from && m <= s.to)
// CONVERSIONES:
// 1 = 00:01 | 420 = 07:00
// 421 = 07:01 | 720 = 12:00
// 721 = 12:01 | 840 = 14:00
// 841 = 14:01 | 960 = 16:00
// 961 = 16:01 | 1080 = 18:00
// 1081 = 18:01 | 1320 = 22:00
// 1321 =  22:01 | 1440 = 00:00
export const TIME_MESSAGES = [
  { from:    1, to:  420, message: 'Es hora de descansar. Apaga y sigue mañana.' },
  { from:  421, to:  720, message: 'Buenos días, desayuna fuerte y a darle al código.' },
  { from:  721, to:  840, message: 'Echa un rato más pero no olvides comer.' },
  { from:  841, to:  960, message: 'Espero que hayas comido.' },
  { from:  961, to: 1080, message: 'Buenas tardes, el último empujón.' },
  { from: 1081, to: 1320, message: 'Esto ya son horas extras... piensa en parar pronto.' },
  { from: 1321, to: 1440, message: 'Buenas noches, es hora de pensar en parar y descansar.' },
];

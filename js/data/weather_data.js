export const CITIES = [
  {
    name: 'Alcorcón',
    default: true,
    img_url: {
      size_lg: './img/weather/cities/alcorcon_lg.jpg',
      size_md: './img/weather/cities/alcorcon_md.jpg',
      size_sm: './img/weather/cities/alcorcon_sm.jpg',
    },
  },
  {
    name: 'Madrid',
    default: false,
    img_url: {
      size_lg: './img/weather/cities/madrid_lg.jpg',
      size_md: './img/weather/cities/madrid_md.jpg',
      size_sm: './img/weather/cities/madrid_sm.jpg',
    },
  },
  {
    name: 'El Campello',
    default: false,
    img_url: {
      size_lg: './img/weather/cities/el_campello_lg.jpg',
      size_md: './img/weather/cities/el_campello_md.jpg',
      size_sm: './img/weather/cities/el_campello_sm.jpg',
    },
  },
  {
    name: 'Lugo',
    default: false,
    img_url: {
      size_lg: './img/weather/cities/lugo_lg.jpg',
      size_md: './img/weather/cities/lugo_md.jpg',
      size_sm: './img/weather/cities/lugo_sm.jpg',
    },
  },
  {
    name: 'New York',
    default: false,
    img_url: {
      size_lg: './img/weather/cities/new_york_lg.jpg',
      size_md: './img/weather/cities/new_york_md.jpg',
      size_sm: './img/weather/cities/new_york_sm.jpg',
    },
  },
  {
    name: 'Bangkok',
    default: false,
    img_url: {
      size_lg: './img/weather/cities/bangkok_lg.jpg',
      size_md: './img/weather/cities/bangkok_md.jpg',
      size_sm: './img/weather/cities/bangkok_sm.jpg',
    },
  },
];

export const TIME_SLOTS = [
  {
    code: 'morning',
    label: 'Mañana',
    hours: { from: 6, to: 11 },
    img_url: {
      size_lg: './img/weather/slots/morning_lg.jpg',
      size_md: './img/weather/slots/morning_md.jpg',
      size_sm: './img/weather/slots/morning_sm.jpg',
    },
  },
  {
    code: 'midday',
    label: 'Mediodía',
    hours: { from: 12, to: 16 },
    img_url: {
      size_lg: './img/weather/slots/midday_lg.jpg',
      size_md: './img/weather/slots/midday_md.jpg',
      size_sm: './img/weather/slots/midday_sm.jpg',
    },
  },
  {
    code: 'afternoon',
    label: 'Tarde',
    hours: { from: 17, to: 20 },
    img_url: {
      size_lg: './img/weather/slots/afternoon_lg.jpg',
      size_md: './img/weather/slots/afternoon_md.jpg',
      size_sm: './img/weather/slots/afternoon_sm.jpg',
    },
  },
  {
    code: 'night',
    label: 'Noche',
    hours: { from: 21, to: 5 },
    img_url: {
      size_lg: './img/weather/slots/night_lg.jpg',
      size_md: './img/weather/slots/night_md.jpg',
      size_sm: './img/weather/slots/night_sm.jpg',
    },
  },
];

export const TITLE: string = 'El Mail de JRG';
export const DESCRIPTION: string
  = 'El Mail de JRG es una newsletter personal, donde comparto mis reflexiones, aprendizajes y descubrimientos de la vida en general.';
export const AUTHOR: string = 'Jorge Chato Astrain';
export const YEAR_OF_CREATION: number = 2025;
export const BASE_URL: string = 'https://elmailde.jrg.tools';

export const SOCIALS: {
  name: string;
  url: string;
  target?: string;
}[] = [];

export const SITE_MAP: {
  name: string;
  url: string;
  target?: string;
  inNav?: boolean;
}[] = [
  {
    name: 'Inicio',
    url: '/',
  },
  {
    name: 'Archivo',
    url: '/archive',
    inNav: true,
  },
  {
    name: 'ShortURL',
    url: 'https://x.jrg.tools/dashboard',
    target: '_blank',
  },
];

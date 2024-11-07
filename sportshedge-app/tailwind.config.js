/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,jsx,ts,tsx}', './screens/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'brand': '#0784F2',
        'brand-content': '#FFFFFF',
        'positive': '#159957',
        'positive-content': '#FFFFFF',
        'negative': '#CC3F48',
        'negative-content': '#FFFFFF',
        'theme-primary': '#29292E',
        'theme-secondary': '#17171A',
        'theme-content-primary': '#E4E4ED',
        'theme-content-secondary': '#9D9DA8',
        'theme-content-active': '#B7B7C2',
        'theme-reverse': '#FFFFFF',
        'theme-reverse-content-primary': '#17171A',
        'theme-reverse-content-secondary': '#6A6A75',
        'disabled-primary': 'rgba(255,255,255,0.15)',
        'disabled-secondary': 'rgba(255,255,255,0.05)',
        'disabled-reverse-primary': 'rgba(0,0,0,0.15)',
        'disabled-reverse-secondary': 'rgba(0,0,0,0.05)',
        'skeleton': 'rgba(255,255,255,0.05)',
        'outline-primary': '#6A6A75',
        'outline-secondary': '#565661',
        'outline-overlay': 'rgba(255,255,255,0.05)',
        'hyperlink': '#0784F2',
        'global-black': '#000000',
        'global-gray-dark': '#1E1E1E',
        'global-gray-20': '#D3D3DE',
        'global-gray-30': '#B7B7C2',
        'global-gray-50': '#868691',
        'global-gray-70': '#202025',
        'global-gray-80': '#404047',
        'global-gray-90': '#29292E',
        'global-green-30': '#73DEA1',
        'global-green-40': '#4DD186',
        'global-green-50': '#28BD68',
        'global-green-90': '#043D1F',
        'global-red-20': '#FAC3C8',
        'global-red-30': '#F59AA0',
        'global-red-40': '#F07D84',
        'global-red-50': '#EB5C65',
        'global-red-80': '#872027',
        'global-red-90': '#5C1217',
        'global-blue-40': '#59B2FF',
        'global-blue-50': '#2E9DFF',
        'global-orange-30': '#FAB97A',
        'global-purple-40': '#AC8AFF'
      }
    }
  },
  plugins: []
};
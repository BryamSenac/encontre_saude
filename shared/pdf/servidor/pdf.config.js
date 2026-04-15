/**
 * pdf.config.js
 * Configurações globais do PDF do Pré-Prontuário — Encontre Saúde
 */

const PDF_CONFIG = {
  pageSize: 'A4',
  margins: { top: 50, bottom: 50, left: 50, right: 50 },

  colors: {
    primary:      '#1a7a5e',
    primaryLight: '#2aa87f',
    secondary:    '#0d1f2d',
    white:        '#ffffff',
    lightGray:    '#f4f6f8',
    mediumGray:   '#d1d9e0',
    darkGray:     '#4a5568',
    text:         '#1a202c',
    textMuted:    '#718096',
    danger:       '#e53e3e',
    warning:      '#d69e2e',
    success:      '#38a169',
    headerBg:     '#0d3b2e',
    sectionBg:    '#eaf7f2',
    borderColor:  '#bee3d5',
  },

  fonts: {
    title:         { size: 22, style: 'bold' },
    subtitle:      { size: 11, style: 'normal' },
    sectionHeader: { size: 10, style: 'bold' },
    fieldLabel:    { size: 8.5, style: 'normal' },
    fieldValue:    { size: 9.5, style: 'bold' },
    body:          { size: 9,   style: 'normal' },
    footer:        { size: 7.5, style: 'normal' },
  },

  spacing: {
    sectionGap:           16,
    fieldGap:              6,
    lineHeight:           14,
    sectionHeaderPadding:  6,
    cardPadding:          10,
  },
};

module.exports = PDF_CONFIG;

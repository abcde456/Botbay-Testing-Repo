// postcss.config.cjs
module.exports = {
  plugins: {
    'postcss-px-to-viewport-8-plugin': {
      viewportWidth: 1920,
      unitToConvert: 'px',    // The plugin looks for 'px' to do math
      viewportUnit: 'vw', 
      fontViewportUnit: 'vw',
      propList: ['*'],        // Matches all properties
      selectorBlackList: [], 
      replace: true,          // Replaces px with vw instead of adding as fallback
      mediaQuery: true,       // Turn this to TRUE if you want px in media queries to scale too
      minPixelValue: 1,
    },
  },
};
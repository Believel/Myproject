fis.hook('relative');
fis.match('*.less', {
  parser: fis.plugin('less'), 
  rExt: '.css',
  
  postprocessor : [fis.plugin(
      "autoprefixer",{
      "browsers": ["Firefox >= 20", "Safari >= 6", "Explorer >= 10", "Chrome >= 12", "ChromeAndroid >= 4.0"],
      "flexboxfixer": true,
      "gradientfixer": true
    }
  )]
});
fis.match('**', {
    release: true
});
fis.match('node_modules/**', {
    release: false
});
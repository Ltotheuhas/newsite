// preloadImages.js
const preloadImages = () => {
    const imageNames = [
      'alert.gif', 'still.gif', 'nrun1.gif', 'nrun2.gif', 'nerun1.gif', 'nerun2.gif',
      'erun1.gif', 'erun2.gif', 'serun1.gif', 'serun2.gif', 'srun1.gif', 'srun2.gif',
      'swrun1.gif', 'swrun2.gif', 'wrun1.gif', 'wrun2.gif', 'nwrun1.gif', 'nwrun2.gif',
      'yawn.gif', 'sleep1.gif', 'sleep2.gif', 'itch1.gif', 'itch2.gif',
      'nscratch1.gif', 'nscratch2.gif', 'escratch1.gif', 'escratch2.gif',
      'sscratch1.gif', 'sscratch2.gif', 'wscratch1.gif', 'wscratch2.gif'
    ];
  
    const imageCache = {};
  
    imageNames.forEach((name) => {
      const img = new Image();
      img.src = require(`@/assets/nekoframes/${name}`);
      imageCache[name] = img;
    });
  
    return imageCache;
  };
  
  export default preloadImages;
  
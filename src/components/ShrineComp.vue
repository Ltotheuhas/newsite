<template>
    <section class="shrine" ref="wrap">
        <pre class="title" ref="titleEl" :style="{ fontSize: titleSize }">{{ outTitle }}</pre>
        <pre class="art">{{ outBody }}</pre>
        <ShrineWishes />
    </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import ShrineWishes from './ShrineWishes.vue';

const TITLE_ART = String.raw`
   ▄▄▄▄▄    ▄  █ █▄▄▄▄ ▄█    ▄   ▄███▄       ████▄ ▄████        ▄ ▄   ▄█    ▄▄▄▄▄    ▄  █ ▄███▄     ▄▄▄▄▄   
  █     ▀▄ █   █ █  ▄▀ ██     █  █▀   ▀      █   █ █▀   ▀      █   █  ██   █     ▀▄ █   █ █▀   ▀   █     ▀▄ 
▄  ▀▀▀▀▄   ██▀▀█ █▀▀▌  ██ ██   █ ██▄▄        █   █ █▀▀        █ ▄   █ ██ ▄  ▀▀▀▀▄   ██▀▀█ ██▄▄   ▄  ▀▀▀▀▄   
 ▀▄▄▄▄▀    █   █ █  █  ▐█ █ █  █ █▄   ▄▀     ▀████ █          █  █  █ ▐█  ▀▄▄▄▄▀    █   █ █▄   ▄▀ ▀▄▄▄▄▀    
              █    █    ▐ █  █ █ ▀███▀              █          █ █ █   ▐               █  ▀███▀             
             ▀    ▀       █   ██                     ▀          ▀ ▀                   ▀                     
`.trim();

const BODY_ART = String.raw`
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
                                            ÎÝäááZZáPhT                                             
                                    ûhšähSû             UñŸPšàZU                                    
                               6ÇäÇk                           fàššä                                
                            ášš4                                    äÇà                             
                         àhP                                           ûàÇ                          
                       PÇS               ®PàPäÝTSUkTSàZäàÇµ               ÇÇh                       
                     äÇ             šZ§ž                   õZšàž            Ýšž                     
                   Çš®          Ý§®                             žš9           ZÇU                   
                 §àû          Pà    ¥àh                      Çà    eàZ          Zñ                  
                Çš         §Ÿ®       POš                   ®9š        hš         Ÿš                 
               šk        §kž          š š                 šT9š          à§         šh               
             6Ç         äk            û§ Sà              Z 6Z             Ç§        äÇ              
            Ýà        äh               šµ  §            §  Z               ñZ        àä             
           fš9       kž                 P   P         Ýh  š®                 ä        PÝ            
           ä®       ŸŸ                  žä   še      Ç   Dà                   Zž       àk           
          áÝ       ZU                    §k   hh   kš    P                     à        Ç           
         ää       f®                      š     Ç žP    Ÿf                      ®       ûP          
         P&      fá                       xû     Pà    õÝ                       he       šk         
        eä       à                         àž   ä k§   P                         š       9h         
        ÝÝ       Ç                          šSŸ§   Zà ÇF                         ¾Ÿ       ä         
        šO      hÝ                           Çû      šä                           P       ÇO        
        Ÿ       û                           äŸš      šû¥                          h       ûZ        
        P       ä                          š  Ç     šž §§                         ä5      áZ        
        Z       P                        U§    š   k9   6P                        áõ      PP        
        P       š                       Ç4     f§ Tà      ä                       ä&      áP        
        P       h                    S ä        ÝTÇ        ® k                    à       àZ        
        ÇO      ÇÝ                   PšäS        šû        6hûw                   P       Çx        
        šš       Ç                              ààP                              ek       ä         
        yÇ       àS                             ä kš                             ä       žh         
         äa      4Z                            š   h                            ák       š®         
         ÇP       µŸ                          à®    S                           à       àP          
          ZÝ       šk                    eàh Ÿà      P  P®                     š        Ç           
           šU       àS                     ÇžZ       hŸŸû                     äT       Ç§           
            Ç9       Zä              šÇPû  Ušà        äÇ  èZáZh              P        ÇŸ            
            kà        kZ            š O ®6 ZUš       äÇšy Z  OÝU           6ä        šš             
             Ošú        ÇÇ          ûS§§á k6 Sä     äP  ä  hä š           àà        äÇ              
               šû        ZÇà          ÇàhÇ    e®   Ýš    ZÇàäŸ          û§         šk               
                ÇÇ         ŸÇT                 Dä ÇÇ                  šä         žÇ                 
                 ehá          šZ                Çäš                hàŸ          šÇ                  
                   äÇä          ûPÇ              §û             Ÿšh           ûä4                   
                     Çš4            ZšÝh                   e§äûx            hš¾                     
                       PäU               6áÇPPh®®kž®§šPPÇ§               µäšŸ                       
                         9äP                                           Çàû                          
                            àäÇO                                    šàh                             
                                hšÇà                           9hšàà                                
                                    TÇÇšÇUDµ           ÎSäÝšÇÇh                                     
                                             SÇäZäáäûhy                                             
                                                                                                    
                                                                                                    
                                                                                                    
                                                                                                    
`;

const pool = ['.', ':', '*', '+', 'x', 'X', '%', '#', '§', 'µ'];
const outTitle = ref(TITLE_ART);
const outBody = ref(BODY_ART);
let t = 0, timer = null;

function shimmer(src) {
    const rows = src.split('\n'); const out = [];
    for (let y = 0; y < rows.length; y++) {
        const row = rows[y]; let line = '';
        for (let x = 0; x < row.length; x++) {
            const ch = row[x]; if (ch === ' ') { line += ' '; continue; }
            const h = (x * 131 + y * 97) & 0xff; const sparkle = ((h + t) % 23) === 0;
            line += sparkle ? pool[(h + t) % pool.length] : ch;
        }
        out.push(line);
    }
    return out.join('\n');
}
function render() { outBody.value = shimmer(BODY_ART); t = (t + 1) >>> 0; }

const wrap = ref(null);
const titleEl = ref(null);
const titleSize = ref('20px');

const titleCols = Math.max(...TITLE_ART.split('\n').map(l => l.length));
function fitTitle() {
    if (!wrap.value) return;
    const pad = 16; // px side padding allowance
    const w = wrap.value.clientWidth - pad * 2;
    const size = w / titleCols;                 // px per column
    const clamped = Math.max(10, Math.min(32, size)); // min 10px, max 32px
    titleSize.value = clamped + 'px';
}

onMounted(() => {
    render(); timer = setInterval(render, 150);
    fitTitle();
    const ro = new ResizeObserver(fitTitle);
    ro.observe(wrap.value);
    wrap.value._ro = ro;
});
onBeforeUnmount(() => {
    clearInterval(timer);
    wrap.value?._ro?.disconnect();
});
</script>

<style scoped>
.shrine {
    position: relative;
    width: 100vw;
    margin-left: calc(50% - 50vw);
    height: 86dvh;
    display: grid;
    grid-template-rows: auto 1fr;
    align-content: start;
    justify-items: center;
    gap: .75rem;
    overflow: hidden;
    padding-top: .5rem;
}

.title,
.art {
    white-space: pre;
    margin: 0;
    pointer-events: none;
    color: #aa759f;
    opacity: .6;
    font-family: ui-monospace, Menlo, Consolas, monospace;
    line-height: 1;
    text-align: center;
}

.title {
    opacity: 1;
    margin-top: 8px;
    background: linear-gradient(90deg,
            #b8ecf9, #7fd0e6, #54b3d3, #2596be, #1c6f8c, #0f5c74,
            #2596be, #54b3d3, #7fd0e6, #b8ecf9);
    background-size: 200% 100%;
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;

    /* glow + subtle wave */
    text-shadow:
        0 0 6px rgba(192, 132, 252, .45),
        0 0 14px rgba(244, 114, 182, .35),
        0 0 28px rgba(125, 211, 252, .25);
    filter: saturate(1.15);

    animation:
        title-flow 8s linear infinite,
        title-glow 2.6s ease-in-out infinite alternate,
        title-wave 5s ease-in-out infinite;
}

/* flowing gradient */
@keyframes title-flow {
    0% {
        background-position: 0% 50%;
    }

    100% {
        background-position: 200% 50%;
    }
}

/* breathing glow */
@keyframes title-glow {
    0% {
        text-shadow:
            0 0 4px rgba(192, 132, 252, .35),
            0 0 10px rgba(244, 114, 182, .25),
            0 0 18px rgba(125, 211, 252, .20);
    }

    100% {
        text-shadow:
            0 0 10px rgba(192, 132, 252, .65),
            0 0 24px rgba(244, 114, 182, .45),
            0 0 42px rgba(125, 211, 252, .35);
    }
}

/* gentle vertical ripple for the whole block */
@keyframes title-wave {

    0%,
    100% {
        transform: translateY(0);
    }

    50% {
        transform: translateY(-2px);
    }
}

.art {
    font-size: clamp(8px, 1.2vw, 18px);
    align-self: center;
}
</style>

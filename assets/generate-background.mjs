// Coarse star tile with a gentle periodic drift: 16 frames, 640ms, seamless loop.
// Literal LZW with frequent clears keeps the tiny GIF encoder reproducible.
import {writeFile} from 'node:fs/promises';
const width=192,height=192;
const palette=[[3,5,18],[7,9,25],[11,13,31],[15,16,37],[24,25,48],[34,35,63],[48,48,78],[65,64,96],[86,83,118],[111,107,144],[137,134,170],[163,164,194],[190,195,221],[214,222,240],[225,214,165],[245,233,188]];
let seed=78;function random(){seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;}
const stars=Array.from({length:60},()=>({x:Math.floor(random()*width),y:Math.floor(random()*height),light:5+Math.floor(random()*8),big:random()>.91}));
const grain=new Uint8Array(width*height);
for(let y=0;y<height;y++)for(let x=0;x<width;x++)grain[y*width+x]=random()>.83?1+(y%3===0?1:0):0;
const frameCount=16,frameDelay=4;
const chunks=[];const push=(...bytes)=>chunks.push(Buffer.from(bytes));const word=n=>[n&255,n>>8];
chunks.push(Buffer.from('GIF89a'));push(...word(width),...word(height),0xf7,0,0);
for(let i=0;i<256;i++)push(...(palette[i]||[0,0,0]));
push(0x21,0xff,11);chunks.push(Buffer.from('NETSCAPE2.0'));push(3,1,0,0,0);
for(let frame=0;frame<frameCount;frame++){
  const pixels=grain.slice();
  const phase=frame/frameCount*Math.PI*2;
  const dot=(x,y,c)=>{pixels[((y+height)%height)*width+(x+width)%width]=c;};
  // Bilinear splats soften pixel movement while preserving the tiny GIF palette.
  const softDot=(x,y,c)=>{const x0=Math.floor(x),y0=Math.floor(y),fx=x-x0,fy=y-y0;for(const [dx,dy,weight] of [[0,0,(1-fx)*(1-fy)],[1,0,fx*(1-fy)],[0,1,(1-fx)*fy],[1,1,fx*fy]]){const px=(x0+dx+width)%width,py=(y0+dy+height)%height;const index=py*width+px;dot(px,py,Math.max(pixels[index],Math.round(c*weight)));}};
  stars.forEach((s,i)=>{const x=s.x+Math.sin(phase)*1.2,y=s.y+Math.cos(phase)*.6;const c=Math.max(5,s.light+Math.sin(phase+i)*.6);softDot(x,y,c);if(s.big){softDot(x,y,15);for(let d=1;d<=3;d++){const light=d===1?11:6;softDot(x+d,y,light);softDot(x-d,y,light);softDot(x,y+d,light);softDot(x,y-d,light);}}});
  push(0x21,0xf9,4,4,...word(frameDelay),0,0);
  push(0x2c,0,0,0,0,...word(width),...word(height),0,8);
  const codes=[];for(let offset=0;offset<pixels.length;offset+=200){codes.push(256,...pixels.subarray(offset,offset+200));}codes.push(257);
  const packed=[];let bits=0,bitCount=0;for(const code of codes){bits|=code<<bitCount;bitCount+=9;while(bitCount>=8){packed.push(bits&255);bits>>>=8;bitCount-=8;}}if(bitCount)packed.push(bits&255);
  for(let offset=0;offset<packed.length;offset+=255){const block=packed.slice(offset,offset+255);push(block.length,...block);}push(0);
}
push(0x3b);const result=Buffer.concat(chunks);await writeFile(new URL('stars-loop.gif',import.meta.url),result);console.log(`stars-loop.gif: ${width}x${height}, ${frameCount} frames, ${frameCount*frameDelay*10}ms, ${result.length} bytes`);

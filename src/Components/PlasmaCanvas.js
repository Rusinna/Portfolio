import { useEffect, useRef } from 'react';

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0,1);}`;
const FRAG = `
precision highp float;
uniform float t;
uniform vec2 res;
uniform vec2 mouse;

vec3 palette(float v){
    v = clamp(v, 0.0, 1.0);
    vec3 dark     = vec3(0.04, 0.02, 0.10);
    vec3 indigo   = vec3(0.075, 0.063, 0.149);
    vec3 midBlue  = vec3(0.10, 0.20, 0.50);
    vec3 outline  = vec3(0.55, 0.80, 1.00);
    vec3 chestnut = vec3(0.349, 0.133, 0.055);
    vec3 fire     = vec3(0.749, 0.188, 0.059);
    vec3 brightRed= vec3(1.00, 0.55, 0.20);
    vec3 softBlue = vec3(0.612, 0.757, 0.851);
    if(v < 0.15) return mix(dark, indigo, v/0.15);
    if(v < 0.38) return mix(indigo, midBlue, (v-0.15)/0.23);
    if(v < 0.43) return mix(midBlue, outline, (v-0.38)/0.05);
    if(v < 0.48) return mix(outline, midBlue, (v-0.43)/0.05);
    if(v < 0.56) return mix(midBlue, chestnut, (v-0.48)/0.08);
    if(v < 0.72) return mix(chestnut, fire, (v-0.56)/0.16);
    if(v < 0.88) return mix(fire, brightRed, (v-0.72)/0.16);
    return mix(brightRed, softBlue, (v-0.88)/0.12);
}

void main(){
    vec2 uv = gl_FragCoord.xy / res;
    float aspect = res.x / res.y;
    float x = uv.x * 2.5 * aspect;
    float y = (1.0-uv.y) * 5.0;
    float mx2 = mouse.x * 2.5 * aspect;
    float my2 = (1.0-mouse.y) * 5.0;
    vec2 pos = vec2((uv.x-0.5)*8.0*aspect, (uv.y-0.5)*8.0);
    vec2 mpos = vec2((mouse.x-0.5)*8.0*aspect, (mouse.y-0.5)*8.0);

    float v = 0.0;
    v += sin(x*1.1+t*1.6); v += sin(y*1.0+t*1.3);
    v += sin(x*0.8-y*0.6+t*2.0); v += sin(x*1.4+y*0.7+t*1.5);
    v += sin(x*0.5+y*1.3-t*1.8); v += sin(x*1.6-y*0.4+t*2.3);

    float d1=sqrt((x-1.5)*(x-1.5)+(y-2.5)*(y-2.5)); v+=sin(d1*2.2-t*3.2);
    float d2=sqrt((x-3.5*aspect)*(x-3.5*aspect)+(y-5.5)*(y-5.5)); v+=sin(d2*2.0-t*2.8);
    float d3=sqrt((x-2.0*aspect)*(x-2.0*aspect)+(y-9.0)*(y-9.0)); v+=sin(d3*2.4-t*3.5);
    float d4=sqrt((x-4.0*aspect)*(x-4.0*aspect)+(y-13.0)*(y-13.0)); v+=sin(d4*1.9-t*2.6);
    float d5=sqrt((x-1.0)*(x-1.0)+(y-15.5)*(y-15.5)); v+=sin(d5*2.3-t*3.1);
    float d6=sqrt((x-3.8*aspect)*(x-3.8*aspect)+(y-18.5)*(y-18.5)); v+=sin(d6*2.1-t*2.9);
    float d7=sqrt((x-0.8)*(x-0.8)+(y-7.5)*(y-7.5)); v+=sin(d7*2.5-t*3.8);
    float d8=sqrt((x-2.8*aspect)*(x-2.8*aspect)+(y-11.5)*(y-11.5)); v+=sin(d8*2.0-t*2.7);
    float d9=sqrt((x-4.5*aspect)*(x-4.5*aspect)+(y-3.5)*(y-3.5)); v+=sin(d9*2.6-t*4.0);
    float d10=sqrt((x-1.8*aspect)*(x-1.8*aspect)+(y-16.5)*(y-16.5)); v+=sin(d10*2.2-t*3.3);

    float dm_b=sqrt((x-mx2)*(x-mx2)+(y-my2)*(y-my2));
    v+=2.5*sin(dm_b*3.0-t*3.5)*exp(-dm_b*0.20);

    float radius=length(pos);
    v+=0.8*sin(radius*4.5-t*2.2)*(1.0-smoothstep(0.2,2.8,radius));
    v+=0.5*cos(radius*7.0+t*1.5)*exp(-radius*0.9);
    float ang=atan(pos.y,pos.x);
    v+=0.6*sin(ang*3.0+radius*3.0-t*1.2);

    float dm_d=distance(pos,mpos);
    if(dm_d<1.8){
        float ripple=sin(dm_d*12.0-t*7.0)*0.7;
        float falloff=1.0-smoothstep(0.1,1.4,dm_d);
        v+=ripple*falloff*1.2;
        v+=0.4*exp(-dm_d*2.5)*sin(t*9.0);
    }
    vec2 delta=pos-mpos;
    float swirl=atan(delta.y,delta.x)*0.4;
    v+=0.5*exp(-dm_d*1.2)*sin(t*2.3)*sin(swirl*3.0+t);
    v+=sin((x+y)*0.8+t*1.2); v+=sin((x-y)*0.9-t*1.5);
    vec2 grainUV=gl_FragCoord.xy*0.008;
    v+=sin(grainUV.x*40.0+t)*cos(grainUV.y*37.0-t*1.3)*0.06;
    v=(v/18.0+1.0)/2.0; v=pow(v,1.12);
    vec3 col=palette(v);
    float glowBoost=(dm_d<1.2)?(1.0-smoothstep(0.0,1.2,dm_d))*0.18:0.0;
    col=clamp(col+glowBoost,0.0,1.0);
    float vig=clamp(1.0-length(uv-0.5)*0.45,0.65,1.0);
    col*=vig;
    col.r+=0.018*sin(uv.y*25.0+t*1.2);
    col.b+=0.013*cos(uv.x*28.0-t*1.5);
    col=clamp(col,0.0,1.0);
    gl_FragColor=vec4(col,1.0);
}`;

function mkShader(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src); gl.compileShader(s); return s;
}

export default function PlasmaCanvas() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl');
    if (!gl) return;
    const prog = gl.createProgram();
    gl.attachShader(prog, mkShader(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, mkShader(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog); gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const pLoc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(pLoc);
    gl.vertexAttribPointer(pLoc, 2, gl.FLOAT, false, 0, 0);
    const tLoc = gl.getUniformLocation(prog, 't');
    const rLoc = gl.getUniformLocation(prog, 'res');
    const mLoc = gl.getUniformLocation(prog, 'mouse');
    let mx = 0.5, my = 0.5, smx = 0.5, smy = 0.5, start = null, rafId = null;
    const onMove = e => { const r = canvas.getBoundingClientRect(); mx = (e.clientX - r.left) / r.width; my = (e.clientY - r.top) / r.height; };
    const onLeave = () => { mx = 0.5; my = 0.5; };
    canvas.addEventListener('mousemove', onMove);
    canvas.addEventListener('mouseleave', onLeave);
    const resize = () => { canvas.width = canvas.offsetWidth * devicePixelRatio; canvas.height = canvas.offsetHeight * devicePixelRatio; gl.viewport(0, 0, canvas.width, canvas.height); };
    resize();
    const ro = new ResizeObserver(resize); ro.observe(canvas);
    const frame = ts => {
      if (!start) start = ts;
      smx += (mx - smx) * 0.07; smy += (my - smy) * 0.07;
      const elapsed = ((ts - start) / 1000) % 120;
      gl.uniform1f(tLoc, elapsed); gl.uniform2f(rLoc, canvas.width, canvas.height); gl.uniform2f(mLoc, smx, smy);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      rafId = requestAnimationFrame(frame);
    };
    rafId = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(rafId); ro.disconnect(); canvas.removeEventListener('mousemove', onMove); canvas.removeEventListener('mouseleave', onLeave); };
  }, []);
  return <canvas ref={ref} style={{ width: '100%', height: '100%', display: 'block' }} />;
}
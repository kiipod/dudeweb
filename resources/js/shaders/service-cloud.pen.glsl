/** @resolution */
uniform vec2 u_resolution;
/** @time */
uniform float u_time;
/** @label Service logo atlas */
uniform sampler2D u_atlas;
/** @label Orbit mode @default 0 */
uniform float u_orbit;
/** @label Reduced motion @default 0 */
uniform float u_static;
void main(){
 vec2 p=vec2(gl_FragCoord.x,u_resolution.y-gl_FragCoord.y);
 float t=u_static>0.5?0.0:u_time;
 vec4 result=vec4(0.0);
 for(int i=0;i<23;i++){
  float f=float(i);float a=f*2.399963;
  vec2 center;float size;float opacity;
  if(u_orbit<0.5){
   float y=1.0-2.0*(f+0.5)/23.0;float r=sqrt(1.0-y*y);
   float x=cos(a)*r;float z=sin(a)*r;
   float ang=t*0.105;float xx=x*cos(ang)+z*sin(ang);float zz=-x*sin(ang)+z*cos(ang);
   float depth=1.0+zz*0.24;
   center=u_resolution*0.5+vec2(xx,y)*min(u_resolution.x,u_resolution.y)*0.37*depth;
   size=min(u_resolution.x,u_resolution.y)*0.17*depth;
   opacity=0.38+0.62*(zz+1.0)*0.5;
  }else{
   float ring=mod(f,3.0);float direction=ring==1.0?-1.0:1.0;
   float ang=a+t*(0.08+ring*0.015)*direction;
   float radius=min(u_resolution.x,u_resolution.y)*(0.34+ring*0.18);
   center=u_resolution*0.5+vec2(cos(ang),sin(ang))*radius;
   size=clamp(u_resolution.x*0.12,44.0,72.0);
   vec2 q=(p-u_resolution*0.5)/(u_resolution*vec2(0.72,0.90));
   float vignette=smoothstep(0.34,0.70,length(q));
   opacity=mix(0.20,0.85,vignette);
  }
  vec2 uv=(p-center)/size+0.5;
  if(uv.x>0.0&&uv.y>0.0&&uv.x<1.0&&uv.y<1.0){
   vec2 cell=vec2(mod(f,5.0),floor(f/5.0));
   vec2 auv=(cell+uv)/5.0;auv.y=1.0-auv.y;
   vec4 col=texture2D(u_atlas,auv)*opacity;
   result=col+result*(1.0-col.a);
  }
 }
 gl_FragColor=result;
}

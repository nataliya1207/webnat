/* Project a readable HTML plane onto all four measured screen corners. */
(() => {
  const scene=document.querySelector('.hero-scene');
  const screen=document.querySelector('.laptop-screen-ui');
  if(!scene||!screen)return;
  function updateScreen(){
    const s=getComputedStyle(screen), w=scene.clientWidth,h=scene.clientHeight;
    const point=c=>[parseFloat(s.getPropertyValue(`--screen-${c}-x`))*w/100,parseFloat(s.getPropertyValue(`--screen-${c}-y`))*h/100];
    const [p0,p1,p2,p3]=['tl','tr','br','bl'].map(point);
    const dx1=p1[0]-p2[0],dx2=p3[0]-p2[0],dx3=p0[0]-p1[0]+p2[0]-p3[0];
    const dy1=p1[1]-p2[1],dy2=p3[1]-p2[1],dy3=p0[1]-p1[1]+p2[1]-p3[1];
    const det=dx1*dy2-dx2*dy1;
    const g=(dx3*dy2-dx2*dy3)/det, j=(dx1*dy3-dx3*dy1)/det;
    const a=p1[0]-p0[0]+g*p1[0],b=p3[0]-p0[0]+j*p3[0];
    const d=p1[1]-p0[1]+g*p1[1],e=p3[1]-p0[1]+j*p3[1];
    screen.style.transform=`matrix3d(${a/1000},${d/1000},0,${g/1000},${b/650},${e/650},0,${j/650},0,0,1,0,${p0[0]},${p0[1]},0,1)`;
  }
  new ResizeObserver(updateScreen).observe(scene);
  updateScreen();
})();

export function wait(el){
  return new Promise(resolve=>{
    function end(){
      el.removeEventListener('transitionend', end, false);

      resolve();
    }

    el.addEventListener('transitionend', end, false);
  });
}
export function rmTransition(el){
  return new Promise(resolve=>{
    el.style.transition='none';

    setTimeout(resolve, 1);
  });
}

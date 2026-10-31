/* Adriatic v39 · mejoras opcionales. Sin JavaScript la web funciona igual. */
(function(){
  var $$=function(s,c){return [].slice.call((c||document).querySelectorAll(s));};
  // menú móvil: se cierra al elegir y con Escape
  $$('.mnav').forEach(function(d){$$('a',d).forEach(function(a){a.addEventListener('click',function(){d.open=false;});});});
  addEventListener('keydown',function(e){if(e.key==='Escape')$$('.mnav[open]').forEach(function(d){d.open=false;});});
  // aparición suave de lo que aún no está en pantalla (lo visible al cargar no se oculta nunca)
  if('IntersectionObserver' in window&&!matchMedia('(prefers-reduced-motion:reduce)').matches){
    var els=$$('.rv').filter(function(el){return el.getBoundingClientRect().top>innerHeight;});
    if(els.length){
      document.documentElement.classList.add('reveal-on');
      var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{rootMargin:'0px 0px -6% 0px'});
      $$('.rv').forEach(function(el){if(els.indexOf(el)<0)el.classList.add('in');else io.observe(el);});
      setTimeout(function(){$$('.rv').forEach(function(el){el.classList.add('in');});},6000);
    }
  }
  // formulario: correo ordenado
  $$('form.form').forEach(function(f){f.addEventListener('submit',function(e){
    if(!f.checkValidity())return; e.preventDefault();
    var g=function(n){var el=f.elements[n];if(!el)return '';return el.tagName==='SELECT'?(el.value?el.options[el.selectedIndex].text:''):el.value.trim();};
    var body='Nombre: '+g('Nombre')+' '+g('Apellidos')+'\nTeléfono: '+g('Telefono')+'\nEmail: '+g('Email')+'\nPerfil: '+g('Perfil')+'\nIdioma: '+document.documentElement.lang+'\n\n'+g('Mensaje');
    location.href='mailto:info@adriatic.immo?subject='+encodeURIComponent('Contacto web Adriatic · '+g('Nombre')+(g('Perfil')?' · '+g('Perfil'):''))+'&body='+encodeURIComponent(body);
  });});
})();

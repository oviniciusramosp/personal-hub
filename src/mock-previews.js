// Every UI preview is a script-free HTML/CSS fixture derived from that project's source.
// Fixtures live only in the encrypted catalog. No project code, network requests or APIs run here.
const previewResize = new ResizeObserver(entries => {
  for (const {target} of entries) {
    const width = Number(target.dataset.canvasWidth || 1120);
    target.style.setProperty('--preview-scale', String(target.clientWidth / width));
  }
});
function documentPreview(entry, group) {
  const escape = value => String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
  const title=entry.preview?.screen||entry.displayName||entry.name;
  const subtitle=entry.preview?.subtitle||'Documentação e materiais do projeto';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="640" height="400" viewBox="0 0 640 400"><rect width="640" height="400" fill="#121b28"/><ellipse cx="320" cy="185" rx="250" ry="158" fill="${themes[group].accent}" opacity=".055"/><g transform="translate(256 38) rotate(8 65 115)"><rect x="4" y="5" width="145" height="210" rx="12" fill="#263446"/><rect x="-8" y="-4" width="145" height="210" rx="10" fill="#e8eef7"/><path d="M94-4v42h35" fill="#bdcadc"/><path d="M13 60h76M13 87h96M13 100h80M13 113h92M13 126h74M13 139h88" stroke="#bdc8d8" stroke-width="4"/><rect x="13" y="157" width="35" height="23" rx="5" fill="${themes[group].accent}"/><text x="20" y="173" fill="#142033" font-family="system-ui" font-size="10" font-weight="700">DOC</text></g><text x="32" y="321" fill="#e9edf5" font-family="system-ui" font-size="23" font-weight="650">${escape(title)}</text><text x="32" y="347" fill="#94a1b6" font-family="system-ui" font-size="12">${escape(subtitle)}</text><text x="32" y="381" fill="#8291a8" font-family="system-ui" font-size="7">ILUSTRAÇÃO DOCUMENTAL</text></svg>`;
}
function createMockFrame(entry, expanded=false) {
  const wrap=element('div',null,expanded?'expanded-mock-canvas':'mock-canvas');
  const width=entry.preview.width||1120,height=entry.preview.height||700;
  wrap.dataset.canvasWidth=String(width);
  wrap.style.aspectRatio=`${width} / ${height}`;
  const frame=document.createElement('iframe');
  frame.title='Mock da interface de '+(entry.displayName||entry.name)+' — dados fictícios';
  frame.setAttribute('sandbox','');
  frame.setAttribute('referrerpolicy','no-referrer');
  frame.setAttribute('aria-hidden','true');
  frame.tabIndex=-1;frame.loading='lazy';
  frame.width=String(width);frame.height=String(height);
  const fonts=(entry.preview.fonts||[]).map(name=>catalog.assets?.fonts?.[name]||'').join('\n');
  frame.srcdoc=entry.preview.html.replace('</head>','<style>'+fonts+'</style></head>');
  wrap.append(frame);previewResize.observe(wrap);
  return wrap;
}
function mockPreview(entry,group){
  const button=element('button',null,'preview-banner');button.type='button';
  const docs=entry.preview?.type==='document',name=entry.displayName||entry.name;
  button.setAttribute('aria-label','Ampliar '+(docs?'banner documental':'mock HTML/CSS')+' de '+name);
  button.title='Ampliar prévia';
  let img;
  if(docs){img=element('img');img.alt='Ilustração de documento: '+name;img.width=640;img.height=400;img.loading='lazy';img.decoding='async';img.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(documentPreview(entry,group));button.append(img)}
  else if(entry.preview?.html){button.append(createMockFrame(entry))}
  else{throw new Error('Prévia HTML/CSS ausente: '+entry.name)}
  button.append(element('span',docs?'Documentação':'Mock HTML/CSS · dados fictícios','preview-label'));
  button.addEventListener('click',()=>{
    const dialog=$('#preview-dialog'),content=$('#preview-content');
    content.querySelectorAll('.expanded-mock-canvas').forEach(node=>previewResize.unobserve(node));
    content.replaceChildren();$('#preview-title').textContent=name;
    if(docs){const expanded=element('img');expanded.src=img.src;expanded.alt=img.alt;content.append(expanded)}else{content.append(createMockFrame(entry,true))}
    $('#preview-note').textContent=docs?'Ilustração de documentação do projeto.':'Mock estático em HTML/CSS, com a estrutura e os estilos do aplicativo e dados fictícios.';
    dialog.showModal();
  });return button;
}

import {execFileSync} from 'node:child_process';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
const api=path=>JSON.parse(execFileSync('gh',['api',path],{encoding:'utf8',maxBuffer:20*1024*1024}));
const login=api('user').login;
const repos=[];
for(let page=1;;page++){const batch=api(`user/repos?affiliation=owner&per_page=100&page=${page}`);repos.push(...batch);if(batch.length<100)break;}
let custom={repositories:{},sites:[]};
try{custom=JSON.parse(await readFile('.local/links.json','utf8'));}catch(error){if(error.code!=='ENOENT')throw error;}
function safeURL(value){try{const u=new URL(value);return u.protocol==='https:'||u.protocol==='http:'?u.href:null;}catch{return null;}}
const entries=repos.map(r=>{let page=null;if(r.has_pages){try{page=api(`repos/${r.full_name}/pages`).html_url;}catch{throw new Error(`Não foi possível consultar o Pages de ${r.name}; catálogo anterior preservado.`);}}const override=custom.repositories[r.name]||{};return {name:override.name||r.name,description:r.description||'',language:r.language,repo:r.html_url,site:safeURL(override.site||page||r.homepage),private:r.private,archived:r.archived,pushedAt:r.pushed_at};});
for(const site of custom.sites){if(!safeURL(site.site))throw new Error('URL inválida em links.json');entries.push(site);}
await mkdir('.local',{recursive:true});
await writeFile('.local/catalog.json',JSON.stringify({login,syncedAt:new Date().toISOString(),entries},null,2),{mode:0o600});
console.log(`Catálogo atualizado: ${entries.filter(e=>e.repo).length} repositórios, ${entries.filter(e=>e.site).length} links publicados.`);

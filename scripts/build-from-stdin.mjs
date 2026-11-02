import {spawnSync} from 'node:child_process';
let password='';for await(const chunk of process.stdin)password+=chunk;
password=password.trim();
if(password.length<20)throw new Error('Senha precisa de pelo menos 20 caracteres.');
const result=spawnSync(process.execPath,['scripts/build.mjs'],{env:{...process.env,PORTAL_PASSWORD:password},stdio:'inherit'});
process.exitCode=result.status??1;

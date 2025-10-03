
import { Redis } from '@upstash/redis';
let mem = new Map(); function now(){return Math.floor(Date.now()/1000);} function gc(){const t=now(); for(const[k,v] of mem.entries()){if(v.exp && v.exp<=t) mem.delete(k);}}
export function getKV(){
  const url=process.env.UPSTASH_REDIS_REST_URL, token=process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) return new Redis({url, token});
  return {
    async incr(key){gc(); const it=mem.get(key)||{value:0,exp:0}; it.value+=1; mem.set(key,it); return it.value;},
    async pttl(key){gc(); const it=mem.get(key); if(!it||!it.exp) return -2; const ms=(it.exp-now())*1000; return ms>0?ms:-2;},
    async expire(key,sec){gc(); const it=mem.get(key)||{value:0,exp:0}; it.exp=now()+sec; mem.set(key,it); return 1;},
  };
}

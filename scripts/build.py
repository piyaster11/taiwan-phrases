"""Build phrases.json + audio/*.mp3 from data/phrases_src.json.
Voice: edge-tts zh-TW-HsiaoChenNeural if reachable, else gTTS lang='zh-TW'. Hokkien entries get no audio
(no Taiwanese Hokkien TTS available). Run: python3 scripts/build.py  [--force]"""
import json,hashlib,os,sys,re
from concurrent.futures import ThreadPoolExecutor
os.chdir(os.path.dirname(os.path.abspath(__file__))+'/..')
src=json.load(open('data/phrases_src.json'));FORCE='--force' in sys.argv
def say(z): return re.sub(r'[…]','',z).replace('／','，').replace('、','，')
def edge(t,f):
  import asyncio,edge_tts
  asyncio.run(edge_tts.Communicate(t,'zh-TW-HsiaoChenNeural').save(f))
def gtts(t,f):
  from gtts import gTTS;gTTS(t,lang='zh-TW').save(f)
VOICE='edge'
try: edge('你好','/tmp/_probe.mp3');assert os.path.getsize('/tmp/_probe.mp3')>500
except Exception: VOICE='gtts'
gen=edge if VOICE=='edge' else gtts
out=[]
for i,p in enumerate(src['phrases']):
  q=dict(id=i+1,**p)
  if not p.get('hokkien'):
    q['say']=say(p['zh']);q['audio']='audio/'+hashlib.md5((VOICE+q['say']).encode()).hexdigest()[:10]+'.mp3'
  out.append(q)
def one(q):
  f=q.get('audio')
  if not f or (os.path.exists(f) and os.path.getsize(f)>500 and not FORCE): return
  for _ in range(3):
    try: gen(q['say'],f);return
    except Exception as e: print('retry',q['zh'],e)
with ThreadPoolExecutor(4) as ex: list(ex.map(one,out))
miss=[q['zh'] for q in out if q.get('audio') and not (os.path.exists(q['audio']) and os.path.getsize(q['audio'])>500)]
used={q['audio'] for q in out if q.get('audio')}
for f in os.listdir('audio'):
  if 'audio/'+f not in used: os.remove('audio/'+f)
json.dump(dict(voice={'edge':'Microsoft Edge neural TTS zh-TW-HsiaoChenNeural','gtts':"Google Translate TTS via gTTS (lang zh-TW)"}[VOICE],
  categories=src['categories'],phrases=out),open('phrases.json','w'),ensure_ascii=False,indent=1)
print(VOICE,len(out),'phrases',len(used),'mp3','missing',miss)

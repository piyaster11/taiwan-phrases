# Taiwan Phrases · ภาษาไต้หวัน
Live: https://piyaster11.github.io/taiwan-phrases/

Everyday Taiwan Mandarin (Traditional Chinese) for visitors, with pinyin, English, Thai, usage notes and audio.
- Edit phrases in `data/phrases_src.json`, then run `python3 scripts/build.py` (needs `pip install gTTS edge-tts`).
- The build uses edge-tts `zh-TW-HsiaoChenNeural` if reachable, else gTTS `zh-TW`. Hokkien entries have no audio.
- After changing app.js/style.css, bump the `?v=` in index.html and `VER` in app.js.

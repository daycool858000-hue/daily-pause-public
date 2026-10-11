(() => {
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const lockerKey = 'xinli-holding-place-v1';
  const localRoomDate = (() => { const now = new Date(); return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`; })();
  const roomKey = `xinli-quiet-room-${localRoomDate}`;
  const safeRead = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); } catch { return fallback; } };
  const safeWrite = (key, value) => { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} };
  const fmtDate = value => new Intl.DateTimeFormat('zh-Hant-TW', { month: 'long', day: 'numeric' }).format(new Date(value));
  const addDays = days => { const date = new Date(); date.setHours(0, 0, 0, 0); date.setDate(date.getDate() + days); return date.getTime(); };

  const lockerRoom = $('#lockerRoom');
  const lockerEditor = $('#lockerEditor');
  if (lockerRoom && lockerEditor) {
    let lockers = safeRead(lockerKey, []);
    const lockerIds = Array.from({ length: 12 }, (_, i) => i + 1);
    const lockerData = id => lockers.find(item => item.id === id);
    const isReady = item => item && Date.now() >= item.unlockAt;

    function renderLockers() {
      lockerRoom.innerHTML = `<div class="locker-shelf-label"><span>AFTERNOON LOCKERS</span><small>選一個櫃子，替今天留一點空間</small></div><div class="locker-grid">${lockerIds.map(id => {
        const item = lockerData(id);
        const ready = isReady(item);
        const state = !item ? 'empty' : ready ? 'ready' : 'locked';
        const date = item ? new Date(item.unlockAt) : null;
        const month = date ? String(date.getMonth() + 1).padStart(2, '0') : '';
        const day = date ? String(date.getDate()).padStart(2, '0') : '';
        const label = !item ? '空著' : ready ? '可以取回' : `${month} / ${day} 再開`;
        return `<button class="locker ${state}" type="button" data-locker-id="${id}" aria-label="${id} 號櫃，${label}"><span class="locker-number">${String(id).padStart(2, '0')}</span><span class="locker-panel"><i></i><b></b></span><span class="locker-tag">${label}</span></button>`;
      }).join('')}</div><p class="locker-footnote">內容只存在這台裝置的瀏覽器；鎖上的櫃子不會在正常操作中提前顯示文字。</p>`;
    }

    function openLocker(id) {
      const item = lockerData(id);
      const door = lockerRoom.querySelector(`[data-locker-id="${id}"]`);
      if (door) { door.classList.add('locker-opening'); setTimeout(() => door.classList.remove('locker-opening'), 760); }
      if (item && !isReady(item)) {
        setTimeout(() => { lockerEditor.hidden = false;
        lockerEditor.innerHTML = `<div class="locker-locked-note"><span class="locker-lock-icon">⌑</span><div><p class="section-kicker">LOCKED UNTIL ${fmtDate(item.unlockAt)}</p><h2>${id} 號櫃還在替你保管。</h2><p>還沒到取回的日子。這裡不提供提前開啟、修改文字或更改日期。</p><button type="button" class="soft-action" data-close-locker>回到櫃子前</button></div></div>`;
        lockerEditor.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 560);
        return;
      }
      if (item && isReady(item)) {
        setTimeout(() => { lockerEditor.hidden = false;
        lockerEditor.innerHTML = `<div class="locker-unlocked-note"><div class="paper-reveal"><span>取回日</span><strong>${fmtDate(item.unlockAt)}</strong></div><div><p class="section-kicker">THE DAY HAS COME</p><h2>${id} 號櫃，現在可以打開了。</h2><p class="locker-retrieved-text">${item.text.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]))}</p><button type="button" class="primary-button" data-release-locker="${id}"><span>取回這張紙</span><b>→</b></button></div></div>`;
        lockerEditor.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 560);
        return;
      }
      setTimeout(() => { lockerEditor.hidden = false;
      lockerEditor.innerHTML = `<div class="locker-compose"><div class="paper-sheet"><span class="paper-rule"></span><span class="paper-rule"></span><span class="paper-rule"></span></div><div><p class="section-kicker">THE DOOR IS OPEN</p><h2 id="lockerEditorTitle">紙張在裡面，等你寫下來。</h2><p class="locker-private-note">這裡只替你保管在這台裝置上。你放進櫃子的文字只儲存在目前這個瀏覽器，不會傳送到「今日一息」，也不會用來分析你。</p><textarea id="lockerText" maxlength="1200" placeholder="把一件事寫在這張紙上。"></textarea><div class="locker-dates"><span>約好的取回日</span><button type="button" data-locker-days="1">明天</button><button type="button" data-locker-days="3">3 天後</button><button type="button" data-locker-days="7">7 天後</button><button type="button" data-locker-days="30">30 天後</button></div><div class="locker-compose-actions"><button type="button" class="soft-action" data-close-locker>關上櫃門</button><button type="button" class="primary-button" data-locker-save="${id}"><span>折起並放入</span><b>⌑</b></button></div><p class="locker-warn">清除瀏覽資料、使用無痕模式或更換裝置，寄放內容可能會一起消失。</p></div></div>`;
      lockerEditor.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 560);
    }

    lockerRoom.addEventListener('click', event => { const locker = event.target.closest('[data-locker-id]'); if (locker) openLocker(Number(locker.dataset.lockerId)); });
    lockerEditor.addEventListener('click', event => {
      if (event.target.closest('[data-close-locker]')) { lockerEditor.hidden = true; lockerEditor.innerHTML = ''; return; }
      const dateButton = event.target.closest('[data-locker-days]');
      if (dateButton) { $$('.locker-dates button', lockerEditor).forEach(button => button.classList.remove('active')); dateButton.classList.add('active'); lockerEditor.dataset.days = dateButton.dataset.lockerDays; }
      const save = event.target.closest('[data-locker-save]');
      if (save) {
        const text = ($('#lockerText', lockerEditor)?.value || '').trim();
        const days = Number(lockerEditor.dataset.days || 1);
        if (!text) { $('#lockerText', lockerEditor).focus(); return; }
        const id = Number(save.dataset.lockerSave);
        lockers = lockers.filter(item => item.id !== id);
        lockers.push({ id, text, unlockAt: addDays(days), createdAt: Date.now() });
        safeWrite(lockerKey, lockers);
        lockerEditor.innerHTML = `<div class="locker-sealed"><div class="paper-fold">✦</div><div><p class="section-kicker">DOOR CLOSED</p><h2>紙張折好，木栓扣上了。</h2><p>${fmtDate(addDays(days))} 再回來拿。門已關上，卡榫也扣好了。</p><button type="button" class="soft-action" data-close-locker>回到櫃子前</button></div></div>`;
        renderLockers();
      }
      const release = event.target.closest('[data-release-locker]');
      if (release) { lockers = lockers.filter(item => item.id !== Number(release.dataset.releaseLocker)); safeWrite(lockerKey, lockers); lockerEditor.hidden = true; lockerEditor.innerHTML = ''; renderLockers(); }
    });
    renderLockers();
  }

  const roomShell = $('#roomShell');
  if (roomShell) {
    const stayRoom = $('#stayRoom');
    const roomDoorway = $('#roomDoorway');
    const quietRoom = $('#quietRoom');
    const roomKeyState = `xinli-quiet-room-v2-${localRoomDate}`;
    const defaults = { open: false, zone: 'overview', window: false, curtains: false, lamp: true, lampLevel: .65, tea: false, plant: false, bookPage: 0, clockCovered: false, record: false, muted: true, sound: '安靜', bedRest: false, duvet: false };
    const roomState = Object.assign({}, defaults, safeRead(roomKeyState, {}));
    let transitionTimer = null;
    let audioContext = null;
    const saveRoom = () => safeWrite(roomKeyState, { zone: roomState.zone, window: roomState.window, curtains: roomState.curtains, lamp: roomState.lamp, lampLevel: roomState.lampLevel, tea: roomState.tea, plant: roomState.plant, bookPage: roomState.bookPage, clockCovered: roomState.clockCovered, record: roomState.record, muted: roomState.muted, sound: roomState.sound, bedRest: roomState.bedRest, duvet: roomState.duvet });
    const timeMode = () => { const hour = new Date().getHours(); return hour < 6 ? 'night' : hour < 11 ? 'morning' : hour < 17 ? 'day' : hour < 20 ? 'dusk' : 'night'; };
    const dailyRoomVariant = () => { const code = localRoomDate.split('-').reduce((sum, part) => sum + Number(part), 0); return ['clear', 'cloud', 'rain'][code % 3]; };
    const clockText = () => new Intl.DateTimeFormat('zh-TW', { hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date());
    const showContext = () => { const panel = $('#roomContextControls'); if (panel) panel.hidden = false; };
    const renderRoom = () => {
      const variant = dailyRoomVariant();
      roomShell.dataset.time = timeMode(); roomShell.dataset.zone = roomState.zone; roomShell.dataset.window = roomState.window ? 'open' : 'closed'; roomShell.dataset.curtains = roomState.curtains ? 'closed' : 'open'; roomShell.dataset.lamp = roomState.lamp ? 'on' : 'off'; roomShell.dataset.tea = roomState.tea ? 'full' : 'empty'; roomShell.dataset.plant = roomState.plant ? 'watered' : 'thirsty'; roomShell.dataset.clock = roomState.clockCovered ? 'covered' : 'visible'; roomShell.dataset.record = roomState.record ? 'playing' : 'stopped'; roomShell.dataset.bed = roomState.bedRest ? 'resting' : 'ready'; roomShell.dataset.duvet = roomState.duvet ? 'pulled' : 'laid'; roomShell.dataset.weather = variant; stayRoom.dataset.zone = roomState.zone;
      roomShell.style.setProperty('--lamp-level', roomState.lampLevel);
      $('#lampRange').value = roomState.lampLevel; $('#windowButton')?.setAttribute('aria-pressed', String(roomState.window)); $('#stayTime').textContent = clockText(); $('#roomClock').textContent = roomState.clockCovered ? '· ·' : clockText(); $('#stayMute span').textContent = roomState.muted ? '聲音：關' : `聲音：${roomState.sound}`; $('#soundButton').textContent = `環境聲：${roomState.sound}`; $('#skyWeather').textContent = variant === 'rain' ? '╱╱' : variant === 'cloud' ? '☁' : '○'; $('#windowWeather').textContent = variant === 'rain' ? '╱╱' : variant === 'cloud' ? '☁' : '☼'; $('#overviewWeather').textContent = variant === 'rain' ? '雨聲留在窗外' : variant === 'cloud' ? '雲影慢慢經過' : '安靜地留在房間裡';
      if ($('#windowStatus')) $('#windowStatus').textContent = roomState.window ? '窗戶開著；外面的風聲可以進來。' : '窗戶還關著，外面的聲音停在玻璃另一側。';
    };
    const setZone = zone => { if (!['overview', 'bed', 'window', 'lounge', 'life'].includes(zone)) return; roomState.zone = zone; roomState.bedRest = zone === 'bed' ? roomState.bedRest : false; renderRoom(); saveRoom(); };
    const playSoftTone = () => { if (roomState.muted) return; try { const AudioCtx = window.AudioContext || window.webkitAudioContext; if (!AudioCtx) return; audioContext ||= new AudioCtx(); const oscillator = audioContext.createOscillator(); const gain = audioContext.createGain(); oscillator.type = 'sine'; oscillator.frequency.value = roomState.sound === '雨' ? 176 : roomState.sound === '城市' ? 116 : 148; gain.gain.setValueAtTime(.001, audioContext.currentTime); gain.gain.exponentialRampToValueAtTime(.012, audioContext.currentTime + .03); gain.gain.exponentialRampToValueAtTime(.001, audioContext.currentTime + .42); oscillator.connect(gain).connect(audioContext.destination); oscillator.start(); oscillator.stop(audioContext.currentTime + .45); } catch {} };
    const cycleSound = () => { const choices = roomState.window ? ['安靜', '風', '雨', '城市'] : ['安靜', '室內']; roomState.sound = choices[(choices.indexOf(roomState.sound) + 1) % choices.length]; renderRoom(); saveRoom(); playSoftTone(); };
    const enterRoom = () => { if (roomState.open || transitionTimer) return; roomState.open = true; roomDoorway.classList.add('stay-door-opening'); roomShell.classList.add('stay-entering'); transitionTimer = setTimeout(() => { roomDoorway.hidden = true; quietRoom.hidden = false; roomDoorway.classList.remove('stay-door-opening'); roomShell.classList.remove('stay-entering'); roomShell.classList.add('stay-entered'); transitionTimer = null; renderRoom(); saveRoom(); }, 480); };
    const leaveRoom = () => { clearTimeout(transitionTimer); transitionTimer = null; roomState.open = false; roomDoorway.hidden = false; quietRoom.hidden = true; roomShell.classList.remove('stay-entering', 'stay-entered'); roomState.zone = 'overview'; renderRoom(); };
    $('#roomDoor').addEventListener('click', enterRoom); $('#roomExit').addEventListener('click', leaveRoom);
    stayRoom.addEventListener('click', event => { const target = event.target.closest('[data-zone-target]'); if (target) { setZone(target.dataset.zoneTarget); return; } if (event.target.closest('#windowButton')) { roomState.window = !roomState.window; if (roomState.window && roomState.sound === '安靜') roomState.sound = '風'; if (!roomState.window) roomState.sound = '安靜'; renderRoom(); saveRoom(); playSoftTone(); return; } if (event.target.closest('#bedButton')) { roomState.bedRest = !roomState.bedRest; $('#bedStatus').textContent = roomState.bedRest ? '視線低下來了；你可以拉一下被子。' : '你回到床邊坐著。'; renderRoom(); saveRoom(); return; } if (event.target.closest('#duvetButton')) { roomState.duvet = !roomState.duvet; $('#bedStatus').textContent = roomState.duvet ? '被子輕輕拉到身前。' : '被子放回床面。'; renderRoom(); saveRoom(); return; } if (event.target.closest('#bedLampButton')) { roomState.lamp = !roomState.lamp; showContext(); renderRoom(); saveRoom(); return; } if (event.target.closest('#sofaButton')) { $('#loungeStatus').textContent = '你坐下來，這裡不需要立刻做決定。'; renderRoom(); saveRoom(); return; } if (event.target.closest('#teaButton')) { roomState.tea = !roomState.tea; $('#loungeStatus').textContent = roomState.tea ? '熱飲倒好了；蒸氣會慢慢散去。' : '杯子空了，桌面保持安靜。'; renderRoom(); saveRoom(); return; } if (event.target.closest('#bookButton')) { roomState.bookPage = (roomState.bookPage + 1) % 4; $('#loungeStatus').textContent = `書翻到第 ${roomState.bookPage + 1} 頁。`; renderRoom(); saveRoom(); return; } if (event.target.closest('#lampButton')) { roomState.lamp = !roomState.lamp; showContext(); renderRoom(); saveRoom(); return; } if (event.target.closest('#recordButton')) { roomState.record = !roomState.record; roomState.sound = roomState.record ? (roomState.window ? '風' : '室內') : '安靜'; showContext(); renderRoom(); saveRoom(); playSoftTone(); return; } if (event.target.closest('#plantButton')) { roomState.plant = !roomState.plant; $('#lifeStatus').textContent = roomState.plant ? '水落進土裡了。' : '植物安靜地待在桌邊。'; renderRoom(); saveRoom(); return; } if (event.target.closest('#clockCoverButton')) { roomState.clockCovered = !roomState.clockCovered; renderRoom(); saveRoom(); } });
    $$('.window-curtain').forEach(curtain => { let startX = 0; curtain.addEventListener('pointerdown', event => { startX = event.clientX; curtain.setPointerCapture?.(event.pointerId); }); curtain.addEventListener('pointerup', event => { if (Math.abs(event.clientX - startX) > 8) { roomState.curtains = event.clientX < startX; renderRoom(); saveRoom(); } }); });
    $('#closeCurtainButton').addEventListener('click', () => { roomState.curtains = !roomState.curtains; renderRoom(); saveRoom(); }); $('#soundButton').addEventListener('click', cycleSound); $('#stayMute').addEventListener('click', () => { roomState.muted = !roomState.muted; renderRoom(); saveRoom(); }); $('#lampRange').addEventListener('input', event => { roomState.lampLevel = Number(event.target.value); roomState.lamp = true; renderRoom(); saveRoom(); });
    setInterval(() => { if (roomState.open) renderRoom(); }, 30000); renderRoom();
  }


})();

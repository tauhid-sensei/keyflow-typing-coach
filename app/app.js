const $ = id => document.getElementById(id);
const browserAPI = (typeof browser !== "undefined" && browser.storage) ? browser : chrome;
const storage = browserAPI.storage.local;
const texts = {
 easy: ["Good typing starts with calm hands and a steady rhythm.","Keep your fingers relaxed and return to the home row.","Small daily practice can make a big difference over time.","Accuracy is more useful than rushing through every sentence."],
 medium: ["Consistent practice builds muscle memory, confidence, and control.","A comfortable posture helps you type longer without unnecessary tension.","Focus on the words ahead, not on the keys beneath your fingers.","When you make a mistake, correct it calmly and continue with purpose."],
 hard: ["Efficient communication depends on clarity, precision, and thoughtful execution.","Developing touch-typing skill requires patience, repetition, and deliberate attention.","Reliable performance emerges when accuracy becomes automatic rather than forced.","The objective is not frantic movement, but consistent, economical keystrokes."]
};
const lessonStages = [
  {name:"Home row",level:"BEGINNER",keys:"a s d f j k l ;",drills:["asdf jkl; fdsa ;lkj","fj fj dk sl a; as df jk l;","asdf asdf jkl; jkl;","fdsa lkj; asdf jkl;"],desc:"Rest your fingers on A S D F and J K L ;. Find the small bumps on F and J, and return to the home row after every reach."},
  {name:"Home row rhythm",level:"BEGINNER",keys:"a s d f j k l ;",drills:["fj dk sl a; as df jk l;","asdf jkl; fdsa ;lkj","a s d f j k l ;","fjdksla; asdfjkl;"],desc:"Build an even rhythm with home-row patterns. Keep your wrists relaxed and avoid hitting keys harder than needed."},
  {name:"Top row reach",level:"BEGINNER",keys:"q w e r t y u i o p",drills:["qwer uiop trew poiu","qwert yuiop poiuy trewq","were ripe quiet power","type your upper row slowly"],desc:"Reach upward from the home row without moving your whole hand. Return each finger to its home position."},
  {name:"Bottom row reach",level:"BEGINNER",keys:"z x c v b n m",drills:["zxcv nmvc bnm zxcv","z x c v b n m","calm move brave mix","vbnm cvxz mnbv"],desc:"Reach down to the bottom row with the correct finger, then return to the home row."},
  {name:"Common words",level:"BEGINNER",keys:"t h e r i n g",drills:["the there their thing right ring write","there is the right way to begin","think then type these words again","their timing is getting better"],desc:"Practice common words as groups rather than typing one letter at a time. Let familiar patterns become automatic."},
  {name:"Capital letters",level:"INTERMEDIATE",keys:"Shift + letters",drills:["The Quick Brown Fox Meets Monday","Today We Practice With Care","A Good Habit Builds Over Time","Typing Clearly Helps Everyone"],desc:"Use the opposite hand to press Shift when possible. Keep your hands near their home positions."},
  {name:"Punctuation",level:"INTERMEDIATE",keys:", . ' ? !",drills:["Wait, that's right. Isn't it? Yes!","Hello, world! How are you today?","I can't go; it's late, isn't it?","Well, let's try again: slowly, carefully."],desc:"Use punctuation deliberately. Keep a steady pace around commas, apostrophes, questions, and sentence endings."},
  {name:"Numbers and symbols",level:"INTERMEDIATE",keys:"1 2 3 4 5 6 7 8 9 0",drills:["2026: 14, 28, 360, 95% & 7!","Room 204 has 3 desks and 12 books.","Price: $24.50, discount: 15%.","Version 2.0 needs 8 updates."],desc:"Reach for number-row keys with the correct finger. Prioritize accuracy when practicing symbols."},
  {name:"Words and flow",level:"INTERMEDIATE",keys:"Full keyboard",drills:["Steady practice creates useful progress.","Focus on accuracy before speed.","Keep your hands relaxed and move with purpose.","Small improvements add up every day."],desc:"Connect individual keystrokes into words and phrases. Keep your rhythm smooth instead of rushing."},
  {name:"Real-world passages",level:"ADVANCED",keys:"Full keyboard",drills:["Good work grows from focus, practice, and patience. Stay accurate, then increase your pace.","Clear writing helps people share ideas and solve problems together.","Reliable results come from calm attention and consistent effort."],desc:"Bring every skill together in realistic passages. Maintain natural rhythm, punctuation, and relaxed posture."}
];
const lessons = Array.from({length:100},(_,i)=>{
  const stage = lessonStages[Math.floor(i/10)] || lessonStages[9];
  const cycle = Math.floor(i/10)+1;
  const drill = stage.drills[(i + Math.floor(i/10)) % stage.drills.length];
  const level = i < 40 ? "BEGINNER" : i < 75 ? "INTERMEDIATE" : "ADVANCED";
  const goal = i < 40 ? 92 : i < 75 ? 94 : 95;
  const focus = ["accuracy","rhythm","finger placement","consistency","smooth transitions"][i%5];
  return {
    id:i+1,
    title:`${stage.name} ${String((i%10)+1).padStart(2,"0")}`,
    level,
    desc:`Lesson ${i+1} of 100. ${stage.desc} Focus today: ${focus}. Repeat the drill with relaxed hands and aim for at least ${goal}% accuracy.`,
    keys:stage.keys,
    drill: Array.from({length: 1+(i%3)},()=>drill).join(" "),
    goal
  };
});
let mode="speed", target="", startAt=null, interval=null, sessions=[], statsSaved=false, currentLesson=0, lessonDone=[], lessonPage=0;
const hints=["Relax your shoulders and keep your eyes on the text.","Use a light touch. You do not need to hit keys hard.","Accuracy first. Speed follows when your fingers learn the path.","Keep your wrists neutral and avoid reaching with one finger."];
const passageBank = [
"Strong typing is not about moving your fingers as quickly as possible. It is about building a comfortable rhythm, choosing the right finger for each key, and staying accurate while your hands move naturally across the keyboard.",
"A useful practice routine starts with a clear goal. Some days you may focus on accuracy, while other days you may work on rhythm, punctuation, numbers, or longer passages. Small, repeatable sessions help build reliable muscle memory over time.",
"When you type, try to keep your shoulders relaxed and your wrists in a neutral position. Avoid pressing the keys harder than necessary. Look at the text on the screen instead of watching your fingers, and let your hands return to their home positions between reaches.",
"Progress does not always happen in a straight line. A difficult exercise may lower your speed for a while, but it can reveal a weakness that is worth training. Use mistakes as useful information, then repeat the pattern slowly until it feels more familiar.",
"Good communication depends on more than speed. Clear sentences, careful punctuation, correct capitalization, and thoughtful word choice all matter. Typing practice can help you work more comfortably on school assignments, creative projects, notes, and professional documents.",
"Take short breaks when your hands feel tired. A few focused minutes with good technique are more valuable than a long session full of tension. If your accuracy begins to fall, reduce your pace and regain control before trying to go faster again.",
"Touch typing becomes easier when each finger has a consistent job. Learn the home row first, then practice reaching to the top and bottom rows. Add numbers and punctuation after the basic movements feel comfortable, and gradually work toward realistic passages."
];
function randomText(){
  const level = $("difficulty").value;
  const targetWords = level === "easy" ? 30 : level === "hard" ? 50 : 40;
  const pieces = [];
  let words = 0;
  while(words < targetWords){
    const sentence = passageBank[Math.floor(Math.random()*passageBank.length)];
    pieces.push(sentence);
    words += sentence.trim().split(/\s+/).length;
  }
  // Shuffle sentence order for a genuinely different practice passage each time.
  for(let i=pieces.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[pieces[i],pieces[j]]=[pieces[j],pieces[i]];}
  // Hard cap the actual passage length; do not let the final sentence push it past 50 words.
  return pieces.join(" ").trim().split(/\s+/).slice(0, 50).join(" ");
}
function renderTarget(typed=""){const p=$("prompt");p.innerHTML="";for(let i=0;i<target.length;i++){const s=document.createElement("span");s.textContent=target[i];if(i<typed.length)s.className=typed[i]===target[i]?"correct":"incorrect";else s.className="remaining";if(i===typed.length)s.className+=" current";p.appendChild(s);}}
function elapsed(){return startAt?Math.max(0,(Date.now()-startAt)/1000):0;}
function clock(sec){const s=Math.floor(sec);return `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;}
function resetSession(newTarget=true){clearInterval(interval);interval=null;startAt=null;statsSaved=false;if(newTarget||!target)target=randomText();$("typing-input").value="";$("typing-input").disabled=false;$("wpm").textContent="0";$("accuracy").textContent="100%";$("time").textContent="00:00";$("errors").textContent="0";$("feedback").textContent="Start typing to see your accuracy and progress here.";$("progress-bar").style.width="0%";$("progress-label").textContent="0% completed";$("coach-note").textContent=mode==="learn"?"Slow down and build a clean, accurate keystroke pattern.":"Accuracy comes first. Speed follows when your fingers learn the path.";$("hint").textContent=hints[Math.floor(Math.random()*hints.length)];$("exercise-title").textContent=mode==="learn"?"Accuracy is your foundation":"Find your rhythm";$("mode-pill").textContent=mode==="learn"?"ACCURACY SESSION":"SPEED SESSION";renderTarget();}
function saveSession(wpm,accuracy,duration,errorCount){if(statsSaved)return;statsSaved=true;sessions.unshift({date:new Date().toISOString(),wpm,accuracy,duration:Math.round(duration),errors:errorCount,mode});sessions=sessions.slice(0,100);storage.set({sessions});}
function updateStats(){const typed=$("typing-input").value;if(typed.length&&!startAt){startAt=Date.now();interval=setInterval(()=>{$("time").textContent=clock(elapsed());},250);}const sec=elapsed();let correct=0,wrong=0;for(let i=0;i<typed.length;i++){if(typed[i]===target[i])correct++;else wrong++;}const accuracy=typed.length?Math.round(correct/typed.length*100):100;const wpm=sec>0?Math.round((correct/5)/(sec/60)):0;$("wpm").textContent=wpm;$("accuracy").textContent=accuracy+"%";$("errors").textContent=wrong;$("time").textContent=clock(sec);const pct=Math.min(100,Math.round(typed.length/target.length*100));$("progress-bar").style.width=pct+"%";$("progress-label").textContent=pct+"% completed";renderTarget(typed);if(!typed.length)$("feedback").textContent="Start typing to see your accuracy and progress here.";else if(wrong)$("feedback").textContent=`You have ${wrong} mismatch${wrong===1?"":"es"}. Slow down slightly and focus on clean keystrokes.`;else $("feedback").textContent=`Nice control. ${correct} characters correct so far. Keep a steady rhythm.`;if(wrong>=3)$("coach-note").textContent="Pause for a breath. Accuracy is dropping; reduce speed for the next few words.";else if(accuracy<95&&typed.length>8)$("coach-note").textContent="Aim for 95% accuracy before increasing your pace.";else if(wpm>0)$("coach-note").textContent="Good. Keep your hands relaxed and use the correct finger for each key.";if(typed.length>=target.length){$("typing-input").disabled=true;clearInterval(interval);interval=null;saveSession(wpm,accuracy,sec,wrong);$("feedback").textContent=`Completed! ${wpm} WPM at ${accuracy}% accuracy. Choose New text to keep going.`;$("coach-note").textContent=accuracy>=95?"Solid run. Try a harder text or work on keeping the same accuracy at a higher pace.":"Repeat this level and aim for 95% accuracy before moving up.";loadProgress();autoReviewSession(wpm,accuracy,wrong);}}
async function requestAI(data,systemPrompt,userPrompt){
  const provider=data.apiProvider||"openai";
  const model=(data.apiModel|| (provider==="google"?"gemini-3.8-flash":"gpt-4o-mini")).trim();
  const base=(data.apiEndpoint||"").replace(/\/+$/ ,"");
  if(!/^https?:\/\//i.test(base)) throw new Error("Enter a valid API base URL.");
  let response,body;
  if(provider==="google"){
    const root=base.includes("/models")?base:"https://generativelanguage.googleapis.com/v1beta/models";
    const callGemini=async modelName=>{
      const url=root.replace(/\/+$/ ,"")+"/"+encodeURIComponent(modelName)+":generateContent?key="+encodeURIComponent(data.apiKey);
      const controller=new AbortController(); const timer=setTimeout(()=>controller.abort(),12000); let res; try { res=await fetch(url,{method:"POST",headers:{"Content-Type":"application/json"},signal:controller.signal,body:JSON.stringify({systemInstruction:{parts:[{text:systemPrompt}]},contents:[{role:"user",parts:[{text:userPrompt}]}],generationConfig:{temperature:0.4,maxOutputTokens:700}})}); } catch(err) { if(err.name==="AbortError") throw new Error("Google AI request timed out after 12 seconds. Check your API key, model access, and network, then try again."); throw err; } finally { clearTimeout(timer); }
      let json={};try{json=await res.json();}catch(_){ }
      return {res,json};
    };
    let result=await callGemini(model); response=result.res; body=result.json;
    if(!response.ok && [400,404,429,500,503].includes(response.status)){
      // Discover models this key can access. Retry with a different Flash model for retired,
      // overloaded, or temporarily unavailable models; keep the total wait bounded.
      const listUrl=root.replace(/\/+$/ ,"").replace(/\/models$/ ,"")+"/models?key="+encodeURIComponent(data.apiKey);
      let listed,listing={}; const listController=new AbortController(); const listTimer=setTimeout(()=>listController.abort(),4000); try { listed=await fetch(listUrl,{signal:listController.signal}); try{listing=await listed.json();}catch(_){ } } catch(_) { /* Discovery is best effort. */ } finally { clearTimeout(listTimer); }
      const available=(listing.models||[]).filter(m=>(m.supportedGenerationMethods||[]).includes("generateContent") && /flash/i.test(m.name||""));
      const ranked=available.sort((a,b)=>((/gemini-3\./i.test(b.name||"")?2:0)+(/flash/i.test(b.name||"")?1:0))-((/gemini-3\./i.test(a.name||"")?2:0)+(/flash/i.test(a.name||"")?1:0)));
      const candidates=ranked.map(m=>String(m.name).replace(/^models\//,"")).filter(n=>n!==model).slice(0,2);
      for(const candidate of candidates){
        try { result=await callGemini(candidate); response=result.res; body=result.json; if(response.ok) break; }
        catch(_) { /* Try one more compatible model, then show a clear error. */ }
      }
    }
    if(!response.ok) {
      const status=response.status;
      if(status===429 || status===503) throw new Error("Google AI is temporarily overloaded or rate-limited. Wait a minute or choose another available Gemini Flash model in Settings.");
      throw new Error((body.error?.message||"Google Gemini API request failed ("+status+")")+". Open Settings and choose a model available to your API key.");
    }
    const answer=body.candidates?.[0]?.content?.parts?.map(p=>p.text||"").join("\n").trim();
    if(!answer) throw new Error("Gemini returned no text. Check model access and safety settings.");
    return answer;
  }
  const controller=new AbortController(); const timer=setTimeout(()=>controller.abort(),12000); try { response=await fetch(base+"/chat/completions",{method:"POST",headers:{"Content-Type":"application/json","Authorization":"Bearer "+data.apiKey},signal:controller.signal,body:JSON.stringify({model,messages:[{role:"system",content:systemPrompt},{role:"user",content:userPrompt}]})}); } catch(err) { if(err.name==="AbortError") throw new Error("AI request timed out after 12 seconds. Check provider, model, API key, and network."); throw err; } finally { clearTimeout(timer); }
  body=await response.json();
  if(!response.ok) throw new Error(body.error?.message||"AI provider returned "+response.status);
  const answer=body.choices?.[0]?.message?.content;
  if(!answer) throw new Error("AI provider returned no advice.");
  return typeof answer==="string"?answer:JSON.stringify(answer);
}
async function autoReviewSession(wpm,accuracy,wrong){
  const note=$("coach-note");
  const settings=await storage.get(["apiKey"]);
  const localTip=accuracy<90?"AI monitor: accuracy is low. Slow down and repeat the same level before increasing speed.":accuracy<96?"AI monitor: keep your pace comfortable and aim for 96% accuracy.":"AI monitor: accuracy is strong. Increase difficulty gradually while preserving control.";
  note.textContent=localTip;
  if(!settings.apiKey)return;
  const question=`Automatically review this completed typing session. Give 2 or 3 short actionable tips and one drill. WPM ${wpm}, accuracy ${accuracy}%, errors ${wrong}, mode ${mode}, difficulty ${$("difficulty").value}.`;
  try{
    const data=await storage.get(["apiKey","apiProvider","apiEndpoint","apiModel"]);
    const answer=await requestAI(data,"You are KeyFlow's typing performance monitor. Be concise, specific, and practical. Base all advice only on supplied statistics.",question);
    note.textContent="AI session review: "+answer;
  }catch(e){note.textContent=localTip+" AI service was unavailable; built-in monitoring stayed active.";}
}
function showView(name){document.querySelectorAll(".view").forEach(v=>v.classList.add("hidden"));$("view-"+name).classList.remove("hidden");document.querySelectorAll(".nav").forEach(b=>b.classList.toggle("active",b.dataset.view===name));if(name==="practice"&&target){resetSession(true);}const t={practice:["Practice makes progress.","Build speed without sacrificing accuracy."],course:["Learn a skill that sticks.","Follow a structured course from home row to full passages."],progress:["Your progress, made visible.","Track consistency and turn practice into improvement."],coach:["A coach in your corner.","Get clear, practical advice for your next session."]};$("page-title").textContent=t[name][0];$("page-subtitle").textContent=t[name][1];if(name==="progress")loadProgress();if(name==="course")renderCourse();if(name==="coach")refreshAIStatus();}
async function loadProgress(){const d=await storage.get(["sessions"]);sessions=d.sessions||[];const best=sessions.reduce((m,s)=>Math.max(m,s.wpm||0),0),avg=sessions.length?Math.round(sessions.reduce((n,s)=>n+(s.accuracy||0),0)/sessions.length):null;$("best-wpm").textContent=best;$("sessions").textContent=sessions.length;$("avg-accuracy").textContent=avg===null?"—":avg+"%";$("total-errors").textContent=sessions.reduce((n,s)=>n+(s.errors||0),0);const h=$("history");h.innerHTML="";if(!sessions.length){h.className="history-empty";h.textContent="Finish a practice session to start building your progress history.";return;}h.className="";sessions.slice(0,10).forEach(s=>{const row=document.createElement("div");row.className="history-item";const label=new Date(s.date).toLocaleDateString()+" "+new Date(s.date).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});[label,`${s.wpm} WPM`,`${s.accuracy}%`,`${s.errors} errors`].forEach((v,i)=>{const e=document.createElement(i===0?"b":"span");e.textContent=v;row.appendChild(e);});h.appendChild(row);});$("progress-advice").textContent=avg!==null&&avg<95?"Your next focus is accuracy. Repeat easier text until you can stay above 95%, then raise the difficulty.":best<30?"Build a daily habit with short, accurate sessions. Keep your eyes on the text and learn the home row.":"Keep your accuracy stable as you increase difficulty. A consistent pace beats short bursts of frantic speed.";}
function renderCourse(){
  const list=$("lesson-list"); list.innerHTML="";
  const done=new Set(lessonDone);
  const search=($("lesson-search")?.value||"").toLowerCase().trim();
  const filter=$("lesson-filter")?.value||"ALL";
  const filtered=lessons.filter((l,i)=>{
    const isDone=done.has(i);
    const matchSearch=!search||(l.title+" "+l.desc+" "+l.level).toLowerCase().includes(search);
    const matchFilter=filter==="ALL"||(filter==="DONE"&&isDone)||(filter==="TODO"&&!isDone)||l.level===filter;
    return matchSearch&&matchFilter;
  });
  const perPage=25;
  const pages=Math.max(1,Math.ceil(filtered.length/perPage));
  lessonPage=Math.min(lessonPage,pages-1);
  const pageItems=filtered.slice(lessonPage*perPage,(lessonPage+1)*perPage);
  pageItems.forEach(l=>{
    const i=l.id-1;
    const b=document.createElement("button");
    b.className="lesson-tile"+(i===currentLesson?" selected":"")+(done.has(i)?" done":"");
    const top=document.createElement("div");top.className="lesson-id";
    const num=document.createElement("span");num.textContent=String(l.id).padStart(3,"0");
    const state=document.createElement("span");state.textContent=done.has(i)?"✓ DONE":l.level;
    top.append(num,state);
    const h=document.createElement("h3");h.textContent=l.title;
    const p=document.createElement("p");p.textContent=l.desc;
    b.append(top,h,p);b.addEventListener("click",()=>{currentLesson=i;renderCourse();});
    list.appendChild(b);
  });
  $("lesson-page-label").textContent=`Page ${lessonPage+1} of ${pages} · ${filtered.length} lessons`;
  $("lesson-prev").disabled=lessonPage===0;
  $("lesson-next").disabled=lessonPage>=pages-1;
  const l=lessons[currentLesson];
  $("lesson-title").textContent=`Lesson ${currentLesson+1}: ${l.title}`;
  $("lesson-level").textContent=l.level;
  $("lesson-description").textContent=l.desc;
  $("lesson-drill").textContent=l.drill;
  $("drill-input").value="";
  $("drill-result").textContent=`Type the drill with at least ${l.goal}% accuracy to unlock completion.`;
  $("complete-lesson").disabled=true;
  const keys=$("lesson-keys");keys.innerHTML="";
  l.keys.split(" ").forEach(k=>{const el=document.createElement("kbd");el.textContent=k;el.className=/^[asdfjkl;]$/i.test(k)?"home":"";keys.appendChild(el);});
  $("course-complete").textContent=`${lessonDone.length} / ${lessons.length}`;
  $("course-bar").style.width=(lessonDone.length/lessons.length*100)+"%";
}
async function readSettings(){const s=await storage.get(["apiKey","apiProvider","apiEndpoint","apiModel"]);$("api-key").value=s.apiKey||"";$("api-provider").value=s.apiProvider||"openai";const presets={openai:["https://api.openai.com/v1","gpt-4o-mini"],openrouter:["https://openrouter.ai/api/v1","openai/gpt-4o-mini"],groq:["https://api.groq.com/openai/v1","llama-3.3-70b-versatile"],google:["https://generativelanguage.googleapis.com/v1beta/models","gemini-3.8-flash"],custom:["https://api.openai.com/v1",""]};const p=presets[$("api-provider").value]||presets.custom;$("api-endpoint").value=s.apiEndpoint||p[0];$("api-model").value=s.apiModel||p[1];refreshAIStatus();}
function openSettings(){readSettings();$("settings-modal").classList.remove("hidden");}
function closeSettings(){$("settings-modal").classList.add("hidden");}
function refreshAIStatus(){storage.get(["apiKey","apiProvider"]).then(s=>{$("ai-status").textContent=s.apiKey?`${(s.apiProvider||"openai").toUpperCase()} READY`:"BUILT-IN MODE";});}
const providerDefaults={openai:["https://api.openai.com/v1","gpt-4o-mini"],openrouter:["https://openrouter.ai/api/v1","openai/gpt-4o-mini"],groq:["https://api.groq.com/openai/v1","llama-3.3-70b-versatile"],google:["https://generativelanguage.googleapis.com/v1beta/models","gemini-3.8-flash"],custom:["https://api.openai.com/v1",""]};
$("api-provider").addEventListener("change",()=>{const p=providerDefaults[$("api-provider").value]||providerDefaults.custom;$("api-endpoint").value=p[0];$("api-model").value=p[1];});
function builtInAdvice(q,wpm,accuracy,err){let out=[];if(accuracy<90)out.push("Priority: slow down until accuracy improves. Do not chase WPM while errors are frequent.");else if(accuracy<96)out.push("You are close to a strong accuracy baseline. Aim for 96% or better before pushing speed.");else out.push("Your accuracy is in a good range. Try to preserve it while gradually increasing pace.");if(wpm<25)out.push("Practice 5–10 minutes daily. Focus on the home row and use the correct finger rather than reaching with your index fingers.");else if(wpm<45)out.push("Use short bursts of 30–60 seconds at a comfortable pace, then repeat while keeping accuracy stable.");else out.push("Try harder passages with punctuation and longer words. Keep your wrists neutral and avoid unnecessary finger movement.");if(err>0)out.push(`You recorded ${err} mismatches in this run. Notice whether the same keys or letter pairs keep tripping you up, then drill those slowly.`);out.push("A simple drill: type a short passage three times. First for accuracy, second for smooth rhythm, third at a slightly faster pace.");if(q)out.push("For your question: "+q);return out.join("\n\n");}
async function coach(question){const data=await storage.get(["apiKey","apiProvider","apiEndpoint","apiModel"]);const typed=$("typing-input").value, mins=Math.max(elapsed()/60,.01),correct=typed.split("").filter((c,i)=>c===target[i]).length,wpm=Math.round((correct/5)/mins),accuracy=typed.length?Math.round(correct/typed.length*100):100;const ctx=`Current practice mode: ${mode}. Current WPM: ${wpm}. Accuracy: ${accuracy}%. Errors: ${$("errors").textContent}. Difficulty: ${$("difficulty").value}.`;const fallback=builtInAdvice(question,wpm,accuracy,Number($("errors").textContent)||0);if(!data.apiKey){$("coach-answer").textContent=fallback+"\n\nFor personalized AI responses, add an API key in Settings.";return;}$("coach-answer").textContent="Contacting your AI provider… this will time out after 12 seconds if there is no response.";try{const answer=await requestAI(data,"You are a practical touch-typing coach. Give concise, specific, encouraging but honest advice. Use simple drills and focus on technique, accuracy, posture, and sustainable speed. Do not claim to see keystrokes beyond the provided metrics.",ctx+"\\nQuestion: "+question);$("coach-answer").textContent=answer;}catch(e){$("coach-answer").textContent="AI request failed: "+e.message+"\n\n"+fallback+"\n\nCheck the key, model, endpoint, network, and whether your provider allows browser requests (CORS).";}}
document.querySelectorAll(".nav").forEach(b=>b.addEventListener("click",()=>showView(b.dataset.view)));
document.querySelectorAll(".mode").forEach(b=>b.addEventListener("click",()=>{mode=b.dataset.mode;document.querySelectorAll(".mode").forEach(x=>x.classList.toggle("active",x===b));resetSession(false);}));
$("typing-input").addEventListener("input",updateStats);$("reset").addEventListener("click",()=>resetSession(false));$("new-text").addEventListener("click",()=>resetSession(true));$("difficulty").addEventListener("change",()=>resetSession(true));
$("open-settings").addEventListener("click",openSettings);$("close-settings").addEventListener("click",closeSettings);
const pinWelcome=new URLSearchParams(location.search).get("welcome")==="pin";
function closePinWelcome(){$("pin-welcome-modal").classList.add("hidden");}
$("close-pin-welcome").addEventListener("click",closePinWelcome);$("dismiss-pin-welcome").addEventListener("click",closePinWelcome);$("done-pin-welcome").addEventListener("click",closePinWelcome);
if(pinWelcome) $("pin-welcome-modal").classList.remove("hidden");
$("save-settings").addEventListener("click",async()=>{await storage.set({apiKey:$("api-key").value.trim(),apiProvider:$("api-provider").value,apiEndpoint:$("api-endpoint").value.trim(),apiModel:$("api-model").value.trim()});$("settings-message").textContent="Settings saved on this browser.";refreshAIStatus();});
$("remove-key").addEventListener("click",async()=>{$("api-key").value="";await storage.remove("apiKey");$("settings-message").textContent="API key removed.";refreshAIStatus();});
$("ask-coach").addEventListener("click",()=>{showView("coach");$("coach-question").value="How can I improve based on my latest typing session?";coach($("coach-question").value);});
$("send-coach").addEventListener("click",()=>coach($("coach-question").value||"Give me practical advice based on my current stats."));
document.querySelectorAll("[data-question]").forEach(b=>b.addEventListener("click",()=>{$("coach-question").value=b.dataset.question;coach(b.dataset.question);}));
$("drill-input").addEventListener("input",()=>{const l=lessons[currentLesson],typed=$("drill-input").value;let correct=0;for(let i=0;i<typed.length;i++)if(typed[i]===l.drill[i])correct++;const acc=typed.length?Math.round(correct/typed.length*100):100;const complete=typed.length>=l.drill.length&&acc>=l.goal;$("drill-result").textContent=typed.length>=l.drill.length?(acc>=l.goal?`Nice work: ${acc}% accuracy. You can complete this lesson.`:`You reached the end at ${acc}%. Repeat slowly and aim for ${l.goal}%.`):`${correct} correct characters, ${acc}% accuracy. ${acc<l.goal?"Slow down and focus on each key.":"Nice and steady. Keep going."}`;$("complete-lesson").disabled=!complete;});
$("complete-lesson").addEventListener("click",()=>{if(!lessonDone.includes(currentLesson))lessonDone.push(currentLesson);storage.set({lessonDone});if(currentLesson<lessons.length-1)currentLesson++;lessonPage=Math.floor(currentLesson/25);renderCourse();});
$("lesson-prev").addEventListener("click",()=>{lessonPage=Math.max(0,lessonPage-1);renderCourse();});
$("lesson-next").addEventListener("click",()=>{lessonPage++;renderCourse();});
$("lesson-search").addEventListener("input",()=>{lessonPage=0;renderCourse();});
$("lesson-filter").addEventListener("change",()=>{lessonPage=0;renderCourse();});
$("clear-progress").addEventListener("click",async()=>{if(confirm("Delete all saved practice sessions?")){sessions=[];await storage.set({sessions:[]});loadProgress();}});
storage.get(["sessions","lessonDone"]).then(s=>{sessions=s.sessions||[];lessonDone=s.lessonDone||[];renderCourse();});
resetSession(true);

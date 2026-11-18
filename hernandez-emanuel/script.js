const activityConfig={exercises:{name:'Ejercicios formativos',max:100,total:4},match:{name:'Asociación',max:100,total:4},memory:{name:'Memorama',max:100,total:4},detective:{name:'Detective sistémico',max:150,total:3},sequence:{name:'Construye el flujo',max:100,total:1},quiz:{name:'Evaluación final',max:200,total:5}};
const progressKey='conexionesTGSProgressV3';
let savedProgress={};
try{savedProgress=JSON.parse(localStorage.getItem(progressKey)||'{}')||{}}catch(error){savedProgress={}}
function saveProgress(){localStorage.setItem(progressKey,JSON.stringify(savedProgress));renderProgress()}
function registerActivity(id,correct,total){const config=activityConfig[id];if(!config)return;const previous=savedProgress[id]?.correct??-1;if(correct>previous){savedProgress[id]={correct,total:config.total};saveProgress()}else{renderProgress()}}
function getTotals(){let xp=0,max=Object.values(activityConfig).reduce((sum,item)=>sum+item.max,0),perfect=0,done=0;Object.entries(activityConfig).forEach(([id,config])=>{const score=savedProgress[id]?.correct??0;const available=savedProgress[id]?config.max*score/config.total:0;xp+=available;if(savedProgress[id])done++;if(score===config.total)perfect++});return{xp:Math.round(xp),max,perfect,done,count:Object.keys(activityConfig).length}}
function renderProgress(){const totals=getTotals(),percent=Math.round(totals.xp/totals.max*100),levels=[{min:0,name:'Aprendiz sistémico'},{min:150,name:'Explorador de sistemas'},{min:300,name:'Analista sistémico'},{min:450,name:'Ingeniero sistémico'},{min:600,name:'Maestro sistémico'}],level=[...levels].reverse().find(item=>totals.xp>=item.min)||levels[0];const value=document.getElementById('xpValue'),bar=document.getElementById('xpBar'),levelNode=document.getElementById('xpLevel'),percentNode=document.getElementById('xpPercent'),topXp=document.getElementById('topXp'),topLevel=document.getElementById('topLevel'),medal=document.getElementById('medalPanel'),medalText=document.getElementById('medalText'),medalStatus=document.getElementById('medalStatus');if(value)value.textContent=`${totals.xp} / ${totals.max} XP`;if(bar)bar.style.width=`${percent}%`;if(levelNode)levelNode.textContent=`${levels.indexOf(level)+1} · ${level.name}`;if(percentNode)percentNode.textContent=`${percent}% completado · ${totals.done}/${totals.count} actividades`;if(topXp)topXp.textContent=`${totals.xp} XP`;if(topLevel)topLevel.textContent=level.name;if(medal){const unlocked=totals.perfect===totals.count;if(unlocked){medal.classList.add('unlocked');medalText.textContent='¡Lograste el 100 % en todas las actividades!';medalStatus.textContent='DESBLOQUEADA'}else{medal.classList.remove('unlocked');medalText.textContent=`Necesitas el 100 % en las ${totals.count} actividades. Actividades perfectas: ${totals.perfect}/${totals.count}.`;medalStatus.textContent='BLOQUEADA'}}Object.keys(activityConfig).forEach(id=>{const node=document.getElementById(id+'Xp');if(node){const record=savedProgress[id];node.textContent=record?`Mejor resultado: ${record.correct}/${record.total} · ${Math.round(activityConfig[id].max*record.correct/record.total)} XP de ${activityConfig[id].max}`:'Mejor resultado: pendiente'}})}
renderProgress();
const sidebar=document.getElementById('learningSidebar'),scrim=document.getElementById('sidebarScrim'),menu=document.getElementById('menuBtn');if(menu){menu.addEventListener('click',()=>{sidebar.classList.toggle('open');scrim.classList.toggle('show')})}if(scrim)scrim.addEventListener('click',()=>{sidebar.classList.remove('open');scrim.classList.remove('show')});document.querySelectorAll('.module-nav a').forEach(link=>link.addEventListener('click',()=>{document.querySelectorAll('.module-nav a').forEach(item=>item.classList.remove('active'));link.classList.add('active');sidebar.classList.remove('open');scrim.classList.remove('show')}));const sections=[...document.querySelectorAll('main section[id]')];if('IntersectionObserver'in window){const navObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){document.querySelectorAll('.module-nav a').forEach(link=>link.classList.toggle('active',link.getAttribute('href')==='#'+entry.target.id))}}),{rootMargin:'-25% 0px -65% 0px'});sections.forEach(section=>navObserver.observe(section))}document.getElementById('resetProgress').addEventListener('click',()=>{if(confirm('¿Quieres borrar todos los XP, rangos y medallas guardados en este navegador?')){savedProgress={};saveProgress()}});

const menuBtn=document.getElementById('menuBtn'),navlinks=document.getElementById('navlinks');
menuBtn.addEventListener('click',()=>{const open=navlinks.classList.toggle('open');menuBtn.setAttribute('aria-expanded',open)});
navlinks.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{navlinks.classList.remove('open');menuBtn.setAttribute('aria-expanded','false')}));
const backtop=document.getElementById('backtop');window.addEventListener('scroll',()=>backtop.classList.toggle('show',window.scrollY>500));backtop.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
function resetExercises(){
 document.querySelectorAll('.question').forEach(card=>{
  delete card.dataset.done;
  card.querySelectorAll('.option').forEach(option=>{option.disabled=false;option.classList.remove('correct','wrong')});
  card.querySelector('.feedback').textContent='';
 });
}
document.querySelectorAll('.question').forEach(card=>{
 card.querySelectorAll('.option').forEach(btn=>btn.addEventListener('click',()=>{
  if(card.dataset.done)return;card.dataset.done='1';const ok=btn.dataset.value===card.dataset.answer;card.dataset.wasCorrect=ok?'1':'0';
  btn.classList.add(ok?'correct':'wrong');card.querySelectorAll('.option').forEach(o=>{o.disabled=true;if(o.dataset.value===card.dataset.answer)o.classList.add('correct')});
  card.querySelector('.feedback').textContent=(ok?'¡Muy bien! ':'Revisa la idea. ')+card.dataset.explain;const cards=[...document.querySelectorAll('.question')];if(cards.every(item=>item.dataset.done==='1'))registerActivity('exercises',cards.filter(item=>item.dataset.wasCorrect==='1').length,cards.length);
 }));
});
document.getElementById('retryExercises').addEventListener('click',resetExercises);
const pairs=[
 {term:'Sinergia',def:'La interacción genera un resultado conjunto.'},
 {term:'Equifinalidad',def:'Diferentes caminos llegan a un resultado equivalente.'},
 {term:'Recursividad',def:'Un sistema contiene subsistemas y pertenece a otro mayor.'},
 {term:'Retroalimentación',def:'La información de salida ayuda a regular el sistema.'}
];
let selectedTerm=null,matched=new Set(),matchMistakes=0;
function shuffle(arr){const copy=[...arr];for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]];}return copy;}
function renderMatch(){
 selectedTerm=null;matched=new Set();matchMistakes=0;const terms=document.getElementById('matchTerms'),defs=document.getElementById('matchDefs');terms.innerHTML='';defs.innerHTML='';
 shuffle(pairs).forEach(p=>{const b=document.createElement('button');b.className='match-card';b.textContent=p.term;b.dataset.term=p.term;b.addEventListener('click',()=>chooseTerm(b));terms.appendChild(b)});
 shuffle(pairs).forEach(p=>{const b=document.createElement('button');b.className='match-card';b.textContent=p.def;b.dataset.term=p.term;b.addEventListener('click',()=>chooseDef(b));defs.appendChild(b)});
 updateMatchStatus();
}
function chooseTerm(btn){if(btn.classList.contains('matched'))return;document.querySelectorAll('#matchTerms .selected').forEach(x=>x.classList.remove('selected'));selectedTerm=btn.dataset.term;btn.classList.add('selected')}
function chooseDef(btn){if(!selectedTerm||btn.classList.contains('matched'))return;const termBtn=[...document.querySelectorAll('#matchTerms button')].find(b=>b.dataset.term===selectedTerm);if(btn.dataset.term===selectedTerm){btn.classList.add('matched');termBtn.classList.add('matched');termBtn.classList.remove('selected');btn.classList.remove('selected');matched.add(selectedTerm);selectedTerm=null;updateMatchStatus()}else{matchMistakes++;btn.classList.add('selected');document.getElementById('matchStatus').textContent='No coincide. Inténtalo de nuevo.';setTimeout(()=>btn.classList.remove('selected'),500)}}
function updateMatchStatus(){document.getElementById('matchStatus').textContent=matched.size===4?'¡Reto completado! Asociaciones correctas: 4 de 4.':`${matched.size} de 4 parejas correctas.`;if(matched.size===4)registerActivity('match',Math.max(0,4-matchMistakes),4)}
document.getElementById('resetMatch').addEventListener('click',renderMatch);renderMatch();
const memoryPairs=[['TOTALIDAD','El conjunto importa'],['SINERGIA','La interacción suma valor'],['ENTROPÍA','Tendencia al desorden'],['FRONTERA','Delimita el sistema']];
let firstCard=null,lockBoard=false,memoryFound=0,memoryMistakes=0;
function renderMemory(){firstCard=null;lockBoard=false;memoryFound=0;memoryMistakes=0;const board=document.getElementById('memoryBoard');board.innerHTML='';const deck=shuffle(memoryPairs.flatMap((p,i)=>[{id:i,label:p[0]},{id:i,label:p[1]}]));deck.forEach(item=>{const b=document.createElement('button');b.className='memory-card';b.textContent='?';b.dataset.id=item.id;b.dataset.label=item.label;b.addEventListener('click',()=>flipMemory(b));board.appendChild(b)});document.getElementById('memoryStatus').textContent='Parejas encontradas: 0 de 4.'}
function flipMemory(card){if(lockBoard||card.classList.contains('revealed')||card.classList.contains('done'))return;card.classList.add('revealed');card.textContent=card.dataset.label;if(!firstCard){firstCard=card;return}if(firstCard.dataset.id===card.dataset.id){firstCard.classList.add('done');card.classList.add('done');firstCard.classList.remove('revealed');card.classList.remove('revealed');memoryFound++;document.getElementById('memoryStatus').textContent=memoryFound===4?'¡Memorama completado! Encontraste todas las parejas.':`Parejas encontradas: ${memoryFound} de 4.`;if(memoryFound===4)registerActivity('memory',Math.max(0,Math.round(4*4/(4+memoryMistakes))),4);firstCard=null}else{memoryMistakes++;lockBoard=true;const previous=firstCard;setTimeout(()=>{[previous,card].forEach(c=>{c.classList.remove('revealed');c.textContent='?'});firstCard=null;lockBoard=false},850)}}
document.getElementById('resetMemory').addEventListener('click',renderMemory);renderMemory();
const detectiveBank = [
 {scenario:'Una empresa cambia su sistema de atención. Aunque cada área cumple su tarea, los clientes siguen insatisfechos porque las áreas no coordinan sus actividades.',options:['Sinergia','Entropía','Equifinalidad'],answer:0,explain:'La situación muestra falta de coordinación. La sinergia aparece cuando la interacción entre las áreas produce un resultado conjunto mejor.'},
 {scenario:'Dos sedes de una universidad utilizan plataformas distintas para matricular estudiantes, pero ambas logran completar correctamente la matrícula.',options:['Recursividad','Equifinalidad','Frontera'],answer:1,explain:'La equifinalidad permite alcanzar un resultado equivalente mediante caminos o condiciones iniciales diferentes.'},
 {scenario:'Una plataforma recibe reportes de errores, analiza los datos y publica una actualización para corregirlos.',options:['Retroalimentación','Totalidad','Entropía'],answer:0,explain:'Los reportes devuelven información sobre el funcionamiento del sistema y permiten realizar ajustes: eso es retroalimentación.'},
 {scenario:'En una universidad, cada facultad contiene programas académicos y cada programa organiza varios grupos de investigación.',options:['Recursividad','Entropía','Equifinalidad'],answer:0,explain:'La recursividad permite reconocer sistemas dentro de sistemas y distintos niveles de organización.'},
 {scenario:'Una fábrica detecta que sus registros de inventario están desactualizados y que se repiten pedidos innecesarios.',options:['Sinergia','Entropía','Frontera'],answer:1,explain:'La desorganización de la información y de los procesos refleja una tendencia entrópica.'},
 {scenario:'El área de compras, el almacén y producción coordinan sus tareas y logran entregar más rápido que cuando trabajan por separado.',options:['Sinergia','Equifinalidad','Frontera'],answer:0,explain:'La coordinación entre componentes genera un resultado conjunto superior: eso representa sinergia.'},
 {scenario:'Un hospital recibe pacientes, medicamentos e información, los procesa mediante sus servicios y entrega atención médica.',options:['Sistema abierto','Entropía','Recursividad'],answer:0,explain:'El hospital intercambia recursos e información con el entorno, por lo que puede analizarse como un sistema abierto.'},
 {scenario:'Una empresa define qué departamentos hacen parte de su operación y cuáles son proveedores externos.',options:['Frontera','Equifinalidad','Retroalimentación'],answer:0,explain:'La frontera permite delimitar qué elementos pertenecen al sistema y cuáles forman parte del entorno.'},
 {scenario:'Una plataforma compara sus resultados con las metas establecidas y ajusta sus procesos cuando encuentra diferencias.',options:['Retroalimentación','Recursividad','Totalidad'],answer:0,explain:'La información sobre los resultados se utiliza para regular y modificar el funcionamiento del sistema.'},
 {scenario:'Un equipo de trabajo alcanza una meta utilizando una metodología distinta a la de otro equipo que obtuvo el mismo resultado.',options:['Equifinalidad','Entropía','Frontera'],answer:0,explain:'La equifinalidad describe diferentes caminos que conducen a un resultado equivalente.'},
 {scenario:'Una universidad cambia su plataforma virtual y el cambio afecta la comunicación entre estudiantes, docentes y personal administrativo.',options:['Totalidad','Entropía','Frontera'],answer:0,explain:'La totalidad recuerda que los componentes están relacionados: un cambio en una parte puede afectar al conjunto.'},
 {scenario:'Una organización capacita a sus empleados y actualiza sus procedimientos para recuperar la coordinación después de un periodo de desorden.',options:['Neguentropía','Equifinalidad','Frontera'],answer:0,explain:'La incorporación de información, recursos y mecanismos de organización puede contrarrestar la tendencia al desorden.'}
];
let detectiveCases=[],detectiveIndex=0,detectiveScore=0,detectiveAnswered=false;
const detectiveScenario=document.getElementById('detectiveScenario');
const detectiveOptions=document.getElementById('detectiveOptions');
function startDetective(){detectiveCases=shuffle(detectiveBank).slice(0,3);detectiveIndex=0;detectiveScore=0;renderDetective();document.getElementById('detectiveStatus').textContent='Casos resueltos: 0 de 3.';}
function renderDetective(){
 const item=detectiveCases[detectiveIndex];
 document.getElementById('detectiveStep').textContent=`CASO ${detectiveIndex+1} DE 3`;
 detectiveScenario.textContent=item.scenario;
 detectiveOptions.innerHTML='';
 item.options.forEach((label,i)=>{const button=document.createElement('button');button.className='option';button.textContent=label;button.addEventListener('click',()=>answerDetective(i,button));detectiveOptions.appendChild(button);});
 document.getElementById('detectiveFeedback').textContent='';
 const next=document.getElementById('detectiveNext');next.disabled=true;next.textContent=detectiveIndex===2?'Ver resultado':'Siguiente caso →';
 detectiveAnswered=false;
}
function answerDetective(choice,button){
 if(detectiveAnswered)return;detectiveAnswered=true;const item=detectiveCases[detectiveIndex],correct=choice===item.answer;if(correct)detectiveScore++;
 [...detectiveOptions.children].forEach((option,i)=>{option.disabled=true;if(i===item.answer)option.classList.add('correct');else if(i===choice)option.classList.add('wrong');});
 document.getElementById('detectiveFeedback').textContent=(correct?'¡Correcto! ':'No es esa. ')+item.explain;
 document.getElementById('detectiveStatus').textContent=`Casos resueltos: ${detectiveIndex+1} de 3. Aciertos: ${detectiveScore}.`;document.getElementById('detectiveNext').disabled=false;
}
document.getElementById('detectiveNext').addEventListener('click',()=>{
 if(!detectiveAnswered)return;
 if(detectiveIndex<2){detectiveIndex++;renderDetective();}
 else{registerActivity('detective',detectiveScore,3);detectiveScenario.textContent=`Reto terminado: ${detectiveScore} de 3 respuestas correctas.`;detectiveOptions.innerHTML='';document.getElementById('detectiveFeedback').textContent=detectiveScore===3?'¡Excelente análisis sistémico!':'Repasa las explicaciones y vuelve a intentarlo.';document.getElementById('detectiveNext').disabled=true;document.getElementById('detectiveNext').textContent='Partida terminada';}
});
document.getElementById('resetDetective').addEventListener('click',startDetective);
startDetective();
const sequenceStages=['Entradas','Proceso de transformación','Salidas','Retroalimentación'];
let chosenStages=[];
function renderSequence(){
 chosenStages=[];
 const bank=document.getElementById('sequenceBank');
 bank.innerHTML='';
 shuffle(sequenceStages).forEach(stage=>{
  const button=document.createElement('button');
  button.className='sequence-choice';button.textContent=stage;button.dataset.stage=stage;
  button.addEventListener('click',()=>{
   if(chosenStages.includes(stage))return;
   chosenStages.push(stage);button.disabled=true;updateSequence();
  });
  bank.appendChild(button);
 });
 updateSequence();
 document.getElementById('sequenceFeedback').textContent='';
}
function updateSequence(){
 const list=document.getElementById('sequenceChosen');
 list.innerHTML='';
 if(chosenStages.length===0){const li=document.createElement('li');li.className='muted';li.textContent='Aún no has seleccionado etapas.';list.appendChild(li);}
 else chosenStages.forEach(stage=>{const li=document.createElement('li');li.textContent=stage;list.appendChild(li);});
}
document.getElementById('checkSequence').addEventListener('click',()=>{
 const feedback=document.getElementById('sequenceFeedback');
 if(chosenStages.length!==sequenceStages.length){feedback.textContent='Selecciona las cuatro etapas antes de comprobar.';return;}
 const correct=chosenStages.every((stage,i)=>stage===sequenceStages[i]);
 feedback.textContent=correct?'¡Excelente! El flujo está ordenado: entradas → proceso → salidas → retroalimentación.':'Todavía no está en el orden esperado. Reinicia e inténtalo otra vez. Recuerda que la retroalimentación devuelve información al sistema.';registerActivity('sequence',correct?1:0,1);
});
document.getElementById('resetSequence').addEventListener('click',renderSequence);
renderSequence();
const quizBank=[
 {q:'¿Qué estudia principalmente la perspectiva de la TGS?',o:['Elementos aislados sin considerar relaciones','Conjuntos de elementos y sus interacciones','Únicamente sistemas informáticos'],a:1,e:'La TGS analiza totalidades organizadas, relaciones y contexto.'},
 {q:'¿Cuál es un ejemplo de sistema abierto?',o:['Una organización que intercambia información y recursos con su entorno','Un objeto definido sin intercambios con el exterior','Una lista de elementos sin interacción'],a:0,e:'Los sistemas abiertos intercambian materia, energía o información con el entorno.'},
 {q:'¿Qué principio describe diferentes caminos para alcanzar un estado final?',o:['Entropía','Recursividad','Equifinalidad'],a:2,e:'La equifinalidad admite trayectorias distintas hacia resultados equivalentes.'},
 {q:'¿Para qué sirve la retroalimentación?',o:['Para eliminar las fronteras','Para regular el sistema con información de sus resultados','Para impedir todo cambio'],a:1,e:'La retroalimentación permite comparar resultados y ajustar el comportamiento.'},
 {q:'En el caso de la cafetería, ¿qué representa el inventario actualizado?',o:['Una entrada de información que apoya decisiones','El suprasistema de la universidad','La equifinalidad por sí sola'],a:0,e:'Los datos de inventario alimentan procesos y decisiones del sistema.'},
 {q:'¿Qué significa recursividad en la TGS?',o:['Que un sistema puede contener subsistemas y pertenecer a otro sistema mayor','Que todos los sistemas tienen el mismo tamaño','Que un sistema nunca cambia'],a:0,e:'La recursividad permite analizar sistemas en distintos niveles de organización.'},
 {q:'¿Qué describe mejor la sinergia?',o:['La separación de los componentes','El resultado conjunto que surge de la interacción de las partes','La ausencia de comunicación'],a:1,e:'La sinergia aparece cuando la interacción coordinada produce un efecto conjunto.'},
 {q:'¿Qué función cumple la frontera de un sistema?',o:['Delimitar el sistema respecto de su entorno','Eliminar sus entradas','Convertir las salidas en objetivos'],a:0,e:'La frontera establece qué elementos pertenecen al sistema y cuáles al entorno.'},
 {q:'¿Qué puede representar la entropía en una organización?',o:['Mayor coordinación automática','Desorden o pérdida de organización','Una meta alcanzada por diferentes caminos'],a:1,e:'La entropía se relaciona con tendencias al desorden o deterioro de la organización.'},
 {q:'¿Cuál es la secuencia básica de transformación de un sistema?',o:['Salidas, frontera, entradas','Entradas, proceso y salidas','Entorno, equifinalidad y sinergia'],a:1,e:'El sistema recibe entradas, las transforma mediante procesos y genera salidas.'},
 {q:'¿Qué relación existe entre un sistema y su entorno?',o:['Nunca se afectan','El entorno puede influir en el sistema y este puede intercambiar recursos o información','El entorno siempre forma parte interna del sistema'],a:1,e:'Los sistemas abiertos mantienen intercambios e interacciones con su entorno.'},
 {q:'¿Qué puede ayudar a contrarrestar la tendencia entrópica?',o:['Ignorar los resultados','Eliminar toda comunicación','Incorporar información, energía y mecanismos de regulación'],a:2,e:'La información y los mecanismos de organización pueden ayudar a mantener el orden del sistema.'}
];
let quiz=[],qIndex=0,answers=[];
const qQuestion=document.getElementById('quizQuestion'),qOptions=document.getElementById('quizOptions');
function startQuiz(){quiz=shuffle(quizBank).slice(0,5);qIndex=0;answers=Array(quiz.length).fill(null);document.getElementById('quizArea').hidden=false;document.querySelector('.quiz-controls').hidden=false;renderQuiz();}
function renderQuiz(){
 document.getElementById('quizCounter').textContent=`Pregunta ${qIndex+1} de ${quiz.length}`;
 document.getElementById('quizScoreLive').textContent=`Respuestas: ${answers.filter(x=>x!==null).length}/${quiz.length}`;
 document.getElementById('quizProgress').style.width=`${(qIndex+1)/quiz.length*100}%`;
 qQuestion.textContent=quiz[qIndex].q;qOptions.innerHTML='';
 quiz[qIndex].o.forEach((option,i)=>{const b=document.createElement('button');b.className='quiz-option'+(answers[qIndex]===i?' selected':'');b.textContent=option;b.addEventListener('click',()=>{answers[qIndex]=i;renderQuiz();});qOptions.appendChild(b);});
 document.getElementById('nextQuiz').textContent=qIndex===quiz.length-1?'Ver resultado':'Siguiente →';document.getElementById('quizResult').hidden=true;
}
document.getElementById('nextQuiz').addEventListener('click',()=>{if(answers[qIndex]===null){qQuestion.textContent='Selecciona una opción para continuar.';return;}if(qIndex<quiz.length-1){qIndex++;renderQuiz();}else{showResult();}});
function showResult(){
 const score=answers.reduce((n,a,i)=>n+(a===quiz[i].a?1:0),0),result=document.getElementById('quizResult');registerActivity('quiz',score,5);
 result.hidden=false;result.innerHTML=`<h3>Resultado: ${score} de ${quiz.length} (${Math.round(score/quiz.length*100)}%)</h3><p>${score===5?'¡Excelente dominio de los conceptos!':score>=3?'Buen avance. Revisa las explicaciones para consolidar lo aprendido.':'Vuelve a explorar los conceptos y realiza el intento nuevamente.'}</p><ol>${quiz.map((q,i)=>`<li style="margin:10px 0"><strong>${q.q}</strong><br>${answers[i]===q.a?'✓ Correcto':'✗ Respuesta correcta: '+q.o[q.a]}<br><span class="quiz-explanation">${q.e}</span></li>`).join('')}</ol><button class="btn" id="retryQuiz">Intentar de nuevo</button>`;
 document.getElementById('retryQuiz').addEventListener('click',startQuiz);document.getElementById('quizArea').hidden=true;document.querySelector('.quiz-controls').hidden=true;
}
startQuiz();

const pageIds=['inicio','contexto','conceptos','clasificacion','caso','practica','juegos','videos','evaluacion','creditos'];
let currentPage=0;
const pageSections=pageIds.map(id=>document.getElementById(id)).filter(Boolean);
const pageLinks=[...document.querySelectorAll('.module-nav a, .navlinks a, .brand[href]')];
const pagePrev=document.getElementById('pagePrev');
const pageNext=document.getElementById('pageNext');
const pageIndicator=document.getElementById('pageIndicator');
function showPage(id,updateHash=true){
 const index=pageIds.indexOf(id);
 if(index<0)return;
 currentPage=index;
 pageSections.forEach(section=>section.classList.toggle('active-page',section.id===id));
 pageLinks.forEach(link=>link.classList.toggle('active',link.getAttribute('href')==='#'+id));
 if(pagePrev)pagePrev.disabled=index===0;
 if(pageNext)pageNext.disabled=index===pageIds.length-1;
 if(pageIndicator)pageIndicator.textContent=`Página ${index+1} de ${pageIds.length}`;
 if(updateHash&&location.hash!=='#'+id)history.replaceState(null,'','#'+id);
 window.scrollTo({top:0,behavior:'instant'});
 const sidebar=document.getElementById('learningSidebar');
 const scrim=document.getElementById('sidebarScrim');
 if(sidebar)sidebar.classList.remove('open');
 if(scrim)scrim.classList.remove('show');
}
document.querySelectorAll('a[href^="#"]').forEach(link=>link.addEventListener('click',event=>{
 const href=link.getAttribute('href')||'';
 const target=href.slice(1);
 if(pageIds.includes(target)){event.preventDefault();showPage(target)}
}));
if(pagePrev)pagePrev.addEventListener('click',()=>showPage(pageIds[Math.max(0,currentPage-1)]));
if(pageNext)pageNext.addEventListener('click',()=>showPage(pageIds[Math.min(pageIds.length-1,currentPage+1)]));
const initialId=pageIds.includes(location.hash.slice(1))?location.hash.slice(1):'inicio';
showPage(initialId,false);

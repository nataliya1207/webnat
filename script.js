const nav = document.getElementById('main-nav');
const menuToggle = document.querySelector('.menu-toggle');
menuToggle?.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
});
nav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
  menuToggle.setAttribute('aria-label', 'Открыть меню');
}));
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if ('IntersectionObserver' in window && !reduceMotion) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {if(entry.isIntersecting) {entry.target.classList.add('in-view');observer.unobserve(entry.target)}});
  }, { threshold: 0.07, rootMargin: '0px 0px -20px 0px' });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
} else document.querySelectorAll('.reveal').forEach(el => el.classList.add('in-view'));
const hint = document.getElementById('tech-hint');
const chips = document.querySelectorAll('.tech-chip');
const initialHint = hint.textContent;
chips.forEach(chip => {
  const activate = () => {
    chips.forEach(c => c.classList.toggle('active', c === chip));
    hint.textContent = chip.dataset.info;
  };
  chip.addEventListener('mouseenter', activate);
  chip.addEventListener('focus', activate);
  chip.addEventListener('click', activate);
});
document.querySelector('.tech-grid')?.addEventListener('mouseleave', () => {
  chips.forEach(c => c.classList.remove('active'));
  hint.textContent = initialHint;
});

const dialog = document.getElementById('site-modal');
const modalTitle = document.getElementById('modal-title');
const modalDesc = document.getElementById('modal-description');
const modalEyebrow = document.getElementById('modal-eyebrow');
const extra = document.getElementById('modal-extra');
const form = document.getElementById('project-form');
const detailsActions = document.getElementById('modal-details-actions');
const serviceSelect = document.getElementById('request-service');
const formResult = document.getElementById('form-result');
let selectedTopic = '';
let returnFocus = null;
const serviceDetails = {
  'Создание сайтов':['Анализ структуры и задач','Адаптивный дизайн','Разработка и проверка перед запуском'],
  'Доработка сайтов':['Поиск причин ошибок','Реализация нового функционала','Проверка изменений на сайте'],
  'Редизайн':['Аудит текущей версии','Новая визуальная система','Адаптация страниц и блоков'],
  'WordPress':['Собственные темы и ACF','Настройка WooCommerce','Оптимизация и техническая поддержка'],
  '1С-Битрикс':['Настройка компонентов','Доработка каталога и интеграций','Исправление технических ошибок'],
  'SEO и контент':['Структура коммерческих страниц','Метатеги и оптимизация контента','Технические SEO-доработки'],
  'Техническая поддержка':['Обновления и резервные копии','Мониторинг ошибок','Плановые доработки']
};
function showModal(mode, topic='') {
  selectedTopic = topic;
  form.reset();
  formResult.textContent='';
  extra.hidden=true;
  extra.replaceChildren();
  const isDetail=mode==='service'||mode==='project'||mode==='portfolio';
  form.hidden=isDetail;
  detailsActions.hidden=!isDetail;
  if(mode==='portfolio'){
    modalEyebrow.textContent='Портфолио WebNat';
    modalTitle.textContent='Все проекты';
    modalDesc.textContent='Демонстрационные концепции для разных направлений бизнеса.';
    const gallery=document.createElement('div');gallery.className='modal-portfolio';
    document.querySelectorAll('.project-card').forEach(card=>{
      const item=document.createElement('article');
      const image=card.querySelector('img').cloneNode();image.removeAttribute('loading');
      const copy=document.createElement('div');
      const title=document.createElement('h3');title.textContent=card.querySelector('h3').textContent;
      const desc=document.createElement('p');desc.textContent=card.querySelector('.project-text>p').textContent;
      copy.append(title,desc);item.append(image,copy);gallery.append(item);
    });
    extra.append(gallery);extra.hidden=false;
  }else if(mode==='service'){
    modalEyebrow.textContent='WEBNAT / УСЛУГА';
    modalTitle.textContent=topic;
    modalDesc.textContent='Что может входить в работу по этому направлению:';
    const list=document.createElement('ul');
    (serviceDetails[topic]||['Разбор задачи','Предложение решения','Оценка сроков и стоимости']).forEach(line=>{const li=document.createElement('li');li.textContent=line;list.append(li)});
    extra.append(list);
    extra.hidden=false;
  }else if(mode==='project'){
    modalEyebrow.textContent='WEBNAT / КОНЦЕПЦИЯ';
    modalTitle.textContent=topic;
    modalDesc.textContent='Демонстрационная визуальная концепция. Это пример направления, а не подтверждённый коммерческий кейс.';
    const card=Array.from(document.querySelectorAll('.project-card')).find(card=>card.querySelector('h3').textContent.trim()===topic);
    if(card){const image=card.querySelector('img').cloneNode();image.className='modal-project-image';image.removeAttribute('loading');extra.append(image)}
    const p=document.createElement('p');p.textContent='Можем обсудить сайт с похожей структурой, дизайном и функциональностью для вашего бизнеса.';extra.append(p);extra.hidden=false;
  }else{
    modalEyebrow.textContent='WEBNAT / СВЯЗАТЬСЯ';
    modalTitle.textContent='Давайте обсудим ваш проект';
    modalDesc.textContent='Опишите задачу, чтобы подготовить предметное предложение.';
    serviceSelect.value=Array.from(serviceSelect.options).some(x=>x.value===topic)?topic:'';
  }
  if(!dialog.open){dialog.showModal();document.body.classList.add('modal-open')}
  if(!isDetail)form.querySelector('input')?.focus();
  else document.getElementById('modal-close').focus();
}
function closeModal(){if(dialog.open)dialog.close()}
dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');returnFocus?.focus?.({preventScroll:true});returnFocus=null});
dialog.addEventListener('click',event=>{if(event.target===dialog)closeModal()});
document.getElementById('modal-close').addEventListener('click',closeModal);
document.querySelector('.modal-cancel').addEventListener('click',closeModal);
document.getElementById('modal-request-from-detail').addEventListener('click',()=>showModal('request',selectedTopic));
document.addEventListener('click',event=>{
  const el=event.target.closest('[data-modal]');
  if(!el)return;
  event.preventDefault();
  returnFocus=el;
  let topic='';let mode=el.dataset.modal;
  if(mode==='service')topic=el.dataset.topic || el.closest('.service-card')?.querySelector('h3')?.textContent?.trim() || 'Техническая поддержка';
  if(mode==='project')topic=el.closest('.project-card')?.querySelector('h3')?.textContent?.trim() || 'Демопроект';
  if(mode==='request')topic=el.closest('.price-card')?`Тариф «${el.closest('.price-card').querySelector('h3').textContent.trim()}»`:'';
  showModal(mode,topic);
});
form.addEventListener('submit',async event=>{
  event.preventDefault();
  if(!form.reportValidity())return;
  const data=new FormData(form);
  const body=['Заявка WebNat (черновик)',`Имя: ${data.get('name')}`,`Контакт: ${data.get('contact')}`,`Услуга: ${data.get('service')||'Не выбрана'}`,`Задача: ${data.get('message')}`].join('\n');
  try{await navigator.clipboard.writeText(body);formResult.textContent='Текст заявки скопирован. Отправка на сервер пока не подключена.'}
  catch{formResult.textContent='Браузер не разрешил копирование. Вы можете выделить и скопировать данные вручную.'}
});

const year=document.getElementById('copyright-year');
if(year)year.textContent=String(new Date().getFullYear());

// Animate the stage connector only while this block is in view.
const processSection=document.querySelector('.process');
if(processSection && 'IntersectionObserver' in window && !reduceMotion){
  const lineObserver=new IntersectionObserver(entries=>entries.forEach(entry=>entry.target.classList.toggle('is-visible',entry.isIntersecting)),{threshold:.12});
  lineObserver.observe(processSection);
}

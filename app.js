const tela = document.getElementById("tela");

function desenhar(html) {
  tela.innerHTML = html;
}

function noIphone() {
  return /iPhone|iPad|iPod/.test(navigator.userAgent);
}

function instalado() {
  return window.navigator.standalone === true || window.matchMedia("(display-mode: standalone)").matches;
}

function passos() {
  desenhar(`
    <h1>Jarvis</h1>
    <ol>
      <li><span>1</span>Toca em Compartilhar, o quadrado com a seta.</li>
      <li><span>2</span>Toca em Adicionar à Tela de Início.</li>
      <li><span>3</span>Abre o ícone Jarvis na tela inicial.</li>
    </ol>
  `);
}

function pedir() {
  desenhar(`
    <h1>Jarvis</h1>
    <p>Um toque. O aviso passa a aparecer na tela do iPhone.</p>
    <p>O iPhone precisa estar no Wi-Fi de casa.</p>
    <button id="ativar" type="button">Ativar avisos</button>
  `);
  document.getElementById("ativar").onclick = ativar;
}

function falha(msg) {
  desenhar(`
    <h1>Jarvis</h1>
    <p class="erro">${msg}</p>
    <button id="ativar" type="button">Tentar de novo</button>
  `);
  document.getElementById("ativar").onclick = ativar;
}

function chave(base64) {
  const pad = "=".repeat((4 - (base64.length % 4)) % 4);
  const normal = (base64 + pad).replace(/-/g, "+").replace(/_/g, "/");
  const cru = atob(normal);
  const saida = new Uint8Array(cru.length);
  for (let i = 0; i < cru.length; i += 1) saida[i] = cru.charCodeAt(i);
  return saida;
}

async function ativar() {
  const botao = document.getElementById("ativar");
  if (botao) botao.disabled = true;
  try {
    const reg = await navigator.serviceWorker.register("sw.js");
    await navigator.serviceWorker.ready;
    let sub = await reg.pushManager.getSubscription();
    if (!sub) {
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: chave(window.JARVIS_PUBLIC),
      });
    }
    const dados = encodeURIComponent(JSON.stringify(sub.toJSON()));
    location.assign(`${window.JARVIS_PC}?d=${dados}`);
  } catch (err) {
    falha("O iPhone não deixou avisar. Em Ajustes, Notificações, Jarvis, liga Permitir.");
  }
}

function iniciar() {
  if (!window.JARVIS_PUBLIC || !window.JARVIS_PC) {
    desenhar("<h1>Jarvis</h1><p>App incompleto.</p>");
    return;
  }
  if (noIphone() && !instalado()) {
    passos();
    return;
  }
  if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
    passos();
    return;
  }
  pedir();
}

iniciar();

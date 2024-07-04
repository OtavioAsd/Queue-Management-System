const standardRequestButton = document.getElementById("standard-button");
const preferentialRequestButton = document.getElementById(
  "preferential-button"
);
const windowSpan = document.getElementById("window");
const ticketSpan = document.getElementById("ticket");
const valueSpan = document.getElementById("value");
const queueSound = document.getElementById("queue-audio");

let standard = 0; // Quantidade dos chamados normais
let preferential = 0; // Quantidade dos chamados preferenciais

const standardQueue = []; // Array da fila dos chamados normais
const prefQueue = []; // Fila dos chamados preferenciais

let callPreferential = true; // Variável para alternar chamadas preferenciais e normais

let lastCalled = {
  nowServing: null,
  index: null,
  type: null,
  repeatCount: 0,
}; // Armazena a última senha chamada e a contagem de repetições



// Evento Ouvinte que adiciona senha normal
standardRequestButton.addEventListener("click", function () {
  standardQueue.push(standard++);
});

// Evento Ouvinte que adiciona senha preferencial
preferentialRequestButton.addEventListener("click", function () {
  prefQueue.push(preferential++);
});

// Função para exibir a senha do guichê no painel
const panelDisplay = (nowServing, index, type) => {
  windowSpan.innerText = `GUICHÊ: G0${index + 1}`;
  ticketSpan.innerText = `Senha: 00${nowServing + 1}`;
  valueSpan.innerText = `${type}`;

  if (nowServing >= 9) {
    ticketSpan.innerText = `Senha: 0${nowServing + 1}`;
  } else if (nowServing >= 99) {
    ticketSpan.innerText = `Senha: ${nowServing + 1}`;
  }
  panelInteraction();
};

// Função para alterar cor e adicionar som ao painel
const panelInteraction = () => {
  queueSound.play();
  queueSound.currentTime = 0;
  windowSpan.style.color = "#a50000";
  ticketSpan.style.color = "#a50000";
  valueSpan.style.color = "#a50000";
};

// Função que retorna para cor padrão
const defaultPanelColor = () => {
  windowSpan.style.color = "#6e0000";
  ticketSpan.style.color = "#6e0000";
  valueSpan.style.color = "#6e0000";
};

// Evento ouvinte para os botões de guichê
document.querySelectorAll(".next-ticket").forEach((button, index) => {
  // Evento ouvinte para determinar a sequência lógica das senhas
  button.addEventListener("click", function () {
    let nowServing = null;
    let type = "";

    if (callPreferential) {
      if (prefQueue.length > 0) {
        nowServing = prefQueue.shift();
        type = "Preferencial";
      } else if (standardQueue.length > 0) {
        nowServing = standardQueue.shift();
        type = "Normal";
      } else {
        alert("Não há senhas na fila");
        defaultPanelColor();
        return;
      }
    } else {
      if (standardQueue.length > 0) {
        nowServing = standardQueue.shift();
        type = "Normal";
      } else if (prefQueue.length > 0) {
        nowServing = prefQueue.shift();
        type = "Preferencial";
      } else {
        alert("Não há senhas na fila");
        defaultPanelColor();
        return;
      }
    }

    // Atualiza a última senha chamada e reseta a contagem de repetições
    lastCalled = { nowServing, index, type, repeatCount: 0 };

    // Exibe a senha chamada
    panelDisplay(nowServing, index, type);

    // Alterna a variável para a próxima chamada
    callPreferential = !callPreferential;
  });
});

// Evento ouvinte para os botões de repetição
document.querySelectorAll(".repeat-ticket").forEach((repeatButton) => {
  repeatButton.addEventListener("click", function () {
    if (lastCalled.nowServing !== null) {
      if (lastCalled.repeatCount < 2) {
        // Incrementa a contagem de repetições
        lastCalled.repeatCount++;

        // Repete a última senha chamada
        panelDisplay(
          lastCalled.nowServing,
          lastCalled.index,
          lastCalled.type + `- REPETINDO`
        );
      } else {
        alert("Não há senhas na fila")
        defaultPanelColor();
      }
    } else {
      alert("Não há senhas na fila")
      defaultPanelColor();
    }
  });
});

// Aguarda o carregamento completo do DOM
document.addEventListener("DOMContentLoaded", () => {
  iniciarFuncoesTemporais();
  configurarAcessibilidade();
  configurarCarrinho();
  configurarBotoesAgendamento();
  configurarFormularioAgendamento();
});

/**
 * Funções temporais: atualiza data/hora ao vivo, status da loja e
 * define a data mínima do calendário para não permitir datas passadas.
 */
function iniciarFuncoesTemporais() {
  const statusTemporal = document.getElementById("status-temporal");
  const inputData = document.getElementById("data-agendamento");

  function atualizarRelogioEStatus() {
    const agora = new Date();
    const dataFormatada = agora.toLocaleDateString("pt-BR");
    const horaFormatada = agora.toLocaleTimeString("pt-BR");

    // Loja aberta de segunda a sábado das 08:00 às 18:00
    const diaSemana = agora.getDay();
    const horaAtual = agora.getHours();
    const lojaAberta =
      diaSemana >= 1 && diaSemana <= 6 && horaAtual >= 8 && horaAtual < 18;
    const statusTexto = lojaAberta
      ? "Atendimento aberto"
      : "Atendimento fechado no momento";

    if (statusTemporal) {
      statusTemporal.textContent = `${dataFormatada} - ${horaFormatada} - ${statusTexto}`;
    }
  }

  if (inputData) {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = String(hoje.getMonth() + 1).padStart(2, "0");
    const dia = String(hoje.getDate()).padStart(2, "0");
    inputData.min = `${ano}-${mes}-${dia}`;
  }

  atualizarRelogioEStatus();
  setInterval(atualizarRelogioEStatus, 1000);
}

/**
 * Acessibilidade: alterna o modo de alto contraste para deficientes visuais.
 */
function configurarAcessibilidade() {
  const btnContraste = document.getElementById("btn-alto-contraste");
  if (!btnContraste) return;

  btnContraste.addEventListener("click", () => {
    const ativado = document.body.classList.toggle("alto-contraste");
    btnContraste.setAttribute("aria-pressed", String(ativado));
    btnContraste.textContent = ativado ? "Contraste Normal" : "Alto Contraste";
  });
}

/**
 * Carrinho de compras dinâmico com atualização de contador e resumo no modal.
 */
function configurarCarrinho() {
  const contadorEl = document.getElementById("contador-carrinho");
  const conteudoCarrinho = document.getElementById("conteudo-carrinho");
  const btnLimpar = document.getElementById("btn-limpar-carrinho");
  const botoesAdd = document.querySelectorAll(".btn-add-carrinho");

  let carrinho = [];

  function renderizarCarrinho() {
    if (contadorEl) {
      contadorEl.textContent = String(carrinho.length);
    }

    if (!conteudoCarrinho) return;

    if (carrinho.length === 0) {
      conteudoCarrinho.innerHTML = "<p>Seu carrinho está vazio no momento.</p>";
      return;
    }

    let total = 0;
    const itensHtml = carrinho
      .map((item) => {
        total += item.preco;
        return `<li class="list-group-item d-flex justify-content-between align-items-center">
                    <span>${item.nome}</span>
                    <strong>R$ ${item.preco.toFixed(2).replace(".", ",")}</strong>
                </li>`;
      })
      .join("");

    conteudoCarrinho.innerHTML = `
            <ul class="list-group mb-3">${itensHtml}</ul>
            <p class="mb-0"><strong>Total estimado: R$ ${total.toFixed(2).replace(".", ",")}</strong></p>
        `;
  }

  botoesAdd.forEach((botao) => {
    botao.addEventListener("click", () => {
      const nome = botao.dataset.nome || "Produto";
      const preco = parseFloat(botao.dataset.preco || "0");
      carrinho.push({ nome, preco });
      renderizarCarrinho();
    });
  });

  if (btnLimpar) {
    btnLimpar.addEventListener("click", () => {
      carrinho = [];
      renderizarCarrinho();
    });
  }
}

/**
 * Integração dos botões de serviço: rola até o formulário e marca a modalidade.
 */
function configurarBotoesAgendamento() {
  const botoesServico = document.querySelectorAll(".btn-ir-agendamento");
  const radioLocal = document.getElementById("mod-local");
  const radioTelebusca = document.getElementById("mod-telebusca");
  const secaoAgendamento = document.getElementById("agendamento");

  botoesServico.forEach((botao) => {
    botao.addEventListener("click", () => {
      const modalidade = botao.dataset.modalidade;
      if (modalidade === "tele-busca" && radioTelebusca) {
        radioTelebusca.checked = true;
      } else if (modalidade === "local" && radioLocal) {
        radioLocal.checked = true;
      }

      if (secaoAgendamento) {
        secaoAgendamento.scrollIntoView({ behavior: "smooth" });
      }
    });
  });
}

/**
 * Validação e exibição do resumo do cadastro e agendamento.
 */
function configurarFormularioAgendamento() {
  const form = document.getElementById("form-agendamento");
  const erroServico = document.getElementById("erro-servico");
  const resultadoBox = document.getElementById("resultado-agendamento");

  if (!form || !resultadoBox) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const servicosSelecionados = Array.from(
      form.querySelectorAll(".servico-check:checked"),
    ).map((el) => el.value);

    if (servicosSelecionados.length === 0) {
      if (erroServico) erroServico.classList.remove("d-none");
      return;
    }

    if (erroServico) erroServico.classList.add("d-none");

    const dados = new FormData(form);
    const clienteNome = dados.get("clienteNome");
    const clienteCpf = dados.get("clienteCpf");
    const clienteSexo = dados.get("sexo");
    const clienteTelefone = dados.get("clienteTelefone");
    const clienteEmail = dados.get("clienteEmail");
    const clienteEndereco = dados.get("clienteEndereco");
    const petNome = dados.get("petNome");
    const petRaca = dados.get("petRaca");
    const petIdade = dados.get("petIdade");
    const modalidade = dados.get("modalidade");
    const dataAgendamento = dados.get("dataAgendamento");
    const horaAgendamento = dados.get("horaAgendamento");
    const observacoes = dados.get("observacoes") || "Nenhuma";

    // Formata data AAAA-MM-DD para DD/MM/AAAA
    const partesData = String(dataAgendamento).split("-");
    const dataBR =
      partesData.length === 3
        ? `${partesData[2]}/${partesData[1]}/${partesData[0]}`
        : dataAgendamento;

    resultadoBox.className = "mt-4 alert alert-success";
    resultadoBox.innerHTML = `
            <h3 class="h5 alert-heading">Agendamento Registrado com Sucesso!</h3>
            <p class="mb-1"><strong>Cliente:</strong> ${clienteNome} (CPF: ${clienteCpf} | Sexo: ${clienteSexo})</p>
            <p class="mb-1"><strong>Contato e Endereço:</strong> ${clienteTelefone} | ${clienteEmail} - ${clienteEndereco}</p>
            <p class="mb-1"><strong>Pet:</strong> ${petNome} - Raça: ${petRaca}, ${petIdade} ano(s)</p>
            <p class="mb-1"><strong>Serviços:</strong> ${servicosSelecionados.join(" e ")} | <strong>Modalidade:</strong> ${modalidade}</p>
            <p class="mb-1"><strong>Data e Horário:</strong> ${dataBR} às ${horaAgendamento}</p>
            <p class="mb-0"><strong>Observações:</strong> ${observacoes}</p>
        `;
    resultadoBox.classList.remove("d-none");
  });
}

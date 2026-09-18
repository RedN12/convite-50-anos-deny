// ========================================
// CONTROLE INICIAL DA PÁGINA
// ========================================

history.scrollRestoration = "manual";

window.addEventListener("load", function () {

    // Remove qualquer seção salva na URL
    history.replaceState(null, "", window.location.pathname);

    // Sempre começa no topo
    window.scrollTo(0, 0);

    // Enquanto o arquivo estiver fechado,
    // a página não pode ser rolada
    document.body.classList.add("arquivo-bloqueado");

    document.documentElement.classList.add("arquivo-bloqueado");

});

// ========================================
// ABERTURA DO ARQUIVO
// ========================================

const botaoAbrir = document.getElementById("botaoAbrir");
const dossie = document.querySelector(".dossie");
const secaoArquivo = document.querySelector(".secao-arquivo");
const proximaSecao = document.getElementById("alvo");

botaoAbrir.addEventListener("click", function () {

    // Fecha o dossiê
    dossie.classList.add("aberto");

    // Faz o botão desaparecer
    secaoArquivo.classList.add("aberta");

    // Aguarda a animação terminar
    setTimeout(function () {

        // Remove a primeira tela
        secaoArquivo.classList.add("encerrada");

        // Libera a rolagem
        document.body.classList.remove("arquivo-bloqueado");

        // Libera a rolagem 2 já q tava rolando
        document.documentElement.classList.remove("arquivo-bloqueado");

        // Mostra a próxima seção
        proximaSecao.scrollIntoView();

    }, 900);

});

// ========================================
// ADICIONAR CONVIDADOS
// ========================================

const botaoAdicionar = document.getElementById("adicionarConvidado");
const listaConvidados = document.getElementById("listaConvidados");

let numeroConvidado = 1;

botaoAdicionar.addEventListener("click", function () {

    numeroConvidado++;

    const novoConvidado = document.createElement("div");

    novoConvidado.classList.add("convidado");

    novoConvidado.innerHTML = `
        <div class="cabecalho-convidado">
            <h3>CONVIDADO ${String(numeroConvidado).padStart(2, "0")}</h3>
            <button type="button" class="remover-convidado">×</button>
        </div>

        <label>Nome completo</label>
        <input type="text" name="nome" required>

        <label>CPF ou RG</label>
        <input type="text" name="documento" required>
    `;

    listaConvidados.appendChild(novoConvidado);

    const botaoRemover = novoConvidado.querySelector(".remover-convidado");

    botaoRemover.addEventListener("click", function () {
        novoConvidado.remove();

        const convidados = listaConvidados.querySelectorAll(".convidado");

        convidados.forEach(function (convidado, indice) {
            const numero = indice + 2;

            convidado.querySelector("h3").textContent =
                `CONVIDADO ${String(numero).padStart(2, "0")}`;
        });
    });

});

// ========================================
// MENU LATERAL
// ========================================

const botaoMenu = document.getElementById("botaoMenu");
const menuLateral = document.getElementById("menuLateral");
const fecharMenu = document.getElementById("fecharMenu");
const linksMenu = document.querySelectorAll(".menu-lateral a");


// ABRIR / FECHAR MENU

botaoMenu.addEventListener("click", function () {

    menuLateral.classList.toggle("menu-aberto");

});


// BOTÃO X

fecharMenu.addEventListener("click", function () {

    menuLateral.classList.remove("menu-aberto");

});


// FECHAR O MENU AO CLICAR EM UMA SEÇÃO

linksMenu.forEach(function (link) {

    link.addEventListener("click", function () {

        menuLateral.classList.remove("menu-aberto");

    });

});

// ========================================
// SWIPE DO MENU
// ========================================

let inicioToqueX = 0;
let inicioToqueY = 0;

document.addEventListener("touchstart", function (evento) {

    inicioToqueX = evento.touches[0].clientX;
    inicioToqueY = evento.touches[0].clientY;

});


document.addEventListener("touchend", function (evento) {

    const fimToqueX = evento.changedTouches[0].clientX;
    const fimToqueY = evento.changedTouches[0].clientY;

    const diferencaX = fimToqueX - inicioToqueX;
    const diferencaY = fimToqueY - inicioToqueY;

    // Ignora movimentos principalmente verticais
    if (Math.abs(diferencaX) < Math.abs(diferencaY)) {
        return;
    }

    // Ignora movimentos muito pequenos
    if (Math.abs(diferencaX) < 60) {
        return;
    }


    // ========================================
    // ABRIR MENU
    // Deslizando da direita para a esquerda
    // ========================================

    if (
        diferencaX < 0 &&
        inicioToqueX > window.innerWidth - 40 &&
        !menuLateral.classList.contains("menu-aberto")
    ) {

        menuLateral.classList.add("menu-aberto");

    }


    // ========================================
    // FECHAR MENU
    // Deslizando da esquerda para a direita
    // ========================================

    if (
        diferencaX > 0 &&
        menuLateral.classList.contains("menu-aberto")
    ) {

        menuLateral.classList.remove("menu-aberto");

    }

});

// ========================================
// FORMULÁRIO DE CONFIRMAÇÃO
// ========================================

const formularioConfirmacao = document.getElementById("formularioConfirmacao");
const mensagemSucesso = document.getElementById("mensagemSucesso");

formularioConfirmacao.addEventListener("submit", function (evento) {
    evento.preventDefault();

    const botaoConfirmar = document.querySelector(".botao-confirmar");

    botaoConfirmar.textContent = "CONFIRMANDO...";
    botaoConfirmar.disabled = true;

    const convidados = document.querySelectorAll(".convidado");

    const lista = [];

    convidados.forEach(function (convidado) {
        const nome = convidado.querySelector('input[name="nome"]').value;
        const documento = convidado.querySelector('input[name="documento"]').value;

        lista.push({
            nome: nome,
            documento: documento
        });
    });

    fetch("https://script.google.com/macros/s/AKfycbybkxFYcqwtQZ3Fvr1mzz5H5kzCYpep5ZSupbGN3CDtoZ_Au-1ZiOEu1VRCH-6iHvGV/exec", {
        method: "POST",
        body: JSON.stringify({
            convidados: lista
        })
    })
    .then(function (resposta) {
        return resposta.json();
    })
    .then(function (resultado) {
        if (resultado.sucesso) {
            formularioConfirmacao.style.display = "none";
            mensagemSucesso.style.display = "block";
        } else {
            throw new Error("O servidor não confirmou o envio.");
        }
    })
    .catch(function (erro) {
        console.error("Erro ao enviar confirmação:", erro);

        botaoConfirmar.textContent = "CONFIRMAR PRESENÇA";
        botaoConfirmar.disabled = false;

        alert("Não foi possível enviar a confirmação. Tente novamente.");
    });
});
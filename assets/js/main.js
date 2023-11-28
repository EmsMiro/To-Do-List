// criando array para armazenar as tarefas
let tasks = [];

// criando array para armazenar as tarefas que forem deletadas
let deletedTasks = [];

// mostra o array das tarefas deletadas
console.log(deletedTasks);

// Função para criar a tarefa
function addTask() {
   //prevenir o comportamento padrão de envio do formulário
   event.preventDefault();

  // capturando os valores dos inputs
  const title = document.querySelector("#input-title").value;
  const description = document.querySelector("#input-description").value;

  // validando os campos de input para que o usuário não envie espaços em branco ou tarefas sem título/descrição
  if(!title.trim() || !description.trim()) {
    alert("Por favor preencha o título e a descrição da tarefa")
    return;
  } 

  // Verificando se o título contém apenas números ou menos de 5 caracteres
  if (/^\d+$/.test(title) || title.length < 5) {
    alert("O título deve conter pelo menos 5 caracteres e não pode consistir apenas em números.");
    return;
  }

  // Verificando se a descrição contém apenas números ou menos de 5 caracteres
  if (/^\d+$/.test(description) || description.length < 5) {
    alert("A descrição deve conter pelo menos 5 caracteres e não pode consistir apenas em números.");
    return;
  }

  // verifica se já existe uma tarefa com o mesmo título
  if (tasks.some(task => task.titulo === title)) {
    alert("Já existe uma tarefa com o mesmo título. Escolha um título único.");
    return;
  }

  // verifica se já existe uma tarefa com a mesma descrição
  if (tasks.some(task => task.descricao === description)) {
    alert("Já existe uma tarefa com a mesma descrição. Escolha uma descrição única.");
    return;
  }
  
  // criando objeto com id único para cada tarefa
  const task = {
    id: new Date().getTime(),
    titulo: title,
    descricao: description,
  };

  // adicionando a tarefa criada ao array tasks
  tasks.push(task);

  // limpando os campos de input
  document.querySelector("#input-title").value = "";
  document.querySelector("#input-description").value = "";

  //exibe o array de tarefas
  console.log(tasks);

  // chamando a função que cria a div e mostra na tela para o user
  showTask(task);

  // adicionando um escutador de eventos ao formulário
  const formCreateTask = document.querySelector("form");
  formCreateTask.addEventListener("submit", addTask);
}

// Adicionando um escutador de eventos ao botão criar e chamando a função addTask
const buttonCreateTask = document.querySelector("#create-task-button");
buttonCreateTask.addEventListener("click", addTask);

// Array de cores aleatórias para o background da div de cada tarefa
const colorsPreset = [
  "#53c2c5",
  "#fec347",
  "#f26e56",
  "#b8e28a",
  "#8e65a5",
  "#dc6378",
  "#bf9692",
  "#8ac7de",
  "#6da67a",
  "#f1efa5",
  "#fe9c6b",
  "#6743a5"
];

// Função para escolher uma cor aleatória para o background da div de cada tarefa
function setRandomColor() {
  const randomColor = Math.floor(Math.random() * colorsPreset.length);
  return colorsPreset[randomColor];
}

// Função para criar dinâmicamente os elementos da div e mostrar na tela
function showTask(task) {
  //selecionado a section(HTML) das tasks
  const taskListDiv = document.querySelector("#task-list");

  //criando a div dinâmicamente para cada tarefa
  const taskDiv = document.createElement("div");
  taskDiv.className = "task-container";
  taskDiv.innerHTML = `<div class="text-content">
    <h3>${task.titulo}</h3>
    <p>${task.descricao}</p>
    </div>
    <div class='icons'>
    <span class='icon-done'><img width="40" height="40" src="https://img.icons8.com/fluency-systems-regular/96/ok--v1.png" alt="ok--v1"/></span>
    <span class='icon-edit'><img width="40" height="40" src="https://img.icons8.com/fluency-systems-regular/48/edit--v1.png" alt="edit--v1" /></span>
    <span class='icon-delete'><img width="40" height="40" src="https://img.icons8.com/fluency-systems-regular/48/trash--v1.png" alt="trash--v1" /></span>
  </div>`;

  // adicionando a div da tarefa ao elemento pai (section)
  taskListDiv.appendChild(taskDiv);

  // escolhendo a cor aleatória para o background da div apartir das pré-setadas no array colorsPreset
  const chosenColor = setRandomColor();
  taskDiv.style.backgroundColor = chosenColor;

  // definindo o id da tarefa como atributo de dados na div da tarefa
  taskDiv.dataset.taskId = task.id;

  // adicionando um escutador de eventos no icone 'icon-done' na taskDiv
  // alterando a propriedade 'concluida:true' do objeto da tarefa quando o ícone é clicado pela primeira vez
  // e alterando novamente o valor da propriedade 'concluida:false' se o icone foir clicado novamente
  // adicionando animaçao que deixa o texto riscado
  taskDiv
    .querySelector(".icon-done")
    .addEventListener("click", function (event) {
      event.stopPropagation();

      task.concluida = !task.concluida;

      const textContent = taskDiv.querySelector(".text-content");

      if (task.concluida) {
        textContent.style.textDecoration = "line-through";
      } else {
        textContent.style.textDecoration = "none";
      }
    });

  // adicionando um escutador de eventos no ícone 'icon-edit' na taskDiv
  taskDiv
    .querySelector(".icon-edit")
    .addEventListener("click", function (event) {
      event.stopPropagation();
      openModal(event);
    });

  // adicionando um escutador de eventos no ícone 'icon-delete' na taskDiv
  taskDiv
    .querySelector(".icon-delete")
    .addEventListener("click", function (event) {
      event.stopPropagation();

      // obtendo o id da tarefa associada ao ícone 'icon-delete'
      const taskId = parseInt(taskDiv.dataset.taskId);

      // exibindo um alerta de confirmação
      const confirmDelete = confirm(
        "Tem certeza que deseja deletar esta tarefa?"
      );

      // se o usuário clicar em 'sim', a div da tarefa é ocultada
      if (confirmDelete) {
        // ocultando a div da tarefa
        taskDiv.style.display = "none";

        // adicionando a tarefa deletada ao array deletedTasks
        const deletedTask = tasks.find((task) => task.id === taskId);
        if (deletedTask) {
          deletedTasks.push(deletedTask);
        }

        // removendo a tarefa do array tasks
        tasks = tasks.filter((task) => task.id !== taskId);
      }
    });
}

//escutador de eventos de clique geral (página inteira)
document.addEventListener("click", function (event) {
  // limitando o escutador de eventos para o target (alvo)
  const target = event.target;

  // verificando se o target tem a classe 'icon-done'
  if (target.classList.contains("icon-done")) {
    // buscando o elemento pai mais próximo do target clicado
    const taskDiv = target.closest(".task-container");
    // obtendo o id da tarefa e parseando para um número inteiro
    const taskId = parseInt(taskDiv.dataset.taskId);
    // Encontrando o índice da tarefa no array 'tasks' com base no id
    const taskIndex = tasks.findIndex((task) => task.id === taskId);

    // verifica se a tarefa foi encontrada no array
    if (taskIndex !== -1) {
      tasks[taskIndex].concluida = !tasks[taskIndex].concluida;
      const textContent = taskDiv.querySelector(".text-content");

      // implementando condicional para adicionar animação e estilo css ao conteúdo de texto da div task
      if (tasks[taskIndex].concluida) {
        textContent.style.textDecoration = "line-through";
      } else {
        textContent.style.textDecoration = "none";
      }

      // alterando o estilo da classe css 'completed' de acordo com o valor booleano da propriedade 'concluida' do objeto.
      taskDiv.classList.toggle("completed", tasks[taskIndex].concluida);
    }
  }
});

// função para abrir o modal 'edit-task'
function openModal(event) {
  const modal = document.getElementById("modalEdit");
  modal.style.display = "block";

  // obtendo o id da tarefa associada ao ícone 'icon-edit' (edição)
  const taskDiv = event.target.closest(".task-container");
  const taskId = parseInt(taskDiv.dataset.taskId);
  const taskIndex = tasks.findIndex((task) => task.id === taskId);

  if (taskIndex !== -1) {
    const task = tasks[taskIndex];

    // anexando os inputs com os valores da tarefa
    document.getElementById("input-title-modal").value = task.titulo;
    document.getElementById("input-description-modal").value = task.descricao;

    // associando a tarefa ao modal para referência posterior
    modal.currentTask = task;
    modal.currentTaskDiv = taskDiv;
  }
}

// Função para salvar as alterações no modal 'edit-task'
function saveChanges() {
  const modal = document.getElementById("modalEdit");

  // Obter os novos valores dos inputs
  const newTitle = document.getElementById("input-title-modal").value;
  const newDescription = document.getElementById(
    "input-description-modal"
  ).value;

  // verificando se o novo título é composto apenas por espaços em branco
  if (/^\s+$/.test(newTitle)) {
    alert("O título não pode consistir apenas em espaços em branco.");
    return;
  }

  // verificando se a nova descrição é composta apenas por espaços em branco
  if (/^\s+$/.test(newDescription)) {
    alert("A descrição não pode consistir apenas em espaços em branco.");
    return;
  }

  // Verificando se o novo título contém apenas números ou menos de 5 caracteres
  if (/^\d+$/.test(newTitle) || newTitle.length < 5) {
    alert("O título deve conter pelo menos 5 caracteres e não pode consistir apenas em números.");
    return;
  }

  // Verificando se a nova descrição contém apenas números ou menos de 5 caracteres
  if (/^\d+$/.test(newDescription) || newDescription.length < 5) {
    alert("A descrição deve conter pelo menos 5 caracteres e não pode consistir apenas em números.");
    return;
  }

   // Validando os campos para ver se o usuário tentou enviar uma tarefa com título ou descrição vazias
   if (!newTitle.trim() || !newDescription.trim()) {
    alert("O título e a descrição não podem estar vazios.");
    return;
  }  

  // Verificando se o novo título já existe em outras tarefas
  const isTitleDuplicate = tasks.some(task => task.titulo === newTitle && task.id !== modal.currentTask.id);
  if (isTitleDuplicate) {
    alert("Já existe uma tarefa com o mesmo título. Escolha um título único.");
    return;
  }

  // Verificando se a nova descrição já existe em outras tarefas
  const isDescriptionDuplicate = tasks.some(task => task.descricao === newDescription && task.id !== modal.currentTask.id);
  if (isDescriptionDuplicate) {
    alert("Já existe uma tarefa com a mesma descrição. Escolha uma descrição única.");
    return;
  }

  modal.style.display = "none";
  
  // Atualizando os valores da tarefa atual
  const task = modal.currentTask;
  task.titulo = newTitle;
  task.descricao = newDescription;

  // Atualizando a exibição da tarefa na tela
  const taskDiv = modal.currentTaskDiv;
  const textContent = taskDiv.querySelector(".text-content");
  textContent.querySelector("h3").textContent = newTitle;
  textContent.querySelector("p").textContent = newDescription;
}
// Adicionando um escutador de eventos para fechar o modal quando o botão 'close' é clicado
const closeButton = document.querySelector(".close");
if (closeButton) {
  closeButton.addEventListener("click", closeModal);
}

// Função para fechar o modal
function closeModal() {
  const modal = document.getElementById("modalEdit");
  modal.style.display = "none";
}

// código do modal de 'delete-task'
// Função para ser chamada quando o documento estiver completamente carregado
document.addEventListener("DOMContentLoaded", function () {
  // adicionando escutador de evento ao icone da lixeira no HTML
  const trashIcon = document.querySelector(".trash-icon img");
  trashIcon.addEventListener("click", openDeleteModal);
});
// Função para abrir o modal de exclusão 'delete-task'
function openDeleteModal() {
  const modalDelete = document.getElementById("modalDelete");
  modalDelete.style.display = "block";

  // limpando o conteúdo anterior do container
  const deletedTasksContainer = document.getElementById(
    "deleted-tasks-container"
  );
  deletedTasksContainer.innerHTML = "";

  // criando dinamicamente o container com as tarefas excluídas
  deletedTasks.forEach((task) => {
    deletedTasksContainer.innerHTML += `
        <div class="delete-checkbox">
        <input type="checkbox" class="restore-checkbox" data-task-id="${task.id}">
        </div>
        <div class"delete-content">
        <h3>${task.titulo}</h3>
        <p>${task.descricao}</p>
        </div>        
      `;
  });
}

// Função para fechar o modal de exclusão
function closeDeleteModal() {
  const modalDelete = document.getElementById("modalDelete");
  modalDelete.style.display = "none";
}

// Função para restaurar as tarefas selecionadas
function restoreSelectedTasks() {
  const checkboxes = document.querySelectorAll(".restore-checkbox");

  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      const taskId = parseInt(checkbox.dataset.taskId);
      const restoredTask = deletedTasks.find((task) => task.id === taskId);

      if (restoredTask) {
        tasks.push(restoredTask);
      }
    }
  });

  // Limpa o array de tarefas excluídas
  deletedTasks = [];

  // Atualiza a exibição das tarefas
  updateTaskDisplay("todas as tarefas");

  // Fecha o modal de exclusão
  closeDeleteModal();
}

//selecionando os itens do dropdown
const dropdownItems = document.querySelectorAll(".dropdown-item");

// iterando os itens e passando a função para filtrar o conteúdo de acordo com o tipo da task
dropdownItems.forEach((item) => {
  item.addEventListener("click", function () {
    const filterType = this.textContent.trim().toLowerCase();

    // atualizando a exibição com base no filtro do menu
    updateTaskDisplay(filterType);
  });
});

// função para atualizar a exibição de tarefas com base no tipo de filtro do menu dropdown
function updateTaskDisplay(filterType) {
  const taskList = document.querySelector("#task-list");
  const taskContainers = document.querySelectorAll(".task-container");

  // iterando sobre todas as tarefas e ajustando a visibilidade
  taskContainers.forEach((container) => {
    const taskId = parseInt(container.dataset.taskId);
    const taskIndex = tasks.findIndex((task) => task.id === taskId);    

    if (taskIndex !== -1) {
      const task = tasks[taskIndex];

      if (
        filterType === "todas as tarefas" ||
        (filterType === "tarefas concluídas" && task.concluida) ||
        (filterType === "tarefas não concluídas" && !task.concluida)
      ) {
        container.style.display = "block";
      } else {
        container.style.display = "none";
      }
    }   
  });
}

// Encontrando o botão de pesquisa no HTML
const searchButton = document.querySelector("#button-search");

// adicionando um escutador de eventos ao botão de pesquisa
searchButton.addEventListener("click", searchTasks);

// função para realizar a pesquisa nas tarefas
function searchTasks() {
  // Obtendo o valor digitado no input de pesquisa
  const searchTerm = document.querySelector("#input-search").value.trim();

  // Verificando se o termo de pesquisa não está vazio
  if (searchTerm !== "") {
    // Filtrando o array 'tasks' por correspondência exata no título, descrição ou no ID
    const foundTasks = tasks.filter(
      (task) =>
        task.titulo === searchTerm ||
        task.descricao === searchTerm ||
        task.id.toString() === searchTerm
    );

    // Filtrando o array 'deletedTasks' por correspondência exata no título, descrição ou noID
    const foundDeletedTasks = deletedTasks.filter(
      (task) =>
        task.titulo === searchTerm ||
        task.descricao === searchTerm ||
        task.id.toString() === searchTerm
    );

    // removendo todas as tarefas da tela
    clearTaskDisplay();

    // Se a tarefa for encontrada, exibi-la e adicionar o botão "Voltar para todas as tarefas" na tela
    if (foundTasks.length > 0 || foundDeletedTasks.length > 0) {
      const foundTask = foundTasks.length > 0 ? foundTasks[0] : foundDeletedTasks[0];
      showTask(foundTask);

      // Adicionando o botão "Voltar para todas as tarefas"
      addBackButton();
    } else {
      //  caso nenhuma tarefa for encontrada, exiba uma mensagem
      alert("Nenhuma tarefa encontrada com o termo de pesquisa.");
      // Adicionando o botão "Voltar para todas as tarefas"
      addBackButton();
    }
  } else {
    // Se o termo de pesquisa estiver vazio, exiba uma mensagem de alerta
    alert("Por favor, digite um termo de pesquisa.");
  }
}

// Função para "remover" todas as tarefas da tela
function clearTaskDisplay() {
  const taskListDiv = document.querySelector("#task-list");
  taskListDiv.innerHTML = ""; // Removendo todo o conteúdo da lista de tarefas
}

// Função para adicionar o botão "Voltar para todas as tarefas"
function addBackButton() {
  const backButtonContainer = document.createElement("div");
  backButtonContainer.className = "back-button-container"; 
  backButtonContainer.innerHTML = '<button id="back-to-all-tasks">Voltar para todas as tarefas</button>';

  const taskListDiv = document.querySelector("#task-list");
  taskListDiv.appendChild(backButtonContainer);

  // adicionando escutador de eventos ao botão "Voltar para todas as tarefas"
  const backButton = document.querySelector("#back-to-all-tasks");
  backButton.addEventListener("click", showAllTasks);
}
// Função para mostrar todas as tarefas novamente
function showAllTasks() {
  // removendo o botão "Voltar para todas as tarefas" da tela
  const backButtonContainer = document.querySelector(".back-button-container");
  backButtonContainer.remove();

  // limpando a tela
  clearTaskDisplay();

  // mostrando todas as tarefas novamente
  tasks.forEach((task) => {
    showTask(task);
  });

  // Adicionando as tarefas excluídas de volta à tela
  deletedTasks.forEach((deletedTask) => {
    showTask(deletedTask);
  });
}

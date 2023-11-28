// associando o icon da lâmpada no header a uma variável
const lampButton = document.querySelector('.header-icon');

//adicionando event listener ao icon
lampButton.addEventListener('click', function () {
    // Função para alternar entre os modos claro e escuro
    function toggleDarkMode() {
        const htmlElement = document.documentElement;
        htmlElement.classList.toggle('dark-mode');

        const isDarkModeEnabled = htmlElement.classList.contains('dark-mode');
        localStorage.setItem('darkMode', isDarkModeEnabled);
    }

    // Alternar o modo escuro ao clicar no ícone
    toggleDarkMode();

    // Verificar o estado do modo escuro após a alternância
    const htmlElement = document.documentElement;
    const isDarkModeEnabled = htmlElement.classList.contains('dark-mode');

    // Adicionar ou remover um indicador visual no ícone para refletir o estado atual do modo escuro
    if (isDarkModeEnabled) {
        // Adicionar uma classe ou alterar o ícone para indicar que o modo escuro está ativado
        lampButton.classList.add('dark-mode-active');
    } else {
        // Remover a classe ou alterar o ícone para indicar que o modo escuro está desativado
        lampButton.classList.remove('dark-mode-active');
    }
});
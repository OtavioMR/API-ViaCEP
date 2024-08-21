document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('cep-form');
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Obtém o valor do CEP, remove o hífen e espaços
        const cep = document.getElementById('cep').value.replace('-', '').trim();

        // Faz a requisição para a API ViaCEP
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {
                // Verifica se há erro na resposta
                if (data.erro) {
                    alert('CEP não encontrado');
                    return;
                }

                // Prepara as informações do endereço para exibição
                const addressInfo = document.getElementById('address-info');
                const html = `
                    <h2>Informações do Endereço</h2>
                    <p><strong>CEP:</strong> ${data.cep}</p>
                    <p><strong>Estado:</strong> ${data.uf}</p>
                    <p><strong>Cidade:</strong> ${data.localidade}</p>
                    <p><strong>Bairro:</strong> ${data.bairro}</p>
                    <p><strong>Rua:</strong> ${data.logradouro}</p>
                `;
                addressInfo.innerHTML = html;
            })
            .catch(error => {
                console.error('Erro ao buscar CEP:', error);
            });
    });
});

document.addEventListener('DOMContentLoaded', function () {
    // Inicializa o mapa centrado no Brasil
    var map = L.map('map').setView([-14.2350, -51.9253], 4);

    // Adiciona os tiles do OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
    }).addTo(map);

    const form = document.getElementById('cep-form');
    form.addEventListener('submit', function (event) {
        event.preventDefault();

        // Obtém o valor do CEP, remove o hífen e espaços
        const cep = document.getElementById('cep').value.replace('-', '').trim();

        // Faz a requisição para a API ViaCEP
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => response.json())
            .then(data => {
                if (data.erro) {
                    alert('CEP não encontrado');
                    return;
                }

                // Exibe as informações do endereço
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

                // Busca as coordenadas do endereço
                buscarCoordenadas(data.logradouro, data.localidade, data.uf);
            })
            .catch(error => console.error('Erro ao buscar CEP:', error));
    });

    function buscarCoordenadas(logradouro, localidade, uf) {
        const endereco = `${logradouro}, ${localidade}, ${uf}`;

        fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${endereco}`)
            .then(response => response.json())
            .then(result => {
                if (result.length > 0) {
                    var latitude = result[0].lat;
                    var longitude = result[0].lon;

                    // Centraliza o mapa nas coordenadas e adiciona um marcador
                    map.setView([latitude, longitude], 15);
                    L.marker([latitude, longitude]).addTo(map)
                        .bindPopup(endereco)
                        .openPopup();
                } else {
                    alert("Localização não encontrada. Tente um CEP diferente.");
                }
            })
            .catch(error => console.error('Erro ao buscar coordenadas:', error));
    }
});

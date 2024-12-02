const API_URL = 'http://localhost:8080/mhmovie';


let filmeEscolhido = null;
let idEdicao = null;

// Função para salvar dados da reserva
async function salvarReserva(event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const chave = document.getElementById('chave').value.trim();
    const horario = document.getElementById('horario').value;

    const fotoInput = document.getElementById('novaFoto');
    let fotoURL = null;

    // Verifica se há uma foto e redimensiona se necessário
    if (fotoInput.files[0]) {
        const resizedImage = await resizeImage(fotoInput.files[0], 150, 150); // Redimensiona a imagem para 150x150px
        fotoURL = resizedImage;
    }

    if (!filmeEscolhido) {
        alert('Por favor, escolha um filme.');
        return;
    }

    const reserva = {
        nome,
        chaveReserva: chave,
        horarioReserva: horario,
        filmeEscolhido,
        imagemPerfil: fotoURL
    };

    try {
        let response;
        if (idEdicao) {
            response = await fetch(`${API_URL}/atualizarReserva/${idEdicao}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reserva),
            });
        } else {
            response = await fetch(`${API_URL}/CriarReserva`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reserva),
            });
        }

        if (!response.ok) throw new Error('Erro ao salvar a reserva.');

        alert('Reserva salva com sucesso!');
        idEdicao = null; // Resetar o ID de edição
        filmeEscolhido = null; // Resetar o filme escolhido
        document.getElementById('formReserva').reset(); // Limpar o formulário
        listarReservas(); // Atualizar a lista de reservas
    } catch (error) {
        alert('Erro ao salvar a reserva: ' + error.message);
    }
}

// Função para converter imagem em Base64
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });
}

// Função para redimensionar a imagem para um tamanho máximo
function resizeImage(file, maxWidth = 150, maxHeight = 150) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                let width = img.width;
                let height = img.height;

                // Calcula a proporção
                if (width > height) {
                    if (width > maxWidth) {
                        height = Math.round((height *= maxWidth / width));
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = Math.round((width *= maxHeight / height));
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL('image/jpeg'));
            };
        };
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
    });
}

// Listar reservas (reformulado)
async function listarReservas() {
    try {
        const response = await fetch(`${API_URL}/mostrarReserva`);
        if (!response.ok) throw new Error('Erro ao buscar reservas.');

        const reservas = await response.json();
        const registroList = document.getElementById('registro-list');
        registroList.innerHTML = ''; // Limpa a lista

        if (reservas.length === 0) {
            registroList.innerHTML = '<p>Nenhuma reserva encontrada.</p>';
            return;
        }

        reservas.forEach(reserva => {
            const div = document.createElement('div');
            div.classList.add('reserva-card');

            div.innerHTML = `
                <h3>${reserva.nome}</h3>
                <p><strong>Filme:</strong> ${reserva.filmeEscolhido}</p>
                <p><strong>Horário:</strong> ${reserva.horarioReserva}</p>
                <p><strong>Chave:</strong> ${reserva.chaveReserva}</p>
                <button onclick="removerReserva('${reserva.id}')">Excluir</button>
            `;

            registroList.appendChild(div);
        });
    } catch (error) {
        console.error('Erro ao listar reservas:', error);
        document.getElementById('registro-list').innerHTML = '<p>Erro ao carregar reservas. Tente novamente mais tarde.</p>';
    }
}


// Função para renderizar as reservas
function renderReservas(reservas) {
    const list = document.getElementById('registro-list');
    list.innerHTML = '';

    reservas.forEach(reserva => {
        const div = document.createElement('div');
        div.className = 'registro-item';
        div.innerHTML = `
            <div class="registro-details">
                <strong>Nome:</strong> ${reserva.nome}<br>
                <strong>Chave:</strong> ${reserva.chaveReserva}<br>
                <strong>Filme:</strong> ${reserva.filmeEscolhido}<br>
                <strong>Horário:</strong> ${reserva.horarioReserva}<br>
            </div>
            <div class="registro-actions">
                ${reserva.imagemPerfil ? `<img src="${reserva.imagemPerfil}" class="perfil-img">` : ''}
                <button onclick="excluirReserva(${reserva.id})">Excluir</button>
                <button onclick="editarReserva(${reserva.id})">Editar</button>
            </div>
        `;
        list.appendChild(div);
    });
}

// Função para excluir uma reserva
async function excluirReserva(id) {
    try {
        const response = await fetch(`${API_URL}/deletar/${id}`, { method: 'DELETE' });
        if (!response.ok) throw new Error('Erro ao excluir reserva.');
        alert('Reserva excluída com sucesso!');
        listarReservas();
    } catch (error) {
        alert('Erro ao excluir reserva: ' + error.message);
    }
}

// Função para editar uma reserva
async function editarReserva(id) {
    try {
        const response = await fetch(`${API_URL}/buscarReservaId/${id}`);
        const reserva = await response.json();

        document.getElementById('nome').value = reserva.nome;
        document.getElementById('chave').value = reserva.chaveReserva;
        document.getElementById('horario').value = reserva.horarioReserva;
        filmeEscolhido = reserva.filmeEscolhido;
        idEdicao = reserva.id;

        // Atualiza a imagem do perfil, se necessário
        if (reserva.imagemPerfil) {
            document.getElementById('filme-imagem').innerHTML = `<img src="${reserva.imagemPerfil}" alt="Imagem do Perfil" class="filme-imagem">`;
        }
    } catch (error) {
        alert('Erro ao carregar dados para edição: ' + error.message);
    }
}

// Função para abrir o modal de seleção de filmes
function openFilmSelector() {
    document.getElementById('film-selector-modal').classList.remove('hidden');
}

// Função para fechar o modal de seleção de filmes
function closeFilmSelector() {
    document.getElementById('film-selector-modal').classList.add('hidden');
}

// Função para selecionar um filme
function selectFilme(filme) {
    filmeEscolhido = filme;
    document.getElementById('filme-imagem').innerHTML = `<span class="filme-emoji">${filme}</span>`;
    closeFilmSelector();
}

// Inicializa a lista de reservas
document.getElementById('formReserva').addEventListener('submit', salvarReserva);
listarReservas();

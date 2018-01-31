window.onload = () =>{
    const lista = document.querySelector('#lista');
    const botao = document.querySelector('#botao');
    const texto = document.querySelector('#texto');

    botao.addEventListener('click', create);
    lista.addEventListener('click', del);
    lista.addEventListener('click', edit);

    read();
}

function templateLi(id, nome, element = true){
    return `
        ${element ? `<li class="list-group-item row">` : ''}
            <div class="col-10">${nome}</div>
            <i class="btn btn-primary col-1 text-right update fa fa-wrench"
                data-id="${id}";
            ></i>
            <i class="btn btn-danger col-1 text-right delete fa fa-trash"
                data-id="${id}";
            ></i>
        ${element ? `</li>` : ''}
    `;
}

function read(){
    lista.innerHTML = "";

    //chamada ajax
    axios.get('/read/')
        .then((response) => {
            console.log(response.data);

            response.data.forEach(element => {
                lista.innerHTML += templateLi(element.id, element.name);
            });
        })
        .catch((error) => {
            console.log(error);
        });
}

function create(){
    const name = texto.value;

    axios.post('/create/', {name: name})
        .then((response) => {
            console.log(response.data);
            lista.innerHTML += templateLi(response.data[0], name);
        })
        .catch((error) => {
            console.log(error);
        });
}

function edit(element){
    if(element.target.classList.contains('update')){
        const id = element.target.dataset.id;

        const input = document.createElement('input');
        input.type = 'text';
        input.setAttribute('value', '');

        const pai = element.target.parentElement;
        pai.innerHTML = '';
        pai.appendChild(input);

        input.addEventListener('keydown', update.bind(pai, id, input));
        input.focus();
    }
}

function update(id, input){
    const key = event.key;
    if(key == null || key != 'Enter') return;

    axios.put(`/update/${id}`, {name: input.value})
        .then((response) => {
            console.log(response.data);

            if(response.status == 200){
                this.innerHTML = templateLi(id, input.value, false);
            }
        })
        .catch((error) => {
            console.log(error);
        });
}

function del(element){
    console.log(element);

    if(element.target.classList.contains('delete')){
        //Pega o id do elemento
        const id = element.target.dataset.id;

        axios.delete(`/delete/${id}`)
            .then((response) => {
                console.log(response.data);

                if(response.status == 200){
                    //Se a exclusão for bem-sucedida, exclui o elemento pai
                    lista.removeChild(element.target.parentElement);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }
}
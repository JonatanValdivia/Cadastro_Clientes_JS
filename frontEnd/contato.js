'use strict'
const $ = element => document.querySelector(element);
//Método para pegar o contato -> será uma função assíncrona, pois o then deixaria muito comprido determinada função
const getContact = async (url) =>{
  const response = await fetch(url)
  const json = await response.json();
  return json.data;
}

const createContact = async (newContact) => {
  const url = "http://localhost/javaScript/backEnd/apiphp/contatos/";
  const options = {
    //Método que será usado para o envio:
    method: 'POST',
    //Corpo da 'minha mensagem':
    body: JSON.stringify(newContact),//Precisamos passá-lo para String.
  }
  await fetch(url, options);
}

const updateContact = async (contact) => {
  const url = `http://localhost/javaScript/backEnd/apiphp/contatos/${contact.id}`
  const options = {
      method: 'PUT',
      body: JSON.stringify(contact)
  }
  await fetch(url, options)
}

const pegarContato = ( url ) => fetch ( url ).then ( res => res.json() );

const deleteContact = async(id) =>{
  const url = `http://localhost/javaScript/backEnd/apiphp/contatos/${id}`;
  const options = {
    method: 'DELETE'
  };
  await fetch(url, options);
  updateTable();
}

const fillFields = (contact) =>{
  $('#nome').value = contact[0].nome;
  $('#email').value = contact[0].email;
  $('#cidade').value = contact[0].cidade
  $('#estado').value = contact[0].estado
  document.getElementById('nome').dataset.idcontact = contact[0].id
}

const editContact = async() => {
  const id = prompt("Digite o ID para editar")
  if (id > 0) {
    const url = `http://localhost/javaScript/backEnd/apiphp/contatos/${id}`
    const contact = await getContact(url)
    if (contact == "id não encontrado") {
      alert ("ID não encontrado!")    
    } else {
      fillFields(contact)
      document.getElementById('deletar').disabled = true
    } 
  }
}

const  mostrarContato = async (event) =>  {
    var id = event.path[1].cells[0].firstChild.data;
    const url = `http://localhost/javaScript/backEnd/apiphp/contatos/${id}`;
    const contact = await pegarContato(url);
    $('#nome').value = contact.data[0].nome;
    $('#email').value = contact.data[0].email;
    $('#cidade').value = contact.data[0].cidade
    $('#estado').value = contact.data[0].estado
    
    const botoes = [
      $('#deletar').addEventListener('click',
      ()=>{deleteContact(id)})
    ]
};

const createRow = (contato) =>{
  const tbody = $('main>table>tbody');
  const newRow = document.createElement('tr');
  newRow.innerHTML = `
    
    <td>${contato.id}</td>
    <td>${contato.nome}</td>
    <td>${contato.email}</td>
    <td>${contato.cidade}</td>
    <td>${contato.estado}</td>
  `
  tbody.appendChild(newRow);
}

const clearTable = () =>{
  const tbody = $('main>table>tbody');
  while(tbody.firstChild){
    tbody.removeChild(tbody.lastChild)
  }
}

//ao carregar a tela, atualizar a tabela
const updateTable = async () =>{
  //alert ('OK');
  clearTable();
  const url = "http://localhost/javaScript/backEnd/apiphp/contatos/";
  const contatos = await getContact(url);
  contatos.forEach(createRow);
}

const clearFields = () =>{
  $('#nome').value = ''
  $('#email').value = ''
  $('#cidade').value = ''
  $('#estado').value = ''
  document.getElementById('nome').dataset.idcontact = "new"
}

const isValidForm = () => $('main>form').reportValidity()

const saveContact = async () => {
  if (isValidForm()) {
    const newContact = {
      //'id'    : '',
      'nome'  : document.getElementById('nome').value,
      'email' : document.getElementById('email').value,
      'cidade': document.getElementById('cidade').value,
      'estado': document.getElementById('estado').value
    }
    const idContact = document.getElementById('nome').dataset.idcontact
    if (idContact == "new") {
      await createContact(newContact)
    } else {
      newContact.id = idContact
      console.log (newContact)
      await updateContact(newContact)
      document.getElementById('deletar').disabled = false
    }
    updateTable()
    clearFields() 
  }
}

document.getElementById('salvar').addEventListener('click', saveContact)
$('#editar').addEventListener('click', editContact)
$('tbody').addEventListener('click', mostrarContato)
updateTable();
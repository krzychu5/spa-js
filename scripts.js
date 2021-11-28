var tokenLogin = '';
const app = document.getElementById('root');

const logo = document.createElement('img');
logo.src = 'logo.png';
document.querySelector('#idSave').classList.add('hidden');
document.querySelector('#idDelete').classList.add('hidden');
document.querySelector('#add-ticket-form').classList.add('hidden');
load();

function load() {
  document.querySelector('#root').innerHTML = '';
  const container = document.createElement('div');
  container.setAttribute('class', 'container');

  app.appendChild(logo);
  app.appendChild(container);

  var request = new XMLHttpRequest();
  request.open('GET', 'http://localhost:8000/api/get-ticket', true);
  request.onload = function() {
    // Begin accessing JSON data here
    var data = JSON.parse(this.response);
    //alert(request.status);
    if (request.status >= 200 && request.status < 400) {
      data.forEach(ticket => {
        const card = document.createElement('div');
        card.setAttribute('class', 'card');
        card.setAttribute('data-id', ticket.id);

        const h1 = document.createElement('h1');
        h1.textContent = ticket.name;

        container.appendChild(card);
        card.appendChild(h1);

        card.addEventListener('click', function() {
          var idTicket = this.getAttribute('data-id');
          var modal = document.querySelector('#modal');
          console.log(modal.querySelector('#name'));
          getTicket(idTicket);

        });
      });
    } else {
      const errorMessage = document.createElement('marquee');
      errorMessage.textContent = `Gah, it's not working!`;
      app.appendChild(errorMessage);
    }
  }

  request.send();

  document.querySelector('#idExit').addEventListener('click', function() {
    document.querySelector('#modal').classList.add('hidden');
  });

  function getTicket(idTicket) {
    var requestGetTicket = new XMLHttpRequest();
    requestGetTicket.open('GET', `http://localhost:8000/api/ticket/${idTicket}`, true);
    requestGetTicket.onload = function() {
      // alert(requestGetTicket.status);
      var ticketGet = JSON.parse(this.response);
      if (requestGetTicket.status >= 200 && requestGetTicket.status < 400) {
        modal.querySelector('#name').value = ticketGet.name;
        modal.querySelector('#description').value = ticketGet.description;
        document.querySelector('#idSave').setAttribute('data-send-id', ticketGet.id);
        document.querySelector('#idDelete').setAttribute('data-delete-id', ticketGet.id);
        if (tokenLogin !== '') {
          document.querySelector('#idDelete').classList.remove('hidden');
        }
        modal.classList.remove('hidden');
      }
    }
    requestGetTicket.send();
  }
}

function Update() {
  var data = {};
  data.name = document.querySelector('#name').value;
  data.description = document.querySelector('#description').value;
  var json = JSON.stringify(data);
  let idTicket = document.querySelector('#idSave').getAttribute('data-send-id');
  // http://localhost:8000/api/ticket/1
  var requestUpdateTicket = new XMLHttpRequest();
  requestUpdateTicket.open('PUT', `http://localhost:8000/api/ticket/${idTicket}`, true);
  requestUpdateTicket.setRequestHeader('Content-type', 'application/json; charset=utf-8');
  requestUpdateTicket.setRequestHeader("Authorization", `Bearer ${tokenLogin}`);
  requestUpdateTicket.send(json);
  requestUpdateTicket.onload = function() {
    var ticket = JSON.parse(requestUpdateTicket.responseText);
    if (requestUpdateTicket.readyState == 4 && requestUpdateTicket.status == "200") {
      console.table(ticket);
      var cart = document.querySelector(`div[data-id='${idTicket}']`);
      console.log(cart.querySelector('h1'));
      console.log(ticket.name);
      cart.querySelector('h1').innerHTML = ticket.name;
      document.querySelector('#modal').classList.add('hidden');
    } else {
      console.error(ticket);
    }
  }


  // window.location.reload(true);
}

function Create() {
  var data = {};
  data.name = document.querySelector('#name').value;
  data.description = document.querySelector('#description').value;
  var json = JSON.stringify(data);
  var requestUpdateTicket = new XMLHttpRequest();
  requestUpdateTicket.open('POST', `http://localhost:8000/api/post-ticket`, true);
  requestUpdateTicket.setRequestHeader('Content-type', 'application/json; charset=utf-8');
  requestUpdateTicket.setRequestHeader("Authorization", `Bearer ${tokenLogin}`);
  requestUpdateTicket.send(json);
  requestUpdateTicket.onload = function() {
    var ticket = JSON.parse(requestUpdateTicket.responseText);
    console.log(requestUpdateTicket.readyState);
    console.log(requestUpdateTicket.status);
    if (requestUpdateTicket.readyState == 4 && requestUpdateTicket.status == "201") {
      const card = document.createElement('div');
      card.setAttribute('class', 'card');
      card.setAttribute('data-id', ticket.id);

      const h1 = document.createElement('h1');
      h1.textContent = ticket.name;

      container = document.querySelector('.container');
      container.appendChild(card);
      card.appendChild(h1);
      load();
      document.querySelector('#modal').classList.add('hidden');
    } else {
      console.error(ticket);
    }
  }


  // window.location.reload(true);
}

function Delete() {
  var data = {};
  let idTicket = document.querySelector('#idDelete').getAttribute('data-delete-id');
  // http://localhost:8000/api/ticket/1
  var requestDeleteTicket = new XMLHttpRequest();
  requestDeleteTicket.open('Delete', `http://localhost:8000/api/ticket/${idTicket}`, true);
  requestDeleteTicket.setRequestHeader('Content-type', 'application/json; charset=utf-8');
  requestDeleteTicket.setRequestHeader("Authorization", `Bearer ${tokenLogin}`);
  requestDeleteTicket.send(null);
  requestDeleteTicket.onload = function() {
    var ticket = JSON.parse(requestDeleteTicket.responseText);
    if (requestDeleteTicket.readyState == 4 && requestDeleteTicket.status == "200") {
      console.table(ticket);
      document.querySelector(`div[data-id='${idTicket}']`).remove();
      console.log('deleted');
      document.querySelector('#modal').classList.add('hidden');
    } else {
      console.error(ticket);
    }
  }


  // window.location.reload(true);
}
document.querySelector('#idSave').addEventListener('click', function() {
  if (document.querySelector('#idSave').getAttribute('data-send-id') > 0) {
    console.log(document.querySelector('#idSave').getAttribute('data-send-id') > 0);
    Update();
  } else {
    Create();
  }

}, true);
document.querySelector('#idDelete').addEventListener('click', Delete, true);

document.querySelector('#login-form').addEventListener('click', function() {
  document.querySelector('#login').classList.remove('hidden');
}, true);
document.querySelector('#idExitLogin').addEventListener('click', function() {
  document.querySelector('#login').classList.add('hidden');
});

document.querySelector('#buttonLogin').addEventListener('click', logToken, true);

function logToken() {
  // tokenLogin
  var data = {};
  data.email = document.querySelector('#logEmail').value;
  data.password = document.querySelector('#logPassword').value;
  var json = JSON.stringify(data);
  var requestLogin = new XMLHttpRequest();
  requestLogin.open('POST', `http://localhost:8000/api/login`, true);
  requestLogin.setRequestHeader('Content-type', 'application/json; charset=utf-8');
  requestLogin.send(json);
  requestLogin.onload = function() {
    // Begin accessing JSON data here
    var dataReturn = this.response;
    console.log(dataReturn);
    tokenLogin = dataReturn;
    document.querySelector('#login').classList.add('hidden');
    document.querySelector('#login-form').innerHTML = `Logged ${tokenLogin}`;
    document.querySelector('#idSave').classList.remove('hidden');
    document.querySelector('#idDelete').classList.remove('hidden');
    document.querySelector('#add-ticket-form').classList.remove('hidden');
  }
}
document.querySelector('#add-ticket-form').addEventListener('click', function() {
  document.querySelector('#modal').classList.remove('hidden');
  modal.querySelector('#name').value = '';
  modal.querySelector('#description').value = '';
  document.querySelector('#idSave').setAttribute('data-send-id', '');
  document.querySelector('#idDelete').removeAttribute('data-delete-id');
  document.querySelector('#idDelete').classList.add('hidden');


});
document.querySelector('#register-from').addEventListener('click', function() {
  document.querySelector('#login').classList.add('hidden');
  document.querySelector('#register').classList.remove('hidden');

});
document.querySelector('#idExitRegister').addEventListener('click', function() {
  document.querySelector('#register').classList.add('hidden');
});

document.querySelector('#buttonRegister').addEventListener('click', registerToken, true);

function registerToken() {
  // tokenLogin
  var data = {};
  data.name = document.querySelector('#regName').value;
  data.email = document.querySelector('#regEmail').value;
  data.password = document.querySelector('#regPassword').value;
  data.password_confirmation = document.querySelector('#regPassword').value;
  var json = JSON.stringify(data);
  var requestRegister = new XMLHttpRequest();
  requestRegister.open('POST', `http://localhost:8000/api/register`, true);
  requestRegister.setRequestHeader('Content-type', 'application/json; charset=utf-8');
  requestRegister.send(json);
  requestRegister.onload = function() {
    // Begin accessing JSON data here
    var dataReturn = this.response;
    console.log(dataReturn);
    tokenLogin = dataReturn;
    document.querySelector('#register').classList.add('hidden');
    document.querySelector('#login-form').innerHTML = `Logged ${tokenLogin}`;
    document.querySelector('#idSave').classList.remove('hidden');
    document.querySelector('#idDelete').classList.remove('hidden');
    document.querySelector('#add-ticket-form').classList.remove('hidden');
    document.querySelector('#register').classList.add('hidden');
  }
}

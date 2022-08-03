const URL = "https://todo-api.coderslab.pl";
const API_KEY = "a75ea19d-86cd-49df-85ca-ad204133b591";

const title = document.querySelector('input[name="title"]');
const description = document.querySelector('input[name="description"]');
const app = document.querySelector('#app');
app.parentElement.style.backgroundColor = "#B6D4F8";

const addTask = document.querySelector('#add-task');

document.addEventListener("DOMContentLoaded", function () {
    apiListTasks().then(function (tasks) {
        tasks.data.forEach(function (task) {
            renderTask(task.title, task.description, task.status, task.id);
        })
    });

    addTask.addEventListener("click", function (event) {
        event.preventDefault();
        apiCreateTask(title.value, description.value).then(
            function (response) {
                const task = response.data;
                renderTask(task.title, task.description, task.status, task.id);
            }
        );
        title.value = "";
        description.value = "";
    })
    const navbar = document.querySelector('.navbar');
    navbar.style.backgroundColor = '#1379F5';
    navbar.firstElementChild.style.color = 'white';
})

function apiListTasks() {
    return fetch(
        URL + "/api/tasks",
        {
            headers: {Authorization: API_KEY}
        })
        .then(function (result) {
            if (!result.ok) {
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny')
            }
            return result.json();
        })
}

function apiCreateTask(title, description) {
    return fetch(
        URL + '/api/tasks',
        {
            headers: {
                'Authorization': API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: title,
                description: description,
                status: 'open'
            }),
            method: 'POST'
        }
    ).then(
        function (resp) {
            if (!resp.ok) {
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return resp.json();
        }
    )
}

function apiUpdateTask(taskId, taskTitle, taskDescription, taskStatus) {
    return fetch(
        URL + '/api/tasks/' + taskId,
        {
            headers: {
                'Authorization': API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: taskTitle,
                description: taskDescription,
                status: taskStatus
            }),
            method: 'PUT'
        }
    ).then(
        function (response) {
            if (!response.ok) {
                alert("Wystąpił błąd z aktualizacją zadania");
            }
            return response.json();
        }
    )
}

function apiDeleteTask(taskId) {
    return fetch(
        URL + '/api/tasks/' + taskId,
        {
            headers: {
                'Authorization': API_KEY
            },
            method: 'DELETE'
        }
    ).then(
        function (resp) {
            if (!resp.ok) {
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return resp.json();
        }
    )
}

function apiGetOperationListFromTask(taskId) {
    return fetch(
        URL + "/api/tasks/" + taskId + "/operations",
        {
            headers: {Authorization: API_KEY}
        })
        .then(function (result) {
            if (!result.ok) {
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny')
            }
            return result.json();
        })
}

function apiCreateOperation(taskId, operationDescription) {
    return fetch(
        URL + '/api/tasks/' + taskId + '/operations',
        {
            headers: {
                'Authorization': API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                description: operationDescription,
                timeSpent: 0
            }),
            method: 'POST'
        }
    ).then(
        function (resp) {
            if (!resp.ok) {
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return resp.json();
        }
    )
}

function apiUpdateOperation(operationId, operationDescription, operationTimeSpent) {
    return fetch(
        URL + '/api/operations/' + operationId,
        {
            headers: {
                'Authorization': API_KEY,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                description: operationDescription,
                timeSpent: operationTimeSpent,
            }),
            method: 'PUT'
        }
    ).then(
        function (response) {
            if (!response.ok) {
                alert("Wystąpił błąd z aktualizacją operacji!");
            }
            return response.json();
        }
    )
}

function apiDeleteOperation(operationID) {
    return fetch(
        URL + '/api/operations/' + operationID,
        {
            headers: {
                'Authorization': API_KEY,
            },
            method: 'DELETE'
        }
    ).then(
        function (resp) {
            if (!resp.ok) {
                alert('Wystąpił błąd! Otwórz devtools i zakładkę Sieć/Network, i poszukaj przyczyny');
            }
            return resp.json();
        }
    )
}

function renderTask(taskTitle, taskDescription, taskStatus, taskId) {
    const section = document.createElement('section');
    section.className = 'card mt-5 shadow-sm';
    app.append(section);

    const mainDiv = document.createElement('div');
    mainDiv.className = "card-header d-flex justify-content-between align-items-center";
    section.append(mainDiv);

    const headerDiv = document.createElement('div');
    const h5 = document.createElement('h5');
    h5.innerText = taskTitle;
    headerDiv.append(h5);

    const h6 = document.createElement('h6');
    h6.className = "card-subtitle text-muted";
    h6.innerText = taskDescription;
    headerDiv.append(h6);

    mainDiv.append(headerDiv);

    const buttonDiv = document.createElement('div');
    if (taskStatus === 'open') {
        const finishButton = document.createElement('button');
        finishButton.className = "btn btn-dark btn-sm";
        finishButton.innerText = "Finish";
        buttonDiv.append(finishButton);

        finishButton.addEventListener("click", function (event) {
            event.preventDefault();
            apiUpdateTask(taskId, taskTitle, taskDescription, 'closed');
            section.querySelectorAll(".opened").forEach(function (el) {
                el.parentElement.removeChild(el);
            })
        })
    }

    const deleteButton = document.createElement('button');
    deleteButton.className = "btn btn-outline-danger btn-sm ml-2";
    deleteButton.innerText = "Delete";
    buttonDiv.append(deleteButton);
    mainDiv.append(buttonDiv);

    deleteButton.addEventListener("click", function (e) {
        e.preventDefault();
        apiDeleteTask(taskId);
        this.parentElement.parentElement.parentElement.remove();
    })

    const ul = document.createElement('ul');
    ul.className = "list-group list-group-flush";
    section.append(ul);

    if (taskStatus === 'open') {
        apiGetOperationListFromTask(taskId).then(function (operations) {
            operations.data.forEach(function (operation) {
                renderOperation(ul, taskStatus, operation.id, operation.description, operation.timeSpent);
            })
        })
    }

    const bodyDiv = document.createElement('div');
    bodyDiv.className = "card-body opened";
    section.append(bodyDiv);

    const form = document.createElement('form');
    bodyDiv.append(form);

    if (taskStatus === 'open') {
        const inputDiv = document.createElement('div');
        inputDiv.className = "input-group";
        form.append(inputDiv);

        const input = document.createElement('input');
        input.setAttribute('type', 'text');
        input.setAttribute('placeholder', 'Operation description');
        input.setAttribute('minlength', '5');
        input.className = "form-control";
        inputDiv.append(input);

        const innerInputDiv = document.createElement('div');
        innerInputDiv.className = "input-group-append";
        inputDiv.append(innerInputDiv);

        const addButton = document.createElement('button');
        addButton.className = "btn btn-info";
        addButton.innerText = "Add";
        innerInputDiv.append(addButton);

        addButton.addEventListener("click", function (event) {
            event.preventDefault();
            const desc = this.parentElement.previousElementSibling.value;
            if (desc.length < 5) {
                showAlert();
            } else {
                apiCreateOperation(taskId, desc).then(function (response) {
                    const operation = response.data;
                    renderOperation(ul, taskStatus, operation.id, operation.description, operation.timeSpent);
                })
                this.parentElement.previousElementSibling.value = "";
            }
        })
    }
}

function renderOperation(ul, taskStatus, operationId, operationDescription, operationTimeSpent) {
    const li = document.createElement('li');
    li.className = "list-group-item d-flex justify-content-between align-items-center";

    const liDiv = document.createElement('div');
    liDiv.innerText = operationDescription;

    const span = document.createElement('span');
    span.className = "badge badge-success badge-pill ml-2";
    span.innerText = formatTime(operationTimeSpent);
    liDiv.append(span);
    li.append(liDiv);

    if (taskStatus === 'open') {

        const liDivButtons = document.createElement('div');
        liDivButtons.className = 'opened';
        const button15min = document.createElement('button');
        button15min.className = "btn btn-outline-success btn-sm mr-2";
        button15min.innerText = "+15m"
        liDivButtons.append(button15min);

        const button60min = document.createElement('button');
        button60min.className = "btn btn-outline-success btn-sm mr-2";
        button60min.innerText = "+60m";
        liDivButtons.append(button60min);

        const deleteButton = document.createElement('button');
        deleteButton.className = "btn btn-outline-danger btn-sm";
        deleteButton.innerText = "Delete";
        liDivButtons.append(deleteButton);
        li.append(liDivButtons);

        button15min.addEventListener("click", function (event) {
            event.preventDefault();
            apiUpdateOperation(operationId, operationDescription, operationTimeSpent + 15).then(
                function (response) {
                    span.innerText = formatTime(response.data.timeSpent);
                    operationTimeSpent = response.data.timeSpent;
                }
            )
        })
        button60min.addEventListener("click", function (event) {
            event.preventDefault();
            apiUpdateOperation(operationId, operationDescription, operationTimeSpent + 60).then(
                function (response) {
                    span.innerText = formatTime(response.data.timeSpent);
                    operationTimeSpent = response.data.timeSpent;
                }
            )
        })
        deleteButton.addEventListener("click", function (event) {
            event.preventDefault();
            apiDeleteOperation(operationId);
            this.parentElement.parentElement.remove();
        })
    }
    ul.append(li);
}

function showAlert() {
    alert("Description should be longer than 5 characters!");
}

function formatTime(timeSpent) {
    const hours = Math.floor(timeSpent / 60);
    const minutes = timeSpent % 60;
    if (hours > 0) {
        return hours + 'h ' + minutes + 'm';
    } else {
        return minutes + 'm';
    }
}
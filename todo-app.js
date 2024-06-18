


(function(){

let mattersArr = [];
    listName = '';


    // создаем и возвращаем заголовок приложения
    function createAppTitle (title) {
        let appTitle = document.createElement('h2')
        appTitle.innerHTML = title;
        return appTitle;
    }

    // создаем и возвращаем форму для создания дела
    function createTodoItemForm () {
        let form = document.createElement('form');
        let input = document.createElement('input');
        let buttonWrapper = document.createElement('div');
        let button = document.createElement('button');


        // Делаем активной кнопку, только если в поле есть данные
        button.disabled = true;
        input.addEventListener('input', function(){
            button.disabled = false;
            if(!input.value) {
                button.disabled = true;
            }
        })

        // Добавляем тексты в элементы
        form.classList.add('input-group', 'mb-3');
        input.classList.add('form-control');
        input.placeholder = 'Введите название нового дела';
        buttonWrapper.classList.add('input-group-append');
        button.classList.add('btn', 'btn-primary');
        button.textContent = 'Добавить дело';

        // Добавляем элементы в DOM
        buttonWrapper.append(button);
        form.append(input);
        form.append(buttonWrapper);

        return {
            form,
            input,
            button,
        };
    }

    // создаем и возвращаем список элементов
    function createTodoList () {
        let list = document.createElement('ul');
        list.classList.add('list-group');
        return list;
    }

    // Функция создания элемента списка(задания) с кнопками
    function createTodoItem(obj) {

        let item = document.createElement('li');

        // Кнопки помещаем в элемент, который красиво покажет их в одной группе
        let buttonGroup = document.createElement('div');
        let doneButton = document.createElement('button');
        let deleteButton = document.createElement('button');

        // Устанавливаем стили для элемента списка, а так же для размещения кнопое
        // в его правой части спомощью flex
        item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');

        // Добавляем содержимое задания через переданный в функцию объект,
        // объект передастся в другой функции при вызове данной функции
        item.textContent = obj.name;

        // Стилизация кнопок
        buttonGroup.classList.add('btn-group', 'btn-group-sm');
        doneButton.classList.add('btn', 'btn-success');
        doneButton.textContent = 'Готово';
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Удалить';

        // Вкладываем кнопки в один элемент, чтобы объединить их в один блок
        buttonGroup.append(doneButton);
        buttonGroup.append(deleteButton);
        item.append(buttonGroup);

        // Работа с true и обработчик кнопки done

        // При перезагрузке будет выделен элемент спомощью класса
        if(obj.done === true) {
            item.classList.toggle('list-group-item-success')
        }

        // При клике меняем класс и меняем свойство done на противоположное
        doneButton.addEventListener('click', function() {
            item.classList.toggle('list-group-item-success')
            obj.done === false ? obj.done = true : obj.done = false;

            // отправляем в хранилище
            todoToStorage(listName, mattersArr)
        })

        deleteButton.addEventListener('click', function() {
            if(confirm('Вы уверены?')) {
                // removeFromMatters (+todoItem.item.id)
                item.remove();
                for(let i = 0; i < mattersArr.length; ++i) {
                    if (mattersArr[i].id === obj.id) {
                        mattersArr.splice(i, 1)
                    }
                }
            }

            // отправляем в хранилище
            todoToStorage(listName, mattersArr)
        })

        // возвращаем объект для следующей функции
        return {
            item
        }
    }


    // Генерируем случайное ID
    function generateID() {
        let genID = Math.floor(Math.random() * 100);
        for (let item of mattersArr) {
            if (item.id === genID) {
                genId = Math.floor(Math.random() * 100);
            }
        }
        return genID;
    }

    //функция для сохранения в local storage
    function todoToStorage(keyname, arr) {
        localStorage.setItem(keyname, JSON.stringify(arr));
    }


    function createTodoApp (container, title = 'Список дел', keyname) {

        let todoAppTitle = createAppTitle(title);
        let todoItemForm = createTodoItemForm();
        let todoList = createTodoList ();

        // Имя списка для хранилища из HTML
        listName = keyname;

        container.append(todoAppTitle);
        container.append(todoItemForm.form);
        container.append(todoList);

        // Восстановление данных в хранилище после перезагрузки
        let dataFromStorage = localStorage.getItem(listName);
            if (dataFromStorage !== null && dataFromStorage !== "") {
              mattersArr = JSON.parse(dataFromStorage);
            } else {
                mattersArr = [];
            }
            for (let item of mattersArr) {
              let todoItem = createTodoItem(item);
              todoList.append(todoItem.item);
            }

        // обработчик формы, для создания задания
        todoItemForm.form.addEventListener('submit', function(e) {
            // Предотвращаем стандартное поведение браузера(перезагрузка)
            e.preventDefault();


         // Игрнорируем создание, если ничего не введено
            if (!todoItemForm.input.value) {

                return;
            }
            // Создаем и добавляем дело
            for(let i = 0; i < mattersArr.length; ++i) {

            }
            let todoNewItem = {
                name: todoItemForm.input.value,
                done: false,
                id: generateID()
            }
            let todoItem = createTodoItem(todoNewItem)
            mattersArr.push(todoNewItem);

            todoToStorage(listName, mattersArr);

            todoList.append(todoItem.item);


            // Обнуляем поле ввода
            todoItemForm.input.value = '';

            // Деактивируем кнопку, так как после нажатия на кнопку в полн не будет данных
            todoItemForm.button.disabled = "true"
        })
    }

    window.createTodoApp = createTodoApp;
})()


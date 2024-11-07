$(document).ready(function () {
    const projectsCache = {};

    // Загрузка проектов в выпадающий список для создания задачи
    function loadProjectsIntoSelect() {
        $.ajax({
            url: 'http://prj-backend/getprojects',
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                $('#projectSelect').empty();
                data.forEach(function (project) {
                    $('#projectSelect').append(`<option value="${project.id}">${project.title}</option>`);
                });
            },
            error: function (xhr, status, error) {
                console.log('Ошибка при загрузке проектов:', error);
            }
        });
    }

    function loadProjectsIntoEditSelect() {
        $.ajax({
            url: 'http://prj-backend/getprojects',
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                $('#editTaskProject').empty();
                data.forEach(function (project) {
                    $('#editTaskProject').append(`<option value="${project.id}">${project.title}</option>`);
                });
            },
            error: function (xhr, status, error) {
                console.log('Ошибка при загрузке проектов:', error);
            }
        });
    }

    // Кэширование проектов для быстрого доступа
    function loadProjectsIntoCache() {
        return $.ajax({
            url: 'http://prj-backend/getprojects',
            method: 'GET',
            success: function (data) {
                data.forEach(project => {
                    projectsCache[project.id] = project.title;
                });
            },
            error: function () {
                console.error('Ошибка при загрузке проектов');
            }
        });
    }

    // Форматирование даты
    function formatDate(dateString) {
        const date = new Date(dateString);
        return `${('0' + date.getDate()).slice(-2)}.${('0' + (date.getMonth() + 1)).slice(-2)}.${date.getFullYear()}`;
    }


    // Загрузка задач с сервера
    function loadTasks(filters = {}) {
        $.ajax({
            url: 'http://prj-backend/tasks',
            method: 'GET',
            success: function (data) {
                const filteredTasks = data.filter(task => {
                    const matchesStatus = filters.status ? task.status === filters.status : true;
                    const matchesPriority = filters.priority ? task.priority === filters.priority : true;
                    return matchesStatus && matchesPriority; // Применяем оба фильтра
                });

                displayTasks(filteredTasks);
            },
            error: function (xhr, status, error) {
                console.error('Ошибка при загрузке задач:', error);
            }
        });
    }

    // Функция отображения задач
    function displayTasks(tasks) {
        const tasksContainer = $('.tasks__list');
        tasksContainer.empty();

        tasks.forEach(function (task) {
            const projectTitle = projectsCache[task.project_id] || 'Неизвестный проект';
            let editButton = '';
            let deleteButton = '';

            // Проверяем статус задачи и назначаем соответствующие кнопки
            if (task.status !== 'Назначена') {
                editButton = '';
                deleteButton = '';
            } else {
                deleteButton = `<button class="btn btn-danger delete-task" data-id="${task.id}">Удалить</button>`;
            }


            const taskCard = `
                <div class="task-card">
                    <h3>Название: ${task.title}</h3>
                    <p>Описание: ${task.description}</p>
                    <p>Приоритет: ${task.priority}</p>
                    <p>Статус: ${task.status}</p>
                    <p>Дней осталось: ${task.days_left}</p>
                    <p>Дата начала: ${formatDate(task.start_date)}</p>
                    <p>Дата окончания: ${formatDate(task.end_date)}</p>
                    <p>Проект: ${projectTitle}</p>
                    ${editButton}
                    ${deleteButton}
                </div>
            `;
            tasksContainer.append(taskCard);
        });
    }


    // Привязка событий к кнопкам задач
    function attachTaskActions() {

        $(document).on('click', '.delete-task', function () {
            const taskId = $(this).data('id');
            deleteTask(taskId);
        });
    }

    // Привязываем события для фильтров по приоритету
    $('.filter-btn').on('click', function () {
        const priority = $(this).data('priority');

        const filters = {
            priority: priority || null,
        };

        loadTasks(filters);
    });

    $('.status-filter-btn').on('click', function () {
        const status = $(this).data('status');

        const filters = {
            status: status || null,
        };

        loadTasks(filters);
    });

    // Функция для удаления задачи
    function deleteTask(taskId) {
        if (confirm('Вы уверены, что хотите удалить эту задачу?')) {
            $.ajax({
                url: `http://prj-backend/tasks/${taskId}`,
                method: 'DELETE',
                success: function () {
                    loadTasks();
                },
                error: function (xhr, status, error) {
                    console.log('Ошибка при удалении задачи:', error);
                }
            });
        }
    }

    // Инициализация
    loadProjectsIntoCache().then(() => {
        loadTasks();
    });

    attachTaskActions();
});

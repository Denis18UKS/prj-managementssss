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

    // Функция отображения задач
    function displayTasks(tasks) {
        const tasksContainer = $('.tasks__list');
        tasksContainer.empty();

        tasks.forEach(function (task) {
            const projectTitle = projectsCache[task.project_id] || 'Неизвестный проект';
            const deleteButton = task.status === 'Завершена' ? '' : `<button class="btn btn-danger delete-task" data-id="${task.id}">Удалить</button>`;

            const taskCard = `
                <div class="task-card">
                    <h3>${task.title}</h3>
                    <p>${task.description}</p>
                    <p>Приоритет: ${task.priority}</p>
                    <p>Статус: ${task.status}</p>
                    <p>Дней осталось: ${task.days_left}</p>
                    <p>Дата начала: ${formatDate(task.start_date)}</p>
                    <p>Дата окончания: ${formatDate(task.end_date)}</p>
                    <p>Проект: ${projectTitle}</p>
                    ${deleteButton}
                </div>
            `;
            tasksContainer.append(taskCard);
        });
    }

    // Загрузка задач с сервера
    function loadTasks() {
        $.ajax({
            url: 'http://prj-backend/tasks',
            method: 'GET',
            success: function (data) {
                displayTasks(data);
            },
            error: function (xhr, status, error) {
                console.error('Ошибка при загрузке задач:', error);
            }
        });
    }

    function attachTaskActions() {
        $(document).on('click', '.delete-task', function () {
            const taskId = $(this).data('id');
            deleteTask(taskId);
        });
    }

    // Открытие модального окна для создания задачи
    $('#createTaskBtn').click(function () {
        $('#createTaskModal').show();
        $('#taskName').val('');
        loadProjectsIntoSelect();
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

    $('#closeTaskModal, #closeEditTaskModal').click(function () {
        $(this).closest('.modal').hide();
    });
});

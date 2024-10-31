$(document).ready(function () {

    loadProjectsIntoCache();
    loadTasks();

    let projectsCache = {};

    function loadProjectsIntoCache() {
        $.ajax({
            url: 'http://prj-backend/getprojects',
            method: 'GET',
            success: function (data) {
                data.forEach(project => {
                    projectsCache[project.id] = project.title; // Кэшируем проекты в объект
                });
            },
            error: function () {
                console.error('Ошибка при загрузке проектов');
            }
        });
    }

    function getProjectNameById(projectId) {
        return projectsCache[projectId];
    }

    function loadTasks() {
        $.ajax({
            url: 'http://prj-backend/tasks',
            method: 'GET',
            success: function (data) {
                const taskList = $('#taskList');
                taskList.empty();

                data.forEach(task => {
                    const projectName = getProjectNameById(task.project_id);
                    const taskActions = task.status === 'Завершена' ? '' : `
                        <div class="task-actions">
                            <button class="btn btn-warning start-task" data-id="${task.id}">Начать выполнение</button>
                            <button class="btn btn-danger finish-task" data-id="${task.id}">Завершить</button>
                        </div>
                    `;

                    const taskCard = `
                        <div class="task-card" data-id="${task.id}">
                            <div class="task-title">Название: ${task.title}</div>
                            <div class="task-description">Описание: ${task.description}</div>
                            <div class="task-project"><h6>Проект: ${projectName || 'Неизвестный проект'}</h6></div>
                            <div class="task-status"><strong>Статус:</strong> ${task.status}</div>
                            <div class="task-dates">
                                Дата начала: ${task.start_date || 'N/A'}<br>
                                Дата окончания: ${task.end_date || 'N/A'}<br>
                                Осталось дней: ${task.days_left ?? 'N/A'}
                            </div>
                            ${taskActions}
                        </div>
                    `;
                    taskList.append(taskCard);
                });

                // Привязываем действия к кнопкам
                $('.start-task').on('click', function () {
                    updateTaskStatus($(this).data('id'), 'Выполняется');
                });

                $('.finish-task').on('click', function () {
                    updateTaskStatus($(this).data('id'), 'Завершена');
                });
            },
            error: function (xhr, status, error) {
                console.error('Ошибка при загрузке задач:', error);
            }
        });
    }

    function updateTaskStatus(taskId, newStatus) {
        $.ajax({
            url: `http://prj-backend/tasks/${taskId}/status`,
            method: 'PATCH',
            data: { status: newStatus },
            success: function (response) {
                alert(response.message);
                loadTasks(); // Перезагружаем задачи, чтобы отобразить обновленные данные
            },
            error: function (xhr, status, error) {
                console.error('Ошибка при обновлении статуса задачи:', error);
            }
        });
    }

});

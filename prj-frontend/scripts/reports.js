$(document).ready(function () {
    const projectsCache = {};
    const managersCache = {};
    const executorsCache = {};
    const tasksCache = {};
    let completedTasksCount = 0;
    let incompleteTasksCount = 0;

    function loadProjectsIntoCache() {
        return $.ajax({
            url: 'http://prj-backend/getprojects',
            method: 'GET',
            success: function (data) {
                data.forEach(project => {
                    projectsCache[project.id_projects] = { title: project.title, taskCount: 0 };
                });
            },
            error: function () {
                console.error('Ошибка при загрузке проектов');
            }
        });
    }

    function loadTasksIntoCache() {
        return $.ajax({
            url: 'http://prj-backend/gettasks',
            method: 'GET',
            success: function (data) {
                data.forEach(task => {
                    tasksCache[task.id_tasks] = task;

                    if (task.project_id) {
                        if (!projectsCache[task.project_id]) {
                            projectsCache[task.project_id] = { title: 'Неизвестный проект', taskCount: 0 };
                        }
                        projectsCache[task.project_id].taskCount++;
                    } else {
                        console.warn('Task without project_id:', task);
                        // Обработка задачи без project_id, например, добавление в отдельный список
                    }
                });
            },
            error: function () {
                console.error('Ошибка при загрузке задач');
            }
        });
    }


    function loadManagersIntoCache() {
        return $.ajax({
            url: 'http://prj-backend/managers',
            method: 'GET',
            success: function (data) {
                data.forEach(manager => {
                    managersCache[manager.id] = manager.name;
                });
            },
            error: function () {
                console.error('Ошибка при загрузке менеджеров');
            }
        });
    }

    function loadExecutorsIntoCache() {
        return $.ajax({
            url: 'http://prj-backend/executors',
            method: 'GET',
            success: function (data) {
                data.forEach(executor => {
                    executorsCache[executor.id] = executor.name;
                });
            },
            error: function () {
                console.error('Ошибка при загрузке исполнителей');
            }
        });
    }

    function loadReports(searchTerm = '', statusFilter = 'all') {
        $.ajax({
            url: 'http://prj-backend/reports',
            type: 'GET',
            data: { search: searchTerm, status: statusFilter },
            dataType: 'json',
            success: function (data) {
                renderReports(data, statusFilter);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error('Ошибка при загрузке отчетов:', textStatus, errorThrown);
                alert('Не удалось загрузить отчеты. Попробуйте еще раз позже.');
            }
        });
    }

    function renderReports(reports, statusFilter) {
        const reportsContainer = $('.reports__cards');
        reportsContainer.empty();

        if (reports.length === 0) {
            reportsContainer.append('<div class="no-reports">Нет доступных отчетов.</div>');
            return;
        }

        reports.forEach(report => {
            const projectTitle = projectsCache[report.project_id]?.title || 'Не указано';
            const task = tasksCache[report.id_tasks] || { title: 'Не указано', status: 'Неизвестен' };
            const taskCount = projectsCache[report.project_id]?.taskCount || 0;
            const managerName = managersCache[report.maintainer_id] || 'Не указано';
            const executorName = executorsCache[report.executor_id] || 'Не указано';
            const remainingDays = report.remaining_days || 'Не указано';
            const status = report.status || 'Не указан';

            // Проверка фильтрации статуса
            if (statusFilter !== 'all' && task.status !== statusFilter) {
                return; // Пропуск задачи, если она не соответствует фильтру
            }

            const reportCard = `
                <div class="reports__card">
                    <div class="projects__card-title">Отчёт № ${report.id}</div>
                    <div class="projects__card-manager">Проект: ${projectTitle} (Задач: ${taskCount})</div>
                    <div class="projects__card-task">Задача: ${task.title}</div>
                    <div class="projects__card-managers">Руководитель: ${managerName}</div>
                    <div class="projects__card-executor">Исполнитель: ${executorName}</div>
                    <div class="projects__card-time">Осталось: <span class="tasks__card-time-value">${remainingDays}</span> д</div>
                    <div class="projects__card-status">Статус: ${status}</div>
                </div>
            `;
            reportsContainer.append(reportCard);
        });

        // Вывод статистики задач
        $('.tasks__count').text(`Всего задач: ${Object.keys(tasksCache).length}`);
        $('.tasks__completed-count').text(`Завершено: ${completedTasksCount}`);
        $('.tasks__incomplete-count').text(`Не завершено: ${incompleteTasksCount}`);
    }

    Promise.all([
        loadProjectsIntoCache(),
        loadManagersIntoCache(),
        loadExecutorsIntoCache(),
        loadTasksIntoCache()
    ]).then(() => {
        loadReports();
    });

    $('.filter__search').on('submit', function (e) {
        e.preventDefault();
        const searchTerm = $(this).find('input[name="search"]').val();
        loadReports(searchTerm);
    });

    $('.filter__status').on('change', function () {
        const statusFilter = $(this).val();
        loadReports('', statusFilter);
    });
});

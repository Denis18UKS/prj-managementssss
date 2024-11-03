$(document).ready(function () {
    const projectsCache = {};
    const managersCache = {};
    const executorsCache = {};
    const tasksCache = {};

    function loadProjectsIntoCache() {
        return $.ajax({
            url: 'http://prj-backend/getprojects',
            method: 'GET',
            success: function (data) {
                data.forEach(project => {
                    projectsCache[project.id] = project.title;
                });
                console.log('Projects Cache:', projectsCache); // Логирование кэша проектов
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
                    tasksCache[task.id] = task.title;
                });
                console.log('Tasks Cache:', tasksCache); // Логирование кэша задач
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
                console.log('Managers Cache:', managersCache);
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
                console.log('Executors Cache:', executorsCache);
            },
            error: function () {
                console.error('Ошибка при загрузке исполнителей');
            }
        });
    }

    function loadReports(searchTerm = '') {
        $.ajax({
            url: 'http://prj-backend/reports',
            type: 'GET',
            data: { search: searchTerm },
            dataType: 'json',
            success: function (data) {
                console.log('Reports Data:', data); // Логирование полученных отчетов
                renderReports(data); // Отображаем отчеты
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.error('Ошибка при загрузке отчетов:', textStatus, errorThrown);
                alert('Не удалось загрузить отчеты. Попробуйте еще раз позже.');
            }
        });
    }

    function renderReports(reports) {
        const reportsContainer = $('.reports__cards');
        reportsContainer.empty();

        if (reports.length === 0) {
            reportsContainer.append('<div class="no-reports">Нет доступных отчетов.</div>');
            return;
        }

        reports.forEach(report => {
            console.log('Report Data:', report); // Логирование отчета для проверки данных

            const projectTitle = projectsCache[report.project_id] || 'Не указано';
            const taskTitle = tasksCache[report.task_id] || 'Не указано';
            const managerName = managersCache[report.maintainer_id] || 'Не указано';
            const executorName = executorsCache[report.executor_id] || 'Не указано';
            const remainingDays = report.remaining_days || 'Не указано';
            const status = report.status || 'Не указан';

            const reportCard = `
                <div class="reports__card">
                    <div class="projects__card-title">Отчёт № ${report.id}</div>
                    <div class="projects__card-manager">Проект: ${projectTitle}</div>
                    <div class="projects__card-task">Задача: ${taskTitle}</div>
                    <div class="projects__card-managers">Руководитель: ${managerName}</div>
                    <div class="projects__card-executor">Исполнитель: ${executorName}</div>
                    <div class="projects__card-time">Осталось: <span class="tasks__card-time-value">${remainingDays}</span> д</div>
                    <div class="projects__card-status">Статус: ${status}</div>
                </div>
            `;
            reportsContainer.append(reportCard);
        });
    }

    Promise.all([
        loadProjectsIntoCache(),
        loadManagersIntoCache(),
        loadExecutorsIntoCache(),
        loadTasksIntoCache()
    ]).then(() => {
        loadReports(); // Загружаем отчеты после загрузки данных
    });

    $('.filter__search').on('submit', function (e) {
        e.preventDefault();
        const searchTerm = $(this).find('input[name="search"]').val();
        loadReports(searchTerm);
    });
});

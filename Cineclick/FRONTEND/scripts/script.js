document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('confirmLogoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            window.location.href = 'PW_LogIn.html';
        });
    }

    function toggleTaskCompletion(event) {
        const checkbox = event.target;
        if (!checkbox.classList.contains('task-check')) return;

        const taskId = checkbox.getAttribute('data-task-id');
        const taskTitle = document.getElementById(taskId);
        if (!taskTitle) return;

        if (checkbox.checked) {
            taskTitle.style.textDecoration = 'line-through';
            taskTitle.style.color = 'gray';
        } else {
            taskTitle.style.textDecoration = 'none';
            taskTitle.style.color = 'inherit';
        }
    }

    document.body.addEventListener('change', toggleTaskCompletion);
});

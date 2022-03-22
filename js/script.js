window.addEventListener('DOMContentLoaded', () => {
  // Theme Swtitcher
  const themeSwitchers = document.querySelectorAll('.theme-link');

  themeSwitchers.forEach(switcher => {
    switcher.addEventListener('click', (event) => {
      const themeUrl = `css/theme-${event.target.dataset.theme}.css`;

      document.querySelector('[title="theme"]')
        .setAttribute('href', themeUrl);
    });
  });

  // Add new task
  const input = document.getElementById('input'),
        checkboxInput = document.querySelector('.checkbox'),
        tasksContainer = document.querySelector('.tasks'),
        filterBtns = document.querySelectorAll('.filter-btn'); 
  
  let deleteButtons = document.querySelectorAll('.cross'),
      taskCount = tasksContainer.querySelectorAll('.checkbox');


  input.addEventListener('keydown', (event) => {
    if (event.keyCode === 13 && input.value) {
      addTask(input.value);
    }
  });

  checkboxInput.addEventListener('click', () => {
    if (checkboxInput.checked && input.value) {
      addTask(input.value);
      checkboxInput.checked = false;
    }
  });

  function addTask(taskValue) {
    const newTask = `
      <div class="task">
        <label class="task-inner">
          <input class="checkbox" type="checkbox">
          <span class="fake">
            <svg class="mark" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="red"><path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/></svg>
          </span>
          <p class="task-text">${taskValue}</p>
        </label>
        <span class="cross"></span>
      </div>
    `;
    tasksContainer.insertAdjacentHTML('beforeend', newTask);
    input.value = '';
    updateTask();
    removeTask();
    updateActiveClass(filterBtns[0]);
  }

  // Remove task

  function removeTask() {
    deleteButtons.forEach(btn => {
      btn.addEventListener('click', (event) => {
        event.target.closest('.task').remove();
        updateTask();
      });
    });
  }

  // Task count
  function setTaskCount() {
    taskCount.forEach(task => {
      task.addEventListener('click', updateTask);
    });

    let count = 0;

    taskCount.forEach(task => {
      if (!task.checked) {
        count++;
      }
    document.querySelector('.count').textContent = count;
    });
  }

  // Clear compleated
  const clearBtn = document.querySelector('.task-clear');

  clearBtn.addEventListener('click', () => {
    taskCount.forEach(task => {
      if (task.checked) {
        task.closest('.task').remove();
        updateTask();
      }
    });
  });

  // Filters
  let aciveBtn = null,
      completedBtn = null,
      allBtn = null;

  if (document.querySelector('.task-footer').style.display === 'none') {
    aciveBtn = document.getElementById('active-mobile');
    completedBtn = document.getElementById('completed-mobile');
    allBtn = document.getElementById('all-mobile');
  } else {
    aciveBtn = document.getElementById('active-mobile');
    completedBtn = document.getElementById('completed-mobile');
    allBtn = document.getElementById('all-mobile');
  }
  // 1.Active

  aciveBtn.addEventListener('click', (event) => {
    taskCount.forEach(task => {
      if (task.checked) {
        task.closest('.task').style.display = "none";
      } else {
        task.closest('.task').style.display = "block";
      }
    });
    updateActiveClass(event.target);
  });

  // 2.Compleated

  completedBtn.addEventListener('click', (event) => {
    taskCount.forEach(task => {
      if (!task.checked) {
        task.closest('.task').style.display = "none";
      } else {
        task.closest('.task').style.display = "block";
      }
    });
    updateActiveClass(event.target);
  });

  // 3.All

  allBtn.addEventListener('click', (event) => {
    taskCount.forEach(task => {
      task.closest('.task').style.display = "block";
    });
    updateActiveClass(event.target);
  });

  // Update task
  function updateTask() {
    deleteButtons = document.querySelectorAll('.cross');
    taskCount = tasksContainer.querySelectorAll('.checkbox');
    setTaskCount();
  }

  // Update active class
  function updateActiveClass(elem) {
    filterBtns.forEach(btn => {
      btn.classList.remove('filter-btn_active');
    });
    elem.classList.add('filter-btn_active');
  }

  // Starting position
  setTaskCount();
  removeTask();
});
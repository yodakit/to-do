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

  // Variables
  const input = document.getElementById('input'),
        checkboxInput = document.getElementById('checkboxInput'),
        tasksContainer = document.querySelector('.tasks'),
        filterBtns = document.querySelectorAll('.filter-btn'),
        countTask = document.getElementById('count'),
        subtitle = document.querySelector('.subtitle');
        
  let footer = document.querySelector('.footer-mobile'),
      footerDesctop = document.querySelector('.task-footer');
  
  let taskList = JSON.parse(localStorage.getItem('tasks')) || [];
  
  let allBtn, activeBtn, completedBtn;

  // Functions

  // counting and setting count task
  const setTaskCount = () => {
    let count = 0;
    if (taskList.length) {
      count = taskList.reduce((acc, task) => acc + Number(!task.checkStatus), 0);
    } 
    countTask.innerText = count;

    (!count && taskList.length)
      ? showFooter(taskList.length)
      : showFooter(count);
  };

  // add and render new task
  const addTask = (taskValue, idTask = Date.now(), checkStatus = false, dataStorage = false) => {
    const newTask = `
        <div data-id=[${idTask}] class="task">
          <label class="task-inner">
            <input ${checkStatus ? 'checked' : ''} class="checkbox" type="checkbox">
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

      if (!dataStorage) {
        taskList.push({taskValue, checkStatus, id: idTask});
        localStorage.tasks = JSON.stringify(taskList);
      }

      setTaskCount();
  };

  // remove task
  const removeTask = (idTask) => {
    document.querySelector(`[data-id="[${idTask}]"]`).remove();

    taskList = taskList.filter(task => task.id !== idTask);

    localStorage.tasks = JSON.stringify(taskList);

    setTaskCount();
  };
  
  // update check status task
  const updateCheckTask = (idTask) => {
    taskList.forEach(task => {
      if (task.id === idTask) {
        task.checkStatus = !task.checkStatus;
      }
    });

    localStorage.tasks = JSON.stringify(taskList);

    setTaskCount();
  };

  // display footer and footer-mobile
  const showFooter = (count) => {
    if (count) {
      footer.style.display = 'flex';
      footerDesctop.style.display = 'flex';
      subtitle.style.display = 'block';
    } else {
      footer.style.display = 'none';
      footerDesctop.style.display = 'none';
      subtitle.style.display = 'none';
    }
  };

  // filtered tasks
  const filteredTasks = (filter = null) => {
    taskList.forEach(task => {
      if (filter === null) {
        tasksContainer.querySelector(`[data-id="[${task.id}]"]`).style.display = 'block';
      } else if (task.checkStatus === filter) {
        tasksContainer.querySelector(`[data-id="[${task.id}]"]`).style.display = 'block';
      } else {
        tasksContainer.querySelector(`[data-id="[${task.id}]"]`).style.display = 'none';
      }
    });
  };

  // set active filter button 
  const setActiveFilter = (filterActive) => {
    filterBtns.forEach(btn => {
      btn.classList.remove('filter-btn_active');
    });
    filterActive.classList.add('filter-btn_active');
  };

  // Start position
  if (window.getComputedStyle(footer).display === 'none') {
    allBtn = filterBtns[0];
    activeBtn = filterBtns[1];
    completedBtn = filterBtns[2];
    footer = footerDesctop;
  } else {
    allBtn = filterBtns[3];
    activeBtn = filterBtns[4];
    completedBtn = filterBtns[5];
  }

  taskList.forEach(task => addTask(task.taskValue, task.id, task.checkStatus, true));
  setTaskCount();

  // Add new task
  input.addEventListener('keydown', (event) => {
    if (event.keyCode === 13 && input.value) {
      event.preventDefault();
      addTask(input.value);
      setTaskCount();
      filteredTasks();
      setActiveFilter(allBtn);
    }
  });
  
  checkboxInput.addEventListener('click', () => {
    if (checkboxInput.checked && input.value) {
      checkboxInput.checked = false;
      addTask(input.value);
      filteredTasks();
      setActiveFilter(allBtn);
    }
  });
  
  // Remove task and Update check
  tasksContainer.addEventListener('click', (event) => {
    const target = event.target,
    idTask = +target.closest('.task').dataset.id.replace(/\D/g, '');
    
    if (target.className === 'cross') {
      removeTask(idTask);
    }
    
    if (target.className === 'checkbox') {
      updateCheckTask(idTask);
    }
  });

  // Clear compleated
  const clearBtn = document.querySelector('.task-clear');

  clearBtn.addEventListener('click', () => {
    taskList.forEach(task => {
      if (task.checkStatus) {
        removeTask(task.id);
      }
    });
  });

  // Filters
  allBtn.addEventListener('click', (event) => {
    filteredTasks();
    setActiveFilter(event.target);
  });
  
  activeBtn.addEventListener('click', (event) => {
    filteredTasks(false);
    setActiveFilter(event.target);
  });
  
  completedBtn.addEventListener('click', (event) => {
    filteredTasks(true);
    setActiveFilter(event.target);
  });
});  

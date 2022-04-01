window.addEventListener('DOMContentLoaded', () => {
  // Variables
  const themeSwitchers = document.querySelectorAll('.theme-link'),
        input = document.getElementById('input'),
        checkboxInput = document.getElementById('checkboxInput'),
        tasksContainer = document.querySelector('.tasks'),
        filterBtns = document.querySelectorAll('.filter-btn'),
        countTask = document.getElementById('count'),
        subtitle = document.querySelector('.subtitle'),
        startThemeName = localStorage.getItem('theme') || 'light',
        themeStyleCss = document.querySelector('[title="theme"]');
  
  let footer = document.querySelector('.footer-mobile'),
      footerDesctop = document.querySelector('.task-footer');
      
  let taskList = JSON.parse(localStorage.getItem('tasks')) || [];
  
  let allBtn, activeBtn, completedBtn;
  
  let prevFirstTaskId;
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

  // fixing the border radius of the first task

  const fixBorderRadius = () => {
    if (taskList.length) {
      document.querySelector(`[data-id="[${prevFirstTaskId}]"]`)?.classList.remove('task-first');
      document.querySelector(`[data-id="[${taskList[0].id}]"]`).classList.add('task-first');

      prevFirstTaskId = taskList[0].id;
    }
  };  

  // add and render new task
  const addTask = (taskValue, idTask = Date.now(), checkStatus = false, dataStorage = false) => {
    const newTask = `
        <li class="task-wrapper">
          <div data-id=[${idTask}] class="task" draggable="true">
            <label class="task-inner">
              <input ${checkStatus ? 'checked' : ''} class="checkbox" type="checkbox">
              <span class="fake">
                <svg class="mark" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="red"><path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/></svg>
              </span>
              <p class="task-text">${taskValue}</p>
            </label>
            <span class="cross"></span>
          </div>
        </li>
      `;
    tasksContainer.insertAdjacentHTML('beforeend', newTask);
    input.value = '';

    if (!dataStorage) {
      taskList.push({taskValue, checkStatus, id: idTask});
      localStorage.tasks = JSON.stringify(taskList);
    }

    fixBorderRadius();
    setTaskCount();

    addDragAndDrop();
  };
    
  // remove task
  const removeTask = (idTask) => {
    document.querySelector(`[data-id="[${idTask}]"]`).parentElement.remove();
    
    taskList = taskList.filter(task => task.id !== idTask);
    localStorage.tasks = JSON.stringify(taskList);
    
    fixBorderRadius();
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
  // mobile or desctop settings
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

  // theme switcher start
  themeStyleCss.setAttribute('href', `css/theme-${startThemeName}.css`); 

  themeSwitchers.forEach(switcher => {
    switcher.addEventListener('click', (event) => {
      const themeUrl = `css/theme-${event.target.dataset.theme}.css`;
      themeStyleCss.setAttribute('href', themeUrl);
      localStorage.setItem('theme', event.target.dataset.theme);
      console.log(startThemeName);
    });
  });
  

  // task from local storage
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
    idTask = +target.closest('.task').dataset?.id.replace(/\D/g, '');
    
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

  // Drag and drop 
  let dragStartIndex;

  function addDragAndDrop() {
    const draggables = document.querySelectorAll('.task'),
          dragItems = tasksContainer.querySelectorAll('.task-wrapper');

    draggables.forEach(draggable => {
      draggable.addEventListener('dragstart', dragStart);
    });

    dragItems.forEach(dragItem => {
      dragItem.addEventListener('dragover', dragOver);
      dragItem.addEventListener('drop', dragDrop);
      dragItem.addEventListener('dragenter', dragEnter);
      dragItem.addEventListener('dragleave', dragLeave);
    });
  }

  // Drag start
  function dragStart() {
    dragStartIndex = +this.dataset.id.replace(/\D/g, '');
  }

  // Drag enter 
  function dragEnter() {
    this.firstElementChild.classList.add('over');
  }
  
  // Drag leave
  function dragLeave() {
    this.firstElementChild.classList.remove('over');
  }

  // Drag over
  function dragOver(event) {
    event.preventDefault();
  }

  // Drag drop
  function dragDrop(event) {
    const dragEndIndex = +event.target.dataset.id.replace(/\D/g, '');
    event.target.classList.remove('over');

    swapItems(dragStartIndex, dragEndIndex);
    fixBorderRadius();
  }

  // Swap Items
  function swapItems(fromIndex, toIndex) {
    const itemOne = tasksContainer.querySelector(`[data-id="[${fromIndex}]"]`);
    const itemTwo = tasksContainer.querySelector(`[data-id="[${toIndex}]"]`);
    const parentItemOne = itemOne.parentElement;
    const parentItemTwo = itemTwo.parentElement;

    itemOne.remove();
    itemTwo.remove();

    parentItemOne.append(itemTwo);
    parentItemTwo.append(itemOne);

    // save to local storage
    saveSwapItems(fromIndex, toIndex);
  }

  function saveSwapItems(fromIndex, toIndex) {
    let j = taskList.length - 1;
    for (let i = 0; i < taskList.length;) {
      if (taskList[i].id === fromIndex) {
        if (taskList[j].id === toIndex) {
          [taskList[i], taskList[j]] = [taskList[j], taskList[i]];
          break;
        } else {
          j--;
        }
      } else {
        i++;
      }
    }
    localStorage.tasks = JSON.stringify(taskList);
  }
});  


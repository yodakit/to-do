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

  // Task count
  function setTaskCount() {
    const taskCount = document.querySelectorAll('.task').length;
    document.querySelector('.count').textContent = taskCount;    
  }

  // Add new task
  const input = document.getElementById('input'),
        checkboxInput = document.querySelector('.checkbox'),
        tasksContainer = document.querySelector('.tasks');



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
    removeTask();
    setTaskCount();
  }

  // Remove task
  function removeTask() {
    const deleteButtons = document.querySelectorAll('.cross');

    deleteButtons.forEach(btn => {
      btn.addEventListener('click', (event) => {
        if (event.target.parentElement.className === 'task') {
          event.target.parentElement.remove();
          setTaskCount();
        }
      });
    });
  }

  // Clear Compleated
  // const clearBtn = document.querySelector('.task-clear');

  // clearBtn.addEventListener('click', clearCompleated());

  // function clearCompleated() {
  //   const checkboxes = tasksContainer.querySelectorAll('.checkbox');

  //   checkboxes.forEach(checkbox => {
  //     console.log('no');
  //     if (checkbox.checked) {
  //       console.log('yes');
  //     }
  //   });
  // }

  // Starting position
  setTaskCount();
  removeTask();
});
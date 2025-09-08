console.log("script.js loaded");

const addBtn = document.querySelector("#addBtn");
const taskInput = document.querySelector("#taskInput");
const taskList = document.querySelector("#taskList");
const filterEl = document.querySelector(".filters");
const addError = document.querySelector("addError");

let currentFilter = localStorage.getItem("filter") || "all";

function addTask(task) {
  const {text,done = false} =
   typeof task === "string" ? {text: task, done: false } : task;

  const li = document.createElement("li");
  if (done) li.classList.add("done");

  const toggle = document.createElement("input");
  toggle.type = "checkbox";
  toggle.className ="toggle";
  toggle.checked = done;
  toggle.addEventListener("change" , () => {
    li.classList.toggle("done" , toggle.checked);
    saveTasks();
    applyFilter();
  });
  const span = document.createElement("span");
  span.className = "text";
  span.textContent = text;

  const del = document.createElement("button");
  del.type = "button";
  del.className = "del";
  del.textContent = "✖";
  del.addEventListener("click", () => {
    taskList.removeChild(li);
    saveTasks();
  });

  //編集
  const edit =document.createElement("button");
  edit.type = "button";
  edit.className = "edit";
  edit.textContent = "編集";
  edit.addEventListener("click", () => {
    if (li.querySelector("input[type='text']")) {
      return;
    }
    const textEl =li.querySelector(".text");
    const oldText =textEl.textContent;

    const input =document.createElement("input");
    input.type = "text";
    input.value = oldText;

    textEl.replaceWith(input);
    li.classList.add("editing");

    input.focus();
    input.setSelectionRange(0, input.value.length);

  const finalize = (newText, { cancel = false} = {}) => {
    if (!input.isConnected) return; 
    const span = document.createElement("span");
    span.className = "text";
    const next = cancel ? oldText : (newText.trim() || oldText);
    
    span.textContent = next;
    input.replaceWith(span);

    li.classList.remove("editing");

    if(!cancel) {
      saveTasks();
      applyFilter();
    }
  };
  
  input.addEventListener("keydown", (e) => {
    if(e.key === "Enter") finalize(input.value);
    if(e.key === "Escape") finalize(oldText, { cancel:true});   
  });

  input.addEventListener("blur", () => finalize(input.value));
  });

  li.append(toggle, span, edit, del);
  taskList.appendChild(li);
}

function saveTasks() {
  const tasks = [...taskList.querySelectorAll("li")].map(li => {
    const text = li.querySelector(".text").textContent;
    const done = li.classList.contains("done");
    return { text, done };
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  updateCount();
}

function loadTasks() {
  try {
    const raw = localStorage.getItem("tasks");
    const tasks = raw ? JSON.parse(raw) : [];
    tasks.forEach(addTask);
  } catch (e) {
    console.error("failed to parse tasks:", e);
    localStorage.removeItem("tasks");
  }
}

function handleAdd() {
  const text = taskInput.value.trim();
  if (!text) return;
  addTask({text, done: false });
  saveTasks();
  taskInput.value = "";
  taskInput.focus();
  applyFilter();
}

function applyFilter() {
  [...taskList.children].forEach(li => {
   const done = li.classList.contains("done");
   const show =
     currentFilter === "all" ||
     (currentFilter === "done" && done) ||
     (currentFilter === "active" && !done);
   li.style.display = show ? "" : "none";
  });

  if (filterEl) {
    filterEl.querySelectorAll(".filter").forEach((btn) => {
     const on = btn.dataset.filter === currentFilter;
     btn.classList.toggle("active", on);
     btn.setAttribute("aria-pressed" , String(on));
    }); 
  }

  updateCount()
}

function showAddError(msg) {
  if (addError) {
    addError.textContent =msg;
  }
  taskInput.classList.add("shake");
  setTimeout(() => taskInput.classList.remove("shake"), 300);
}
function clearAddError() {
  if (addError) addError.textContent = "";
}

function handleAdd() {
  const text = taskInput.value.replace(/\s+/g, " ").trim();
  if (!text) {
    showAddError("空白だけのタスクは追加できません");
    taskInput.focus();
    return;
  }
  clearAddError();
  addTask({ text, done: false });
  saveTasks();
  taskInput.value="";
  taskInput.focus();
  applyFilter();
};

taskInput.addEventListener("input",clearAddError);

function updateCount() {
  let left = 0;
  for (const li of taskList.children) {
    if (!li.classList.contains("done")) {
      left++;
    }
  }
  const counterEl = document.getElementById("counter");
  if (counterEl) {
    counterEl.textContent = `未完了: ${left}件`;
  }
}

addBtn?.addEventListener("click", handleAdd);

taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    handleAdd();
  }
});

filterEl?.addEventListener("click" , (e) => {
  const btn = e.target.closest(".filter");
  if(!btn) return;
  currentFilter = btn.dataset.filter;
  localStorage.setItem("filter" , currentFilter);
  applyFilter();
});

filterEl?.querySelectorAll(".filter").forEach(btn => {
  const on = btn.dataset.filter === currentFilter;
  btn.classList.toggle("active" , on);
  btn.setAttribute("aria-preaaed" , on);
});

loadTasks();
applyFilter();
updateCount();
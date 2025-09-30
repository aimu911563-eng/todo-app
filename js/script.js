const addbtn = document.querySelector("#addbtn");
const newTodo = document.querySelector("#newTodo");
const list = document.querySelector("#list");
const all = document.getElementById("filter-all");
const active = document.getElementById("filter-active");
const done = document.getElementById("filter-done");
const $count = document.getElementById('count');
const $clear = document.getElementById('clearDone');
const filterText = document.getElementById("filter-text");
let keyword = "";


addbtn.addEventListener ("click", (e) => {
    console.log("[ADD]", newTodo.value.trim());
    
    const text = newTodo.value.trim()
    if (text === "") {
        return;
    }

    const li = document.createElement("li")
    const span = document.createElement("span");
    span.className = "todo-text";
    span.textContent = text;
    enableEditing(span);
    li.appendChild(span);
    list.appendChild(li);
    li.classList.add("enter");
    requestAnimationFrame(() => li.classList.remove("enter"));
    applyFilter(currentFilter);
    saveTodos()
    newTodo.value = "";
    newTodo.focus();


    const checkbox = document.createElement(`input`);
    checkbox.type = "checkbox";
    li.prepend(checkbox);
    checkbox.addEventListener ("change", (e) => {
        console.log("[TOGGLE]", e.target.checked);
        li.classList.toggle("done");
        applyFilter(currentFilter);
        saveTodos();
        UpdateMeta();
    })

    const clear = document.createElement(`button`);
    clear.textContent = "削除 🗑️";
    li.append(clear)
    clear.classList.add("danger");


    clear.addEventListener ("click", () => {
        li.classList.add("leaving");
        
        const onend = (e) => { 
            if (e.propertyName === "opacity") {
                li.removeEventListener("transitionend", onend);
                li.remove();
                saveTodos();
                UpdateMeta();
            }
            

        }
        li.addEventListener("transitionend", onend);

    });
    

})

newTodo.addEventListener ("keydown", (e) => {
        if (e.key === "Enter") {
        addbtn.click();
       }
});

let currentFilter = "all";

function applyFilter(mode) {
    currentFilter = mode;

    for (const li of list.children) {
        const checked = li.classList.contains('done');
        const text = li.querySelector(".todo-text")?.textContent.toLowerCase() || "";

        let show = true;
        if (mode === "active") {
            show = !checked;
        }
        if (mode === "done") {
            show = checked;
        }

        if (show && keyword) {
            show = text.includes(keyword);
        }

        li.style.display = show ? "" : "none";
    }
}


const aad = [all, active, done];
function a (toggle) {
    aad.forEach (b =>b.classList.remove(`active`));
    toggle.classList.add(`active`);
}

all.addEventListener ("click", (e) => {
    e.preventDefault(); 
    setFilter ("all", e.currentTarget)
});

active.addEventListener ("click", (e) => {
    e.preventDefault();
    setFilter ("active", e.currentTarget)
});

done.addEventListener ("click", (e) => {
    e.preventDefault();
    setFilter ("done", e.currentTarget)
});

filterText.addEventListener ("input", (e) => {
    keyword = e.target.value.trim().toLowerCase();
    applyFilter(currentFilter);
});

a(all)

function saveTodos () {
    const todos = [];
    for (const li of list.children) {
        const cd = li.querySelector(`input[type="checkbox"]`);
        const span = li.querySelector(`.todo-text`);
        
        todos.push({
            text: span ? span.textContent.trim() : li.textContent.replace("削除","").trim(),
            done: cd ? cd.checked :false
        });
    }
    localStorage.setItem("todos", JSON.stringify(todos));
}

function loadTodos () {
    const data = localStorage.getItem("todos");
    if (!data) {
        return;
    }

    const todos = JSON.parse(data);

    for (const t of todos) {
        const li = document.createElement("li");

        const span = document.createElement("span");
        span.className = "todo-text";
        span.textContent = t.text;
        li.appendChild(span);
        enableEditing(span);

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = t.done;
        if (t.done) {
            li.classList.add ("done")
        }
        li.prepend(checkbox);

        const clear = document.createElement("button");
        clear.textContent = "削除";
        li.appendChild(clear);
        list.appendChild(li);

        checkbox.addEventListener("change", (e) => {
            console.log("[TOGGLE]", e.target.checked);
            li.classList.toggle("done");
            applyFilter(currentFilter);
            saveTodos();
            UpdateMeta();
        });

        clear.addEventListener("click", () => {
            li.remove();
            saveTodos();
            UpdateMeta();
        })

    }

}

window.addEventListener ("DOMContentLoaded", () => {
    loadTodos();
    const initial = (location.hash.replace("#","") || "all");
    setFilter(initial);
    UpdateMeta();
})

window.addEventListener ("hashchange", () => {
    const mode = location.hash.replace("#","") || "all";
    console.log("[hashchange]", mode);
    setFilter(mode);
    applyFilter(mode);
    a(mode === 'active' ? active : mode === 'done' ? done : all);
})

function enableEditing(span) {
    span.addEventListener("dblclick", () => {
        const li = span.closest("li");
        const old = span.textContent;

        const input = document.createElement("input");
        input.type = "text";
        input.value = old;
        input.className = "edit-input";
        span.replaceWith(input);
        input.focus();
        input.select();

        const commit = (newText) => {
            console.log("[EDIT]", { before: old, after: newText });
            const s = document.createElement("span");
            s.className = "todo-text";
            s.textContent = newText.trim() || old;
            input.replaceWith(s);
            enableEditing(s);
            saveTodos();
        };

        input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            commit (input.value);
        }
        if (e.key === "Escape") {
            commit (old);
        }
        });

        input.addEventListener("blur", () => {
            commit(input.value);
        });

    })
}
 
function clearCompleted() {
    const before = list.children.length;
    [...list.children].forEach (li => {
        if (li.classList.contains('done')) li.remove();
    });
    if (list.children.length !== before) {
        saveTodos();
        applyFilter(currentFilter);
        UpdateMeta();
    }
}
$clear.addEventListener('click', clearCompleted);

function UpdateMeta() {
    const items = [...list.children];
    const done = items.filter(li => li.classList.contains('done')).length;
    const total = items.length;
    $count.textContent = `Done ${done} / ${total}`;
    $clear.disabled = done === 0;
}

function setFilter(mode, btn) {
   if (location.hash !== '#' + mode) location.hash = mode;
   currentFilter = mode;
   applyFilter(mode);
   a(btn ? btn : mode === 'active' ? active : mode === 'done' ? done : all);
}

const initial = location.hash.replace("#", "") || "all";


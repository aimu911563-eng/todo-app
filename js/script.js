const addbtn = document.querySelector("#addbtn");
const newTodo = document.querySelector("#newTodo");
const list = document.querySelector("#list");
const all = document.getElementById("filter-all");
const active = document.getElementById("filter-active");
const done = document.getElementById("filter-done");


addbtn.addEventListener ("click", () => {
    
    const text = newTodo.value.trim()
    if (text === "") {
        return;
    }

    const li = document.createElement("li")
    const span = document.createElement("span");
    span.className = "todo-text";
    span.textContent = text;
    li.appendChild(span);
    list.appendChild(li);
    li.classList.add("enter");
    requestAnimationFrame(() => li.classList.remove("enter"));
    saveTodos()
    newTodo.value = "";
    newTodo.focus();


    const checkbox = document.createElement(`input`);
    checkbox.type = "checkbox";
    li.prepend(checkbox);
    checkbox.addEventListener ("change", () => {
        li.classList.toggle("done");
        applyFilter(currentFilter);
        saveTodos();
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
                saveTodos()
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
        const cd = li.querySelector(`input[type="checkbox"]`);
        const checked = cd?.checked === true;

        let show = true;
        if (mode === "active") {
            show = !checked;
        }
        if (mode === "done") {
            show = checked;
        }

        li.style.display = show ? "" : "none";
    }
}


all.addEventListener ("click", () => {
    applyFilter("all")
});

active.addEventListener ("click", () => {
    applyFilter("active")
});

done.addEventListener ("click", () => {
    applyFilter("done")    
});

applyFilter("all")

const aad = [all, active, done];
function a (toggle) {
    aad.forEach (b =>b.classList.remove(`active`));
    toggle.classList.add(`active`);
}

all.addEventListener ("click", (e) => {
    a (e.currentTarget);
    applyFilter("all")
});

active.addEventListener ("click", (e) => {
    a (e.currentTarget);
    applyFilter("active");
})

done.addEventListener ("click", (e) => {
    a (e.currentTarget);
    applyFilter("done");

})

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
        li.prepend(checkbox);

        const clear = document.createElement("button");
        clear.textContent = "削除";
        li.appendChild(clear);
        list.appendChild(li);

        checkbox.addEventListener("click", () => {
            li.classList.toggle("done");
            applyFilter(currentFilter);
            saveTodos();
        });

        clear.addEventListener("click", () => {
            li.remove();
            saveTodos();
        })

    }

}

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
 

window.addEventListener("DOMContentLoaded", loadTodos);


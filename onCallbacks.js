const fs = require('fs');
const path = require('path');

const noteDir = path.resolve(__dirname, 'notes');
const trashDir = path.resolve(__dirname, 'trash');

(async () => {
    await createNote("1", new Date().toString());
    await createNote("2", new Date().toString());
    await createNote("3", new Date().toString());
})();

fs.readdir(noteDir);

async function createNote(name, content) {

    const notePath = path.join(noteDir, `${name}.txt`);
    let hasNote = false;

    await fs.readdir(noteDir, async (err, files) => {
        files.forEach((file) => {
            if(file.split('.')[0] === name) {
                console.log('ОШИБКА')
                console.log("УЖЕ СУЩЕСТВУЕТ: " + name);
                hasNote = true;
            }
        });
    });

    if(hasNote) return;

    await fs.writeFile(
        notePath,
        content,
        async (err) => {

            if (err) console.log(err);
            console.log(`CREATED: ${name.toUpperCase()} `);
        });
}

function readNote(name) {
    const notePath = path.join(noteDir, `${name}.txt`);

    fs.readFile(notePath, (err, data) => {
        if (err) console.log(err);
        console.log(`----- ${name.toUpperCase()} -----`);
        console.log(data.toString());
        console.log(`-----  -----  -----  -----`);
    })
}

function readAllNotes() {

    fs.readdir(noteDir, (err, files) => {
        if (err) console.log(err);
        console.log("----- СПИСОК ВСЕХ ЗАМЕТОК -----");
        files.forEach(file => {
            console.log(file)
        });
        console.log('-----');
    })
}

function updateNote(name, content) {
    const notePath = path.join(noteDir, `${name}.txt`);

    fs.writeFile(notePath, content, (err) => {
        if (err) console.log(err);
        console.log(`UPDATED: ${name.toUpperCase()}`);
    });
}

function deleteNote(name) {
    const oldPath = path.join(noteDir, `${name}.txt`);
    const newPath = path.join(trashDir, `${name}.txt`);

    fs.rename(oldPath, newPath, (err) => {
        if (err) console.log(err);
        console.log(`DELETED: ${name.toUpperCase()}`);
    })
}

function showTrash() {
    fs.readdir(trashDir, (err, files) => {
        if (err) console.log(err);
        console.log("----- СОДЕРЖАНИЕ КОРЗИНЫ -----");
        files.forEach(file => {
            console.log(file)
        });
        console.log('-----');
    })
}

function delTrash() {
    fs.readdir(trashDir, (err, files) => {
        if (err) console.log(err);
        console.log("----- ОЧИСТКА КОРЗИНЫ -----");
        files.forEach(file => {
            console.log("УДАЛЕНО: " + file);
        });
        console.log("----- СОДЕРЖИМОЕ КОРЗИНЫ УДАЛЕНО -----");
    })
}

function restoreTrashNote(name) {
    fs.readdir(trashDir, (err, files) => {
        if (err) console.log(err);

        const oldPath = path.join(trashDir, `${name}.txt`);
        const newPath = path.join(noteDir, `${name}.txt`);

        files.forEach(file => {
            if(file.split('.')[0] === name) {

                fs.rename(oldPath, newPath, (err) => {
                    if(err) console.log(err);
                    console.log(`ВОСТАНОВЛЕН: ${name.toUpperCase()}`);
                })
            }
        })
    })
}

function copyNote(name, newName) {
    const newPath = path.join(noteDir, `${newName}.txt`);
    const oldPath = path.join(noteDir, `${name}.txt`);
    let oldData;

    fs.readFile(oldPath, (err, data) => {
        if (err) console.log(err);
        oldData = data;
    });

    fs.writeFile(newPath, oldData, (err) => {
        if (err) console.log(err);
        console.log(`СКОПИРОВАН: ${name.toUpperCase()}`);
        console.log(`В: ${newName.toUpperCase()}`);
    });
}
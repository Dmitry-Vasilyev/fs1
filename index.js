const fs = require('fs/promises');
const path = require('path');

const noteDir = path.resolve(__dirname, 'notes');
const trashDir = path.resolve(__dirname, 'trash');

(async () => {
    await createNote("1", new Date().toString());
    await createNote("2", new Date().toString());
    await createNote("3", new Date().toString());

    await readNote("1");
    await readNote("2");
    await readNote("3");

    await readAllNotes();

    await updateNote("3", new Date().toString());
    await readNote("3");

    await deleteNote("1");
    await deleteNote("2");
    await deleteNote("3");

    await showTrash();

    await delTrash();

    await showTrash();

    await createNote("4", new Date().toString());
    await deleteNote("4");
    await showTrash();
    await restoreTrashNote("4");
    await showTrash();
    await readAllNotes();
    await deleteNote("4");
    await delTrash();

    await createNote("5", new Date().toString());
    await copyNote("5", "6");



})();



async function createNote(name, content) {
    const notePath = path.join(noteDir, `${name}.txt`);

    let hasNote = false;

    try {
        const files = await fs.readdir(noteDir);
        files.forEach((file) => {
            if(file.split('.')[0] === name) {

                console.log("ЗАМЕТКА УЖЕ СУЩЕСТВУЕТ: " + name);
                hasNote = true;
            }
        });

        if (hasNote) {
            return;
        }

        await fs.writeFile(notePath, content);
        console.log(`CREATED: ${name.toUpperCase()} `);

    } catch (e) {
        console.log(`ERROR: ${e}`);
    }
}

async function readNote(name) {
    const notePath = path.join(noteDir, `${name}.txt`);

    try {
        const data = await fs.readFile(notePath);
        console.log(`----- ${name.toUpperCase()} -----`);
        console.log(data.toString());
        console.log(`-----  -----  -----  -----`);
    } catch (e) {
        console.log(`ERROR: ${e}`);
    }
}

async function readAllNotes() {

    try {
        const files = await fs.readdir(noteDir);

        console.log("----- СПИСОК ВСЕХ ЗАМЕТОК -----");

        files.forEach(file => {
            console.log(file);
        });

        console.log('-----');
    } catch (e) {
        console.log(`ERROR: ${e}`);
    }
}

async function updateNote(name, content) {
    const notePath = path.join(noteDir, `${name}.txt`);

    try {
        await fs.writeFile(notePath, content);
        console.log(`UPDATED: ${name.toUpperCase()}`);

    } catch (e) {
        console.log(`ERROR: ${e}`);
    }
}

async function deleteNote(name) {
    const oldPath = path.join(noteDir, `${name}.txt`);
    const newPath = path.join(trashDir, `${name}.txt`);

    try {
        await fs.rename(oldPath, newPath);
        console.log(`DELETED: ${name.toUpperCase()}`);
    } catch (e) {
        console.log(`ERROR: ${e}`);
    }
}

async function showTrash() {
    try {
        const files = await fs.readdir(trashDir);

        console.log("----- СОДЕРЖИМОЕ КОРЗИНЫ -----");
        files.forEach(file => {
            console.log(file);
        })

    } catch (e) {
        console.log(`ERROR: ${e}`);
    }
}

async function delTrash() {

    try {
        const files = await fs.readdir(trashDir);

        console.log("----- ОЧИСТКА КОРЗИНЫ -----");

        for(let i = 0; i < files.length; i++) {
            const filePath = path.join(trashDir, files[i]);
            console.log("УДАЛЕНО: " + files[i]);
            await fs.rm(filePath);
        }

        console.log("----- СОДЕРЖИМОЕ КОРЗИНЫ УДАЛЕНО -----");
    } catch (e) {
        console.log(`ERROR: ${e}`);
    }
}

async function restoreTrashNote(name) {
    const newPath = path.join(noteDir, `${name}.txt`);
    const oldPath = path.join(trashDir, `${name}.txt`);

    try {
        const files = await fs.readdir(trashDir);
        const index = files.findIndex(file => {
            return file.split('.')[0] === name;
        });

        if(index >= 0) {
            await fs.rename(oldPath, newPath);
            console.log(`ВОСТАНОВЛЕН: ${name.toUpperCase()}`);
        }

    } catch (e) {
        console.log(`ERROR: ${e}`);
    }
}

async function copyNote(name, newName) {
    const newPath = path.join(noteDir, `${newName}.txt`);
    const oldPath = path.join(noteDir, `${name}.txt`);
    let oldData;

    try {
        oldData = await fs.readFile(oldPath);
        await fs.writeFile(newPath, oldData);
        console.log(`СКОПИРОВАН: ${name.toUpperCase()}`);
        console.log(`В: ${newName.toUpperCase()}`);
    } catch (e) {
        console.log(`ERROR: ${e}`);
    }
}
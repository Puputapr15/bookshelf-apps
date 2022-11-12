const book = [];
const RENDER_EVENT = 'renderBook';
const SAVED_EVENT = 'savedBook';
const STORAGE_KEY = 'BOOKSHELF-APPS';

function generateId() {
    return +new Date();
}

function generateBookObject(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year,
        isComplete
    }
}

function findBook(bookId) {
    for (const bookItem of book) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}

function makeBook(bookObject) {
    const textTitle = document.createElement('h3');
    textTitle.innerHTML = bookObject.title;
    const textAuthor = document.createElement('p');
    textAuthor.innerHTML = 'Penulis: ' + bookObject.author;
    const textYear = document.createElement('p');
    textYear.innerHTML = 'Tahun: ' + bookObject.year;

    // const btnEdit = document.createElement('button');
    // btnEdit.innerHTML = 'Edit buku';
    // btnEdit.classList.add('book_shelf', 'book_list', 'book_item', 'action', 'blue');
    // btnEdit.addEventListener('click', function () {
    //     editBook(bookObject.id);
    // })

    const btnStatus = document.createElement('button');
    if (bookObject.isComplete) {
        btnStatus.innerHTML = 'Belum selesai dibaca';
        btnStatus.addEventListener('click', function () {
            removeBookFromCompleted(bookObject.id);
        });
    } else {
        btnStatus.innerHTML = 'Selesai dibaca';
        btnStatus.addEventListener('click', function () {
            addBookToCompleted(bookObject.id);
        });
    }
    btnStatus.classList.add('book_shelf', 'book_list', 'book_item', 'action', 'green');

    const btnHapus = document.createElement('button');
    btnHapus.innerHTML = 'Hapus buku';
    btnHapus.classList.add('book_shelf', 'book_list', 'book_item', 'action', 'red');
    btnHapus.addEventListener('click', function () {
        let konfirmasi = confirm("Apakah yakin ingin menghapus " + bookObject.title + '?');
        if (konfirmasi) {
            removeBook(bookObject.id);
        }
    })

    const action = document.createElement('div');
    action.classList.add('action');
    //btnEdit
    action.append(btnStatus, btnHapus);

    const book_item = document.createElement('article');
    book_item.classList.add('book_item');
    book_item.append(textTitle, textAuthor, textYear, action);
    book_item.setAttribute('id', `book-${bookObject.id}`);

    return book_item;
}

function addBook() {
    const title = document.getElementById('inputBookTitle').value;
    const author = document.getElementById('inputBookAuthor').value;
    const year = document.getElementById('inputBookYear').value;
    const isComplete = document.getElementById('inputBookIsComplete').checked;
    const id = generateId();
    const bookObject = generateBookObject(id, title, author, year, isComplete);
    book.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

// function editBook(bookId) {
//     const index = findBookIndex(bookId);
//     const display = document.getElementById('container_edit');
//     display.classList.add('background_active');

//     const titleDisplay = document.getElementById('titleEditBuku');
//     titleDisplay.innerHTML = 'Edit Buku ' + book[index].title;

//     const title = document.getElementById('updateBookTitle');
//     title.placeholder = book[index].title;
//     const author = document.getElementById('updateBookAuthor');
//     author.placeholder = book[index].author;
//     const year = document.getElementById('updateBookYear');
//     year.placeholder = book[index].year;
//     const isComplete = document.getElementById('updateBookIsComplete');

//     const buttonUpdate = document.getElementById('bookUpdate');
//     buttonUpdate.addEventListener('click', function (event) {
//         event.preventDefault();
//         book[index].title = title.value;
//         book[index].author = author.value;
//         book[index].year = year.value;
//         book[index].isComplete = isComplete.checked;
//         document.dispatchEvent(new Event(RENDER_EVENT));
//         saveData();
//         display.classList.remove('background_active');
//     });

//     const modalClose = document.getElementById('modal_close');
//     modalClose.addEventListener('click', function () {
//         display.classList.remove('background_active');
//     })
// }

function addBookToCompleted(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;
    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function removeBookFromCompleted(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;
    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function removeBook(bookId) {
    const bookTarget = findBookIndex(bookId);
    if (bookTarget === -1) return;
    book.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBookIndex(bookId) {
    for (const index in book) {
        if (book[index].id == bookId) {
            return index;
        }
    }
    return -1;
}


document.addEventListener('DOMContentLoaded', function () {
    const submitButton = document.getElementById('inputBook');
    submitButton.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    })

    if (isStorageExist) {
        dataLoadFromStorage();
    }

    document.getElementById('searchSubmit').addEventListener("click", function (event) {
        event.preventDefault();
        const search = document.getElementById('searchBookTitle').value.toLowerCase();
        const bookList = document.querySelectorAll('.book_item > h3');
        for (const item of bookList) {
            if (item.innerHTML.toLowerCase().includes(search)) {
                item.parentElement.style.display = "block";
            } else {
                item.parentElement.style.display = "none";
            }
        }
    })
})

document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBOOKList = document.getElementById('incompleteBookshelfList');
    uncompletedBOOKList.innerHTML = '';

    const completeBOOKList = document.getElementById('completeBookshelfList');
    completeBOOKList.innerHTML = '';

    for (const bookItem of book) {
        const bookElement = makeBook(bookItem);
        if (!bookItem.isComplete) {
            uncompletedBOOKList.append(bookElement);
        } else {
            completeBOOKList.append(bookElement);
        }

    }
})

function saveData() {
    if (isStorageExist) {
        const parsed = JSON.stringify(book);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('browser tidak mendukung local storage');
        return false;
    }
    return true;
}

function dataLoadFromStorage() {
    const dataString = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(dataString);

    if (data !== null) {
        for (const bookItem of data) {
            book.push(bookItem);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function searchBook() {

}



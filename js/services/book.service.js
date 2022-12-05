'use strict '
var gBooks
var gFilterBy = { maxPrice: 6.5, minRate: 0, title: '' }
const STORAGE_KEY = `bookDB`
var gPageIdx = 0
const PAGE_SIZE = 4



function _createBook(title, price) {
    return {
        id: makeId(),
        title: title,
        price: (price) ? price : 6.5,
        brief: makeLorem(wordCount = 15),
        rate: 1
    }
}

function _createBooks() {
    var books = loadFromStorage(STORAGE_KEY)

    if (!books || !books.length) {
        books = []
        for (let i = 0; i < 12; i++) {
            var title = makeLorem(wordCount = 2)
            books.push(_createBook(title))
        }
    }
    gBooks = books
    _saveBooksToStorage()
}

function getBooks() {
    var books = gBooks.filter(book => book.title.includes(gFilterBy.title) &&
        book.price <= gFilterBy.maxPrice && book.rate >= gFilterBy.minRate)

    var startIdx = gPageIdx * PAGE_SIZE
    return books.slice(startIdx, startIdx + PAGE_SIZE)
}

function addBook(title, price) {
    const book = _createBook(title, price)
    gBooks.push(book)
    _saveBooksToStorage()
    return book

}

function deleteBook(bookId) {
    const bookIdx = gBooks.findIndex(book => bookId === book.id)
    gBooks.splice(bookIdx, 1)
    _saveBooksToStorage()
}

function updateBook(bookId, newPrice) {
    const book = getBookById(bookId)
    book.price = newPrice
    _saveBooksToStorage
    return book
}

function getBookById(bookId) {
    const book = gBooks.find(book => bookId === book.id)
    return book
}

function setBookFilter(filterBy = {}) {
    gPageIdx = 0
    if (filterBy.maxPrice !== undefined) gFilterBy.maxPrice = filterBy.maxPrice
    if (filterBy.minRate !== undefined) gFilterBy.minRate = filterBy.minRate
    if (filterBy.title !== undefined) gFilterBy.title = filterBy.title
    return gFilterBy
}

function updateRate(bookId, diff) {
    const book = getBookById(bookId)
    book.rate += diff
    _saveBooksToStorage()

}


function _saveBooksToStorage() {
    saveToStorage(STORAGE_KEY, gBooks)
}

function nextPage() {
    gPageIdx++
    document.querySelector(`.pageNum`).innerText = gPageIdx
    if (gPageIdx * PAGE_SIZE >= gBooks.length) {
        gPageIdx = 0
    }
}

function prevPage() {
    if (gPageIdx > 0) {
        gPageIdx--
        document.querySelector(`.pageNum`).innerText = gPageIdx
    } else return

}
'use strict'

function onInit() {
    _createBooks()
    renderFilterByQueryStringParams()
    renderBooks()
}

function renderBooks() {
    document.querySelector(`.pageNum`).innerText = `Page number : ` + (gPageIdx + 1)
    var books = getBooks()
    var strHTMLs = books.map(book => `
    
    <tr class="book ${book.title}">
                <td>
                    ${book.id}
                </td>
                <td>
                    ${book.title}
                </td>
                <td>
                    ${book.price}$
                </td>
                <td>
                    <button class="read" onclick="onReadBook('${book.id}')">Read</button>
                    <button class="update" onclick="onUpdateBook('${book.id}')">Update</button>
                    <button class="delete" onclick="onDeleteBook('${book.id}')">Delete</button>
                </td>
            </tr>
    `)

    document.querySelector(`.table-body`).innerHTML = strHTMLs.join('')
}

function onSetFilterBy(filterBy) {
    console.log(filterBy)
    filterBy = setBookFilter(filterBy)
    console.log(filterBy)

    renderBooks()
    const queryStringParams = `?title=${filterBy.title}&maxPrice=${filterBy.maxPrice}&minRate${filterBy.minRate}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    // console.log(newUrl);
    window.history.pushState({ path: newUrl }, '', newUrl)
}



function onUpdateRate(elBtn) {
    const bookId = document.querySelector(`.bookId`).innerText
    console.log(bookId);
    var diff
    if (elBtn.innerText === '-') {
        document.querySelector(`.rate`).innerText--
        diff = -1
    } else if (elBtn.innerText === '+') {
        document.querySelector(`.rate`).innerText++
        diff = 1
    }

    updateRate(bookId, diff)


}

function renderFilterByQueryStringParams() {
    const queryStringParams = new URLSearchParams(window.location.search)
    const filterBy = {
        maxPrice: +queryStringParams.get(`maxPrice`) || 0,
        minRate: +queryStringParams.get(`minRate`) || 0,
        title: queryStringParams.get(`title`) || '',

    }

    if (!filterBy.title && !filterBy.maxPrice && !filterBy.minRate) return

    document.querySelector(`.filter-price-range`).value = filterBy.price
    document.querySelector(`.filter-rate-range`).value = filterBy.rate
    document.querySelector(`.filter-title`).value = filterBy.title
    setBookFilter(filterBy)
}



function onCreateNewBook() {
    var title = prompt('What is the title?')
    var price = +prompt(`What is the price`)
    if (title && price) {
        const book = addBook(title, price)
        renderBooks()
        flashMsg(`book Added (id: ${book.id})`)
    }
}

function onDeleteBook(bookId) {
    deleteBook(bookId)
    renderBooks()
    flashMsg(`Book Deleted`)

}

function onReadBook(bookId) {
    var book = getBookById(bookId)
    var elModal = document.querySelector(`.modal`)
    elModal.querySelector(`h3`).innerText = book.title
    elModal.querySelector(`p`).innerText = book.brief
    elModal.querySelector(`.bookId`).innerText = bookId
    elModal.classList.add(`open`)
    document.querySelector(`.rate`).innerText = book.rate



}

function onCloseModal() {
    document.querySelector('.modal').classList.remove('open')
}

function onUpdateBook(bookId) {
    var newPrice = +prompt('New price?')
    if (newPrice && newPrice > 0) {
        updateBook(bookId, newPrice)
        renderBooks()
    }
}

function flashMsg(msg) {
    const el = document.querySelector('.user-msg')
    el.innerText = msg
    el.classList.add('open')
    setTimeout(() => {
        el.classList.remove('open')
    }, 3000)
}

function onNextPage() {
    nextPage()
    renderBooks()
}

function onPrevPage() {
    prevPage()
    renderBooks()
}
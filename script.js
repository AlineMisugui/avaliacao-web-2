const dialogFiltro = document.getElementById("dialog-filtro")
const exibeFiltros = document.getElementById("filtro")
const closeFiltros = document.getElementById("close-filtro")

exibeFiltros.addEventListener("click", (e) => {
    e.preventDefault()
    dialogFiltro.showModal()
})

closeFiltros.addEventListener("click", () => {
    dialogFiltro.close()
})

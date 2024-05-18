const dialogFiltro = document.getElementById("dialog-filtro")
const exibeFiltros = document.getElementById("filtro")
const closeFiltros = document.getElementById("close-filtro")

exibeFiltros.addEventListener("click", () => {
    dialogFiltro.showModal()
})

closeFiltros.addEventListener("click", () => {
    dialogFiltro.close();
})

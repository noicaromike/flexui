document.addEventListener("DOMContentLoaded", () => {
  // Light/Dark Mode Toggle
  const toggleBtn = document.createElement("button");
  toggleBtn.textContent = "Toggle Theme";
  toggleBtn.className = "flexui-theme-toggle";
  document.body.prepend(toggleBtn);

  toggleBtn.addEventListener("click", () => {
    const theme =
      document.documentElement.getAttribute("data-theme") === "dark"
        ? "light"
        : "dark";
    document.documentElement.setAttribute("data-theme", theme);
  });

  // Initialize all tables
  document.querySelectorAll("table.flexui").forEach((table) => {
    const wrapper = document.createElement("div");
    wrapper.className = "flexui-wrapper";
    table.parentNode.insertBefore(wrapper, table);
    wrapper.appendChild(table);

    // Search
    const search = document.createElement("input");
    search.placeholder = "Search...";
    search.className = "flexui-search";
    wrapper.insertBefore(search, table);

    search.addEventListener("input", () => {
      const filter = search.value.toLowerCase();
      Array.from(table.tBodies[0].rows).forEach((row) => {
        row.style.display = Array.from(row.cells).some((cell) =>
          cell.textContent.toLowerCase().includes(filter)
        )
          ? ""
          : "none";
      });
      updatePagination();
    });

    // Sorting
    Array.from(table.querySelectorAll("th")).forEach((th, index) => {
      th.addEventListener("click", () => {
        const rows = Array.from(table.tBodies[0].rows);
        const type = th.dataset.sort || "string";
        rows.sort((a, b) => {
          const aText = a.cells[index].textContent;
          const bText = b.cells[index].textContent;
          return type === "number" ? aText - bText : aText.localeCompare(bText);
        });
        rows.forEach((row) => table.tBodies[0].appendChild(row));
        updatePagination();
      });
    });

    // Pagination
    const pagination = document.createElement("div");
    pagination.className = "flexui-pagination";
    wrapper.appendChild(pagination);

    const rowsPerPage = 5;
    let currentPage = 0;

    function updatePagination() {
      const allRows = Array.from(table.tBodies[0].rows).filter(
        (r) => r.style.display !== "none"
      );
      const totalPages = Math.ceil(allRows.length / rowsPerPage);

      pagination.innerHTML = "";
      for (let i = 0; i < totalPages; i++) {
        const btn = document.createElement("button");
        btn.textContent = i + 1;
        btn.disabled = i === currentPage;
        btn.addEventListener("click", () => {
          currentPage = i;
          showPage(allRows, currentPage);
        });
        pagination.appendChild(btn);
      }
      showPage(allRows, currentPage);
    }

    function showPage(rows, page) {
      rows.forEach((row, i) => {
        row.style.display =
          i >= page * rowsPerPage && i < (page + 1) * rowsPerPage ? "" : "none";
      });
    }

    updatePagination();
  });
});

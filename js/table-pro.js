// FLEXUI PRO TABLE: Search + Pagination + Column Toggle + CSV Export
document.addEventListener("DOMContentLoaded", () => {
  const tableWrappers = document.querySelectorAll(".flexui-table-wrapper");

  tableWrappers.forEach((wrapper) => {
    const table = wrapper.querySelector(".flexui-table");
    const searchInput = wrapper.querySelector(".flexui-table-search");
    const exportBtn = wrapper.querySelector(".flexui-export-csv");
    const columnCheckboxes = wrapper.querySelectorAll(
      ".flexui-column-toggle input"
    );
    const paginationContainer = wrapper.querySelector(".flexui-pagination");
    const rowsPerPage = 3;
    let currentPage = 1;

    const rows = Array.from(table.querySelectorAll("tbody tr"));

    // ===== SEARCH =====
    if (searchInput) {
      searchInput.addEventListener("input", () => {
        const term = searchInput.value.toLowerCase();
        rows.forEach((row) => {
          row.style.display = Array.from(row.children).some((td) =>
            td.textContent.toLowerCase().includes(term)
          )
            ? ""
            : "none";
        });
        currentPage = 1;
        renderPagination();
      });
    }

    // ===== COLUMN TOGGLE =====
    columnCheckboxes.forEach((checkbox) => {
      checkbox.addEventListener("change", () => {
        const colIndex = parseInt(checkbox.dataset.col);
        table.querySelectorAll("tr").forEach((tr) => {
          tr.children[colIndex].style.display = checkbox.checked ? "" : "none";
        });
      });
    });

    // ===== CSV EXPORT =====
    if (exportBtn) {
      exportBtn.addEventListener("click", () => {
        const visibleRows = rows.filter((r) => r.style.display !== "none");
        const csv = [
          Array.from(table.querySelectorAll("thead th"))
            .map((th) => th.textContent)
            .join(","),
        ];
        visibleRows.forEach((r) => {
          csv.push(
            Array.from(r.children)
              .map((td) => `"${td.textContent}"`)
              .join(",")
          );
        });
        const blob = new Blob([csv.join("\n")], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "flexui-table.csv";
        a.click();
        URL.revokeObjectURL(url);
      });
    }

    // ===== PAGINATION =====
    function renderPagination() {
      if (!paginationContainer) return;
      const visibleRows = rows.filter((r) => r.style.display !== "none");
      const pageCount = Math.ceil(visibleRows.length / rowsPerPage);
      paginationContainer.innerHTML = "";
      for (let i = 1; i <= pageCount; i++) {
        const btn = document.createElement("button");
        btn.textContent = i;
        if (i === currentPage) btn.classList.add("active");
        btn.addEventListener("click", () => {
          currentPage = i;
          renderPagination();
        });
        paginationContainer.appendChild(btn);
      }

      // Show only current page rows
      visibleRows.forEach((row, index) => {
        row.style.display =
          index >= (currentPage - 1) * rowsPerPage &&
          index < currentPage * rowsPerPage
            ? ""
            : "none";
      });
    }

    renderPagination();
  });
});

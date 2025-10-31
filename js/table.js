// FLEXUI FREE TABLE: Sorting only
document.addEventListener("DOMContentLoaded", () => {
  const tables = document.querySelectorAll(".flexui-table");

  tables.forEach((table) => {
    const headers = table.querySelectorAll("th");
    headers.forEach((th, index) => {
      th.addEventListener("click", () => {
        const tbody = table.querySelector("tbody");
        const rows = Array.from(tbody.querySelectorAll("tr"));
        const type = th.dataset.sort || "string";
        const currentOrder = th.classList.contains("sorted-asc")
          ? "asc"
          : "desc";

        rows.sort((a, b) => {
          const aText = a.children[index].textContent.trim();
          const bText = b.children[index].textContent.trim();
          if (type === "number") {
            return currentOrder === "asc" ? bText - aText : aText - bText;
          } else {
            return currentOrder === "asc"
              ? bText.localeCompare(aText)
              : aText.localeCompare(bText);
          }
        });

        tbody.innerHTML = "";
        rows.forEach((row) => tbody.appendChild(row));

        headers.forEach((h) => h.classList.remove("sorted-asc", "sorted-desc"));
        th.classList.add(currentOrder === "asc" ? "sorted-desc" : "sorted-asc");
      });
    });
  });
});

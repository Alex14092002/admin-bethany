fetch("https://bethany-eb426-default-rtdb.firebaseio.com/brands.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    const dataArray = [];

    data.forEach((brand) => {
      for (const key in brand) {
        dataArray.push(brand[key]);
      }
    });

    const tbody = document.querySelector(".table tbody");
    dataArray.forEach((data) => {
      const row = document.createElement("tr");

      const imageCell = document.createElement("td");
      const image = document.createElement("img");
      image.src = data.image;
      image.alt = data.brandName;
      image.className = "image-test";
      imageCell.appendChild(image);
      row.appendChild(imageCell);

      const brandNameCell = document.createElement("td");
      brandNameCell.textContent = data.name;
      row.appendChild(brandNameCell);

      const typeCell = document.createElement("td");
      typeCell.textContent = data.type;
      row.appendChild(typeCell);

      const yearCell = document.createElement("td");
      yearCell.textContent = data.year;
      row.appendChild(yearCell);

      const actionCell = document.createElement("td");
      const a = document.createElement("a");
      a.href = "edit.html?id=" + data.id;
      a.className = "btn btn-warning btn-icon-text";
      a.textContent = "Edit";
      actionCell.appendChild(a);
      row.appendChild(actionCell);

      tbody.appendChild(row);
    });
  })
  .catch((error) => {
    console.error("There was a problem with the fetch operation:", error);
  });

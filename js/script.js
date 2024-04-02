// Hàm để tải ảnh lên Cloudinary
async function uploadImageToCloudinary(file, folderName) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "irpj555r");
  formData.append("folder", folderName);
  try {
    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dzyqr3zmd/image/upload",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw error;
  }
}

document
  .querySelector(".file-upload-browse2")
  .addEventListener("click", function () {
    document.getElementById("file-upload").click();
  });

var noData = createNoDataRow();
document.querySelector("#image-table tbody").appendChild(noData);

document
  .getElementById("file-upload")
  .addEventListener("change", async function (event) {
    var file = event.target.files[0];
    var reader = new FileReader();

    reader.onload = async function (e) {
      var imageName = file.name;

      try {
        if (imageUrls.length === 0) {
          document.querySelector("#image-table tbody").removeChild(noData);
        }

        var loadingRow = createLoadingRow();
        document.querySelector("#image-table tbody").appendChild(loadingRow);

        let folderName = "bethany";

        const imageUrl = await uploadImageToCloudinary(file, folderName);

        document.querySelector("#image-table tbody").removeChild(loadingRow);

        var newRow = document.createElement("tr");

        var imageCell = document.createElement("td");
        var nameCell = document.createElement("td");
        nameCell.className = "display-none";
        var actionCell = document.createElement("td");

        var imageElement = document.createElement("img");
        imageElement.src = imageUrl;
        imageElement.className = "image-test";
        imageElement.alt = imageName;

        imageCell.appendChild(imageElement);

        nameCell.textContent = imageName;

        var deleteButton = document.createElement("button");
        deleteButton.type = "button";
        deleteButton.className = "btn btn-danger btn-icon-text delete-btn";
        deleteButton.innerHTML =
          '<i class="ti-trash btn-icon-prepend"></i>Delete';

        actionCell.appendChild(deleteButton);

        newRow.appendChild(imageCell);
        newRow.appendChild(nameCell);
        newRow.appendChild(actionCell);

        document.querySelector("#image-table tbody").appendChild(newRow);

        imageUrls.push(imageUrl);
      } catch (error) {
        console.error("Error handling uploaded image:", error);
      }

      function createLoadingRow() {
        var loadingRow = document.createElement("tr");

        var loadingCell = document.createElement("td");
        loadingCell.colSpan = 3;
        loadingCell.style.textAlign = "center";

        var icon = document.createElement("i");
        icon.className = "ti-reload ti-spin";
        icon.style.color = "#57B657";

        loadingCell.appendChild(icon);
        loadingCell.appendChild(document.createTextNode(" Loading image..."));

        loadingRow.appendChild(loadingCell);

        return loadingRow;
      }
    };

    reader.readAsDataURL(file);
  });

function createNoDataRow() {
  var noDataRow = document.createElement("tr");

  var noDataCell = document.createElement("td");
  noDataCell.colSpan = 3;
  noDataCell.style.textAlign = "center";

  var noDataContent = document.createElement("span");
  noDataContent.textContent = "No Data";
  noDataContent.style.marginRight = "5px";
  var icon = document.createElement("i");
  icon.className = "ti-package";
  icon.style.color = "#ccc";

  noDataCell.appendChild(noDataContent);
  noDataCell.appendChild(icon);

  noDataRow.appendChild(noDataCell);

  return noDataRow;
}

var imageUrls = [];

document
  .querySelector("#image-table")
  .addEventListener("click", function (event) {
    if (event.target.classList.contains("delete-btn")) {
      var row = event.target.closest("tr");
      var index = Array.from(row.parentElement.children).indexOf(row); // Lấy chỉ số của dòng trong bảng
      imageUrls.splice(index, 1);
      row.remove();
      if (imageUrls.length === 0) {
        document.querySelector("#image-table tbody").appendChild(noData);
      }
    }
  });

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("myForm")
    .addEventListener("submit", function (event) {
      event.preventDefault();

      var brandName = document.getElementById("brand-name").value;
      var name = document.getElementById("name").value;
      var year = document.getElementById("year").value;
      var type = document.getElementById("type").value;
      var positonRow = document.getElementById("position-row").value;
      var numberColumns = document.getElementById("number-columns").value;
      var position = document.getElementById("position").value;
      var contentDesc = document.getElementById("content-desc").value;
      var approach = document.getElementById("approach").value;
      var brief = document.getElementById("brief").value;
      var solution = document.getElementById("solution").value;
      var images = [];
      for (var i = 0; i < imageUrls.length; i++) {
        var obj = {
          alt: brandName,
          url: imageUrls[i],
        };
        images.push(obj);
      }

      var formData = {
        alt: brandName,
        brandName: brandName,
        detail: {
          approach: approach,
          brief: brief,
          solution: solution,
          images: images,
          name: contentDesc,
        },
        id: "",
        image: imageUrls[0],
        positonRow: positonRow,
        numberCol: parseInt(numberColumns),
        location: parseInt(position),
        name: name,
        year: year,
        type: type,
      };

      console.log(formData);

      let brand = [];
      let urlPostData = "";
      let urlPutId = "";
      fetch("https://bethany-eb426-default-rtdb.firebaseio.com/.json")
        .then((response) => response.json())
        .then((data) => {
          for (const key in data.brands) {
            brand.push(key);
          }
          console.log(brand);
          if (formData.positonRow.toString() === "New row") {
            console.log(formData.positonRow.toString() === "New row");
            urlPostData = `https://bethany-eb426-default-rtdb.firebaseio.com/brands/${brand.length}.json`;
            urlPutId = `https://bethany-eb426-default-rtdb.firebaseio.com/brands/${brand.length}/`;
            console.log(urlPostData);
          } else {
            const idBrand = parseInt(formData.positonRow) - 1;
            urlPostData = `https://bethany-eb426-default-rtdb.firebaseio.com/brands/${idBrand}.json`;
            urlPutId = `https://bethany-eb426-default-rtdb.firebaseio.com/brands/${idBrand}/`;
            console.log(urlPostData);
          }
          fetch(urlPostData, {
            method: "POST",
            body: JSON.stringify(formData),
          })
            .then((response) => response.json())
            .then((data) => {
              fetch(urlPutId + data.name + ".json", {
                method: "PATCH",
                body: JSON.stringify({ id: data.name }),
              })
                .then((response) => response.json())
                .then((data) => {})
                .catch((error) => {
                  console.error(
                    "Đã xảy ra lỗi khi cập nhật dữ liệu trên Firebase:",
                    error
                  );
                });
              alert("Add Brand Success!!!");
            })
            .catch((error) => {
              console.error(
                "Đã xảy ra lỗi khi gửi dữ liệu lên Firebase:",
                error
              );
              // Xử lý lỗi nếu cần
            });
        })
        .catch((error) => {
          console.error(
            "Đã xảy ra lỗi khi lấy dữ liệu từ Firebase Database:",
            error
          );
        });
    });
});

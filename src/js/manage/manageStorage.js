const storageList = document.getElementById("storage-list");
const storageForm = document.getElementById("storage-form");

async function getStorageCount() {
  const snapshot = await db.collection("storageData").get();
  const count = snapshot.size;
  return count;
}

function generateStorageId(number) {
  return "storage" + String(number).padStart(3, "0");
}

async function generateNextStorageId() {
  const count = await getStorageCount();
  const nextId = generateStorageId(count + 1);
  console.log("Mã ID tiếp theo:", nextId);
  return nextId;
}

function loadStorage() {
  let htmls = "";
  db.collection("storageData")
    .orderBy("id", "desc")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const storageData = doc.data();
        const storageId = doc.id;
        const formattedPrice = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(storageData.price);

        htmls += `
          <li class="list-group-item d-flex justify-content-between align-items-center">
            <div class="row">
              <div class="col-md-2">
                  <img src="${storageData.imageUrl}" class="img-fluid">
              </div>
              <div class="col-md-10">
                  <h5>${storageData.title}</h5>
                  <p>ID: ${storageId}</p>
                  <p>Name: ${storageData.name}</p>
                  <p>Price: ${formattedPrice}</p>
                  <p>Type: ${storageData.type}</p>
                  <p>Capacity: ${storageData.capacity}</p>
                  <p>Form Factor: ${storageData.formFactor}</p>
                  <p>Interface: ${storageData.interface}</p>
                  <p>Description: ${storageData.description}</p>
                  <p>Rating: ${storageData.rating}</p>
                  <button class="btn btn-warning storage-edit-btn" type="button" data-bs-toggle="collapse" data-bs-target="#collapseEdit" aria-expanded="false" aria-controls="collapseEdit" data-id="${storageId}">Edit Storage</button>
                    <div class="collapse" id="collapseEdit">
                      <div class="card card-body">
                        <form id="edit-storage-form">
                          <input type="text" id="edit-storage-title" class="form-control mb-2" placeholder="Title" value="${storageData.title}"/>
                          <input type="text" id="edit-storage-name" class="form-control mb-2" placeholder="Name" value="${storageData.name}"/>
                          <input type="number" id="edit-storage-price" class="form-control mb-2" placeholder="Price" value="${storageData.price}"/>
                          <input type="text" id="edit-storage-type" class="form-control mb-2" placeholder="Type" value="${storageData.type}"/>
                          <input type="text" id="edit-storage-capacity" class="form-control mb-2" placeholder="Capacity" value="${storageData.capacity}"/>
                          <input type="text" id="edit-storage-form-factor" class="form-control mb-2" placeholder="Form Factor" value="${storageData.formFactor}"/>
                          <input type="text" id="edit-storage-interface" class="form-control mb-2" placeholder="Interface" value="${storageData.interface}"/>
                          <textarea id="edit-storage-description" class="form-control mb-2" placeholder="Description" rows="3">${storageData.description}</textarea>
                          <input type="number" id="edit-storage-rating" class="form-control mb-2" placeholder="Rating" value="${storageData.rating}"/>
                          <input type="file" id="edit-storage-image" class="form-control mb-2" placeholder="Image"/>
                          <button type="submit" class="btn btn-primary">Save Changes</button>
                        </form>
                      </div>
                    </div>
                  <button class="btn btn-danger storage-delete-btn" data-id="${storageId}">Delete Storage</button>
              </div>
            </div>
          </li>
        `;
      });
      storageList.innerHTML += htmls;

      const btnDelete = document.querySelectorAll(".storage-delete-btn");
      btnDelete.forEach((btn) => {
        btn.addEventListener("click", () => {
          const productId = btn.getAttribute("data-id");
          deleteStorage(productId);
        });
      });
      const btnEdit = document.querySelectorAll(".storage-edit-btn");
      btnEdit.forEach((btn) => {
        btn.addEventListener("click", () => {
          const productId = btn.getAttribute("data-id");
          editStorage(productId);
        });
      });
    })
    .catch((error) => {
      htmls += `<li class="list-group-item">Error fetching storage data: ${error.message}</li>`;
      storageList.innerHTML += htmls;
      console.error("Error fetching storage data:", error);
    });
}

storageForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const storageTitle = document.getElementById("storage-title").value;
  const storageName = document.getElementById("storage-name").value;
  const storagePrice = document.getElementById("storage-price").value;
  const storageImage = document.getElementById("storage-image").files[0];
  const storageType = document.getElementById("storage-type").value;
  const storageCapacity = document.getElementById("storage-capacity").value;
  const storageFormFactor = document.getElementById(
    "storage-form-factor"
  ).value;
  const storageInterface = document.getElementById("storage-interface").value;
  const storageDescription = document.getElementById(
    "storage-description"
  ).value;
  const storageRating = 0; // Default rating
  const storageId = await generateNextStorageId();

  let formData = new FormData();
  if (storageImage) {
    formData.append("image", storageImage);
  }

  fetch("https://server-file-upload.onrender.com/upload", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((result) => {
      return db
        .collection("storageData")
        .doc(storageId)
        .set({
          id: storageId,
          title: storageTitle,
          name: storageName,
          price: parseFloat(storagePrice),
          imageUrl: result.data.secure_url,
          type: storageType,
          capacity: storageCapacity,
          formFactor: storageFormFactor,
          interface: storageInterface,
          description: storageDescription,
          rating: storageRating,
        });
    })
    .then(() => {
      alert("Storage added successfully!");
      storageForm.reset();
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error adding storage:", error);
    });
});

function deleteStorage(storageId) {
  if (confirm("Are you sure you want to delete this storage?")) {
    db.collection("storageData")
      .doc(storageId)
      .delete()
      .then(() => {
        console.log("Storage deleted successfully!");
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error deleting storage:", error);
      });
  }
}

function editStorage(storageId) {
  const editForm = document.getElementById("edit-storage-form");

  editForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const storageTitle = document.getElementById("edit-storage-title").value;
    const storageName = document.getElementById("edit-storage-name").value;
    const storagePrice = document.getElementById("edit-storage-price").value;
    const storageImageFile =
      document.getElementById("edit-storage-image").files[0];
    const storageType = document.getElementById("edit-storage-type").value;
    const storageCapacity = document.getElementById(
      "edit-storage-capacity"
    ).value;
    const storageFormFactor = document.getElementById(
      "edit-storage-form-factor"
    ).value;
    const storageInterface = document.getElementById(
      "edit-storage-interface"
    ).value;
    const storageDescription = document.getElementById(
      "edit-storage-description"
    ).value;
    const storageRating = document.getElementById("edit-storage-rating").value;

    let updateData = {
      title: storageTitle,
      name: storageName,
      price: parseFloat(storagePrice),
      type: storageType,
      capacity: storageCapacity,
      formFactor: storageFormFactor,
      interface: storageInterface,
      description: storageDescription,
      rating: parseFloat(storageRating) || 0,
    };

    // Hàm update vào Firestore
    function updateStorage(imageUrl) {
      if (imageUrl) {
        updateData.imageUrl = imageUrl;
      }

      db.collection("storageData")
        .doc(storageId)
        .update(updateData)
        .then(function () {
          alert("Storage updated successfully!");
          console.log("Storage updated successfully!");
          window.location.reload();
        })
        .catch(function (error) {
          console.error("Error updating storage:", error);
          alert("Có lỗi khi cập nhật storage, vui lòng thử lại!");
        });
    }

    // Nếu có ảnh thì upload trước, rồi mới update Firestore
    if (storageImageFile) {
      let formData = new FormData();
      formData.append("image", storageImageFile);

      fetch("https://server-file-upload.onrender.com/upload", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((result) => {
          if (result && result.data && result.data.secure_url) {
            updateStorage(result.data.secure_url); // update Firestore kèm ảnh
          } else {
            throw new Error("Không nhận được secure_url từ server upload!");
          }
        })
        .catch((error) => {
          console.error("Error uploading image:", error);
          alert("Có lỗi khi upload ảnh!");
        });
    } else {
      // Nếu không có ảnh thì update luôn
      updateStorage();
    }
  });
}

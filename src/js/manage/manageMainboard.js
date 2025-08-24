const mainboardList = document.getElementById("mainboard-list");
const mainboardForm = document.getElementById("mainboard-form");

async function getMainboardCount() {
  const snapshot = await db.collection("mainboardData").get();
  const count = snapshot.size;
  return count;
}

function generateMainboardId(number) {
  return "mainboard" + String(number).padStart(3, "0");
}

async function generateNextMainboardId() {
  const count = await getMainboardCount();
  const nextId = generateMainboardId(count + 1);
  console.log("Mã ID tiếp theo:", nextId);
  return nextId;
}

function loadMainboard() {
  let htmls = "";
  db.collection("mainboardData")
    .orderBy("id", "desc")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const mainboardData = doc.data();
        const mainboardId = doc.id;
        const formattedPrice = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(mainboardData.price);

        htmls += `
          <li class="list-group-item d-flex justify-content-between align-items-center">
            <div class="row">
              <div class="col-md-2">
                  <img src="${mainboardData.imageUrl}" class="img-fluid">
              </div>
              <div class="col-md-10">
                  <h5>${mainboardData.title}</h5>
                  <p>ID: ${mainboardId}</p>
                  <p>Chipset: ${mainboardData.chipset}</p>
                  <p>Price: ${formattedPrice}</p>
                  <p>Length: ${mainboardData.length}</p>
                  <p>Memory: ${mainboardData.memory}</p>
                  <p>Core Clock: ${mainboardData.coreClock}</p>
                  <p>Description: ${mainboardData.description}</p>
                  <p>Rating: ${mainboardData.rating}</p>
                  <button class="btn btn-warning gpu-edit-btn" type="button" data-bs-toggle="collapse" data-bs-target="#collapseEdit" aria-expanded="false" aria-controls="collapseEdit" data-id="${mainboardId}">Edit GPU</button>
                    <div class="collapse" id="collapseEdit">
                      <div class="card card-body">
                        <form id="edit-gpu-form">
                          <input type="hidden" id="edit-gpu-id" value="${mainboardId}" />
                          <input type="text" id="edit-gpu-title" class="form-control mb-2" placeholder="Title" value="${mainboardData.title}" />
                          <input type="text" id="edit-gpu-chipset" class="form-control mb-2" placeholder="Chipset" value="${mainboardData.chipset}" />
                          <input type="number" id="edit-gpu-price" class="form-control mb-2" placeholder="Price" value="${mainboardData.price}" />
                          <input type="text" id="edit-gpu-length" class="form-control mb-2" placeholder="Length" value="${mainboardData.length}" />
                          <input type="text" id="edit-gpu-memory" class="form-control mb-2" placeholder="Memory" value="${mainboardData.memory}" />
                          <input type="text" id="edit-gpu-core-clock" class="form-control mb-2" placeholder="Core Clock" value="${mainboardData.coreClock}" />
                          <input type="number" id="edit-gpu-rating" class="form-control mb-2" placeholder="Rating" value="${mainboardData.rating}" />
                          <textarea id="edit-gpu-description" class="form-control mb-2" placeholder="Description">${mainboardData.description}</textarea>
                          <input type="file" id="edit-gpu-image" class="form-control mb-2" />
                          <button type="submit" class="btn btn-primary">Save Changes</button>
                        </form>
                      </div>
                    </div>
                  <button class="btn btn-danger gpu-delete-btn" data-id="${mainboardId}">Delete GPU</button>
              </div>
            </div>
          </li>
        `;
      });
      mainboardList.innerHTML += htmls;

      const btnDelete = document.querySelectorAll(".gpu-delete-btn");
      btnDelete.forEach((btn) => {
        btn.addEventListener("click", () => {
          const productId = btn.getAttribute("data-id");
          deleteGPU(productId);
        });
      });
      const btnEdit = document.querySelectorAll(".gpu-edit-btn");
      btnEdit.forEach((btn) => {
        btn.addEventListener("click", () => {
          const productId = btn.getAttribute("data-id");
          editGPU(productId);
        });
      });
    })
    .catch((error) => {
      htmls += `<li class="list-group-item">Error fetching GPU data: ${error.message}</li>`;
      mainboardList.innerHTML += htmls;
      console.error("Error fetching GPU data:", error);
    });
}

gpuForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const gpuTitle = document.getElementById("gpu-title").value;
  const gpuChipset = document.getElementById("gpu-chipset").value;
  const gpuPrice = document.getElementById("gpu-price").value;
  const gpuImage = document.getElementById("gpu-image").files[0];
  const gpuLength = document.getElementById("gpu-length").value;
  const gpuMemory = document.getElementById("gpu-memory").value;
  const gpuCoreClock = document.getElementById("gpu-core-clock").value;
  const gpuDescription = document.getElementById("gpu-description").value;
  const gpuRating = 0; // Default rating
  const gpuId = await generateNextGPUId();

  let formData = new FormData();
  if (gpuImage) {
    formData.append("image", gpuImage);
  }

  fetch("https://server-file-upload.onrender.com/upload", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((result) => {
      return db
        .collection("mainboardData")
        .doc(gpuId)
        .set({
          id: gpuId,
          title: gpuTitle,
          chipset: gpuChipset,
          price: parseFloat(gpuPrice),
          imageUrl: result.data.secure_url,
          length: gpuLength,
          memory: gpuMemory,
          coreClock: gpuCoreClock,
          description: gpuDescription,
          rating: gpuRating,
        });
    })
    .then(() => {
      alert("GPU added successfully!");
      gpuForm.reset();
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error adding GPU:", error);
    });
});

function deleteGPU(gpuId) {
  if (confirm("Are you sure you want to delete this GPU?")) {
    db.collection("gpuData")
      .doc(gpuId)
      .delete()
      .then(() => {
        console.log("GPU deleted successfully!");
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error deleting GPU:", error);
      });
  }
}

function editGPU(gpuId) {
  const editForm = document.getElementById("edit-gpu-form");

  editForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const gpuTitle = document.getElementById("edit-gpu-title").value;
    const gpuChipset = document.getElementById("edit-gpu-chipset").value;
    const gpuPrice = document.getElementById("edit-gpu-price").value;
    const gpuImageFile = document.getElementById("edit-gpu-image").files[0];
    const gpuLength = document.getElementById("edit-gpu-length").value;
    const gpuMemory = document.getElementById("edit-gpu-memory").value;
    const gpuCoreClock = document.getElementById("edit-gpu-core-clock").value;
    const gpuDescription = document.getElementById(
      "edit-gpu-description"
    ).value;
    const gpuRating = 0; // Default rating

    let updateData = {
      title: gpuTitle,
      chipset: gpuChipset,
      price: parseFloat(gpuPrice),
      length: gpuLength,
      memory: gpuMemory,
      coreClock: gpuCoreClock,
      description: gpuDescription,
      rating: gpuRating,
    };

    // Hàm update vào Firestore
    function updateGPU(imageUrl) {
      if (imageUrl) {
        updateData.imageUrl = imageUrl;
      }

      db.collection("gpuData")
        .doc(gpuId)
        .update(updateData)
        .then(function () {
          alert("GPU updated successfully!");
          console.log("GPU updated successfully!");
          window.location.reload();
        })
        .catch(function (error) {
          console.error("Error updating GPU:", error);
          alert("Có lỗi khi cập nhật case, vui lòng thử lại!");
        });
    }

    // Nếu có ảnh thì upload trước, rồi mới update Firestore
    if (gpuImageFile) {
      let formData = new FormData();
      formData.append("image", gpuImageFile);

      fetch("https://server-file-upload.onrender.com/upload", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((result) => {
          if (result && result.data && result.data.secure_url) {
            updateGPU(result.data.secure_url); // update Firestore kèm ảnh
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
      updateGPU();
    }
  });
}

const cpuCoolerList = document.getElementById("cpu-cooler-list");
const cpuCoolerForm = document.getElementById("cpu-cooler-form");

async function getCPUCoolerCount() {
  const snapshot = await db.collection("cpuCoolerData").get();
  const count = snapshot.size;
  console.log("Số lượng CPU Cooler hiện có:", count);
  return count;
}

function generateCPUCoolerId(number) {
  return "cooler" + String(number).padStart(3, "0");
}

async function generateNextCPUCoolerId() {
  const count = await getCPUCoolerCount();
  const nextId = generateCPUCoolerId(count + 1);
  console.log("Mã ID tiếp theo:", nextId);
  return nextId;
}

function loadCPUCooler() {
  let htmls = "";
  db.collection("cpuCoolerData")
    .orderBy("id", "desc")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const cpuCoolerData = doc.data();
        const cpuCoolerId = doc.id;
        const formattedPrice = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(cpuCoolerData.price);

        htmls += `
          <li class="list-group-item d-flex justify-content-between align-items-center" data-price="${cpuCoolerData.price}">
            <div class="row">
              <div class="col-md-2">
                  <img src="${cpuCoolerData.imageUrl}" class="img-fluid">
              </div>
              <div class="col-md-10">
                  <h5>${cpuCoolerData.title}</h5>
                  <p>ID: ${cpuCoolerId}</p>
                  <p>Name: ${cpuCoolerData.name}</p>
                  <p>Price: ${formattedPrice}</p>
                  <p>Fan RPM: ${cpuCoolerData.fanRPM}</p>
                  <p>Noise Level: ${cpuCoolerData.noiseLevel}</p>
                  <p>Radiator Size: ${cpuCoolerData.radiatorSize}</p>
                  <p>Description: ${cpuCoolerData.description}</p>
                  <p>Rating: ${cpuCoolerData.rating}</p>
                  <button class="btn btn-warning cpu-cooler-edit-btn" type="button" data-bs-toggle="collapse" data-bs-target="#collapseEdit" aria-expanded="false" aria-controls="collapseEdit" data-id="${cpuCoolerId}">Edit CPU Cooler</button>
                    <div class="collapse" id="collapseEdit">
                      <div class="card card-body">
                        <form id="edit-cpu-cooler-form">
                          <input type="hidden" id="edit-cpu-cooler-id" value="${cpuCoolerId}" />
                          <input type="text" id="edit-cpu-cooler-title" class="form-control mb-2" placeholder="Title" value="${cpuCoolerData.title}" />
                          <input type="text" id="edit-cpu-cooler-name" class="form-control mb-2" placeholder="Name" value="${cpuCoolerData.name}" />
                          <input type="number" id="edit-cpu-cooler-price" class="form-control mb-2" placeholder="CPU Price" value="${cpuCoolerData.price}" />
                          <input type="text" id="edit-cpu-cooler-fan-rpm" class="form-control mb-2" placeholder="Fan RPM" value="${cpuCoolerData.fanRPM}" />
                          <input type="text" id="edit-cpu-cooler-noise-level" class="form-control mb-2" placeholder="Noise Level" value="${cpuCoolerData.noiseLevel}" />
                          <input type="text" id="edit-cpu-cooler-radiator-size" class="form-control mb-2" placeholder="Radiator Size" value="${cpuCoolerData.radiatorSize}" />
                          <input type="number" id="edit-cpu-cooler-rating" class="form-control mb-2" placeholder="Rating" value="${cpuCoolerData.rating}" />
                          <textarea id="edit-cpu-cooler-description" class="form-control mb-2" placeholder="Description">${cpuCoolerData.description}</textarea>
                          <input type="file" id="edit-cpu-cooler-image" class="form-control mb-2" />
                          <button type="submit" class="btn btn-primary">Save Changes</button>
                        </form>
                      </div>
                    </div>
                  <button class="btn btn-danger cpu-cooler-delete-btn" data-id="${cpuCoolerId}">Delete CPU</button>
              </div>
            </div>
          </li>
        `;
      });
      cpuCoolerList.innerHTML += htmls;

      const btnDelete = document.querySelectorAll(".cpu-cooler-delete-btn");
      btnDelete.forEach((btn) => {
        btn.addEventListener("click", () => {
          const productId = btn.getAttribute("data-id");
          deleteCPUCooler(productId);
        });
      });
      const btnEdit = document.querySelectorAll(".cpu-cooler-edit-btn");
      btnEdit.forEach((btn) => {
        btn.addEventListener("click", () => {
          const productId = btn.getAttribute("data-id");
          editCPUCooler(productId);
        });
      });
    })
    .catch((error) => {
      htmls += `<li class="list-group-item">Error fetching CPU Cooler data: ${error.message}</li>`;
      cpuCoolerList.innerHTML += htmls;
      console.error("Error fetching CPU Cooler data:", error);
    });
}
cpuCoolerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const cpuCoolerTitle = document.getElementById("cpu-cooler-title").value;
  const cpuCoolerName = document.getElementById("cpu-cooler-name").value;
  const cpuCoolerPrice = document.getElementById("cpu-cooler-price").value;
  const cpuCoolerImage = document.getElementById("cpu-cooler-image").files[0];
  const cpuCoolerFanRPM = document.getElementById("cpu-cooler-fan-rpm").value;
  const cpuCoolerNoiseLevel = document.getElementById(
    "cpu-cooler-noise-level"
  ).value;
  const cpuCoolerRadiatorSize = document.getElementById(
    "cpu-cooler-radiator-size"
  ).value;
  const cpuCoolerDescription = document.getElementById(
    "cpu-cooler-description"
  ).value;
  const cpuCoolerRating = 0; // Default rating
  const cpuCoolerId = await generateNextCPUCoolerId();

  let formData = new FormData();
  if (cpuCoolerImage) {
    formData.append("image", cpuCoolerImage);
  }

  fetch("https://server-file-upload.onrender.com/upload", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((result) => {
      return db
        .collection("cpuCoolerData")
        .doc(cpuCoolerId)
        .set({
          id: cpuCoolerId,
          title: cpuCoolerTitle,
          name: cpuCoolerName,
          price: parseFloat(cpuCoolerPrice),
          imageUrl: result.data.secure_url,
          fanRPM: cpuCoolerFanRPM,
          noiseLevel: cpuCoolerNoiseLevel,
          radiatorSize: cpuCoolerRadiatorSize,
          description: cpuCoolerDescription,
          rating: cpuCoolerRating,
        });
    })
    .then(() => {
      alert("CPU Cooler added successfully!");
      cpuCoolerForm.reset();
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error adding CPU Cooler:", error);
    });
});

function deleteCPUCooler(cpuCoolerId) {
  if (confirm("Are you sure you want to delete this CPU Cooler?")) {
    db.collection("cpuCoolerData")
      .doc(cpuCoolerId)
      .delete()
      .then(() => {
        console.log("CPU Cooler deleted successfully!");
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error deleting CPU Cooler:", error);
      });
  }
}

function editCPUCooler(cpuCoolerId) {
  const editForm = document.getElementById("edit-cpu-cooler-form");

  editForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const cpuCoolerTitle = document.getElementById(
      "edit-cpu-cooler-title"
    ).value;
    const cpuCoolerName = document.getElementById("edit-cpu-cooler-name").value;
    const cpuCoolerPrice = document.getElementById(
      "edit-cpu-cooler-price"
    ).value;
    const cpuCoolerImageFile = document.getElementById("edit-cpu-cooler-image")
      .files[0];
    const cpuCoolerFanRPM = document.getElementById(
      "edit-cpu-cooler-fan-rpm"
    ).value;
    const cpuCoolerNoiseLevel = document.getElementById(
      "edit-cpu-cooler-noise-level"
    ).value;
    const cpuCoolerRadiatorSize = document.getElementById(
      "edit-cpu-cooler-radiator-size"
    ).value;
    const cpuCoolerDescription = document.getElementById(
      "edit-cpu-cooler-description"
    ).value;
    const cpuCoolerRating = document.getElementById("edit-cpu-cooler-rating"); // Default rating

    let updateData = {
      id: cpuCoolerId,
      title: cpuCoolerTitle,
      name: cpuCoolerName,
      price: parseFloat(cpuCoolerPrice),
      fanRPM: cpuCoolerFanRPM,
      noiseLevel: cpuCoolerNoiseLevel,
      radiatorSize: cpuCoolerRadiatorSize,
      description: cpuCoolerDescription,
      rating: parseFloat(cpuCoolerRating) || 0,
    };

    // Hàm update vào Firestore
    function updateCPUCooler(imageUrl) {
      if (imageUrl) {
        updateData.imageUrl = imageUrl;
      }

      db.collection("cpuCoolerData")
        .doc(cpuCoolerId)
        .update(updateData)
        .then(function () {
          alert("CPU Cooler updated successfully!");
          console.log("CPU Cooler updated successfully!");
          window.location.reload();
        })
        .catch(function (error) {
          console.error("Error updating CPU Cooler:", error);
          alert("Có lỗi khi cập nhật CPU Cooler, vui lòng thử lại!");
        });
    }

    // Nếu có ảnh thì upload trước, rồi mới update Firestore
    if (cpuCoolerImageFile) {
      let formData = new FormData();
      formData.append("image", cpuCoolerImageFile);

      fetch("https://server-file-upload.onrender.com/upload", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((result) => {
          if (result && result.data && result.data.secure_url) {
            updateCPUCooler(result.data.secure_url); // update Firestore kèm ảnh
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
      updateCPUCooler();
    }
  });
}

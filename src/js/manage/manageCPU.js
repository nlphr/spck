const cpuList = document.getElementById("cpu-list");
const cpuForm = document.getElementById("cpu-form");

async function getCpuCount() {
  const snapshot = await db.collection("cpuData").get();
  const count = snapshot.size;
  return count;
}

function generateCpuId(number) {
  return "cpu" + String(number).padStart(3, "0");
}

async function generateNextCpuId() {
  const count = await getCpuCount();
  const nextId = generateCpuId(count + 1);
  console.log("Mã ID tiếp theo:", nextId);
  return nextId;
}

function loadCPU() {
  let htmls = "";
  db.collection("cpuData")
    .orderBy("id", "desc")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const cpuData = doc.data();
        const cpuId = doc.id;
        const formattedPrice = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(cpuData.price);

        htmls += `
          <li class="list-group-item d-flex justify-content-between align-items-center">
            <div class="row">
              <div class="col-md-2">
                  <img src="${cpuData.imageUrl}" class="img-fluid">
              </div>
              <div class="col-md-10">
                  <h5>${cpuData.title}</h5>
                  <p>ID: ${cpuId}</p>
                  <p>Price: ${formattedPrice}</p>
                  <p>Micro Architecture: ${cpuData.microarchitecture}</p>
                  <p>TPD: ${cpuData.TPD}</p>
                  <p>Cores: ${cpuData.coreCount}</p>
                  <p>Performance Core Clock: ${cpuData.performanceCoreClock}</p>
                  <p>Description: ${cpuData.description}</p>
                  <p>Rating: ${cpuData.rating}</p>
                  <button class="btn btn-warning cpu-edit-btn" type="button" data-bs-toggle="collapse" data-bs-target="#collapseEdit" aria-expanded="false" aria-controls="collapseEdit" data-id="${cpuId}">Edit CPU</button>
                    <div class="collapse" id="collapseEdit">
                      <div class="card card-body">
                        <form id="edit-cpu-form">
                          <input type="hidden" id="edit-cpu-id" value="${cpuId}" />
                          <input type="text" id="edit-cpu-title" class="form-control mb-2" placeholder="CPU Name" value="${cpuData.title}" />
                          <input type="number" id="edit-cpu-price" class="form-control mb-2" placeholder="CPU Price" value="${cpuData.price}" />
                          <input type="text" id="edit-cpu-microarchitecture" class="form-control mb-2" placeholder="Micro Architecture" value="${cpuData.microarchitecture}" />
                          <input type="text" id="edit-cpu-tpd" class="form-control mb-2" placeholder="TPD" value="${cpuData.TPD}" />
                          <input type="number" id="edit-cpu-core-count" class="form-control mb-2" placeholder="Core Count" value="${cpuData.coreCount}" />
                          <input type="text" id="edit-cpu-performance-core-clock" class="form-control mb-2" placeholder="Performance Core Clock" value="${cpuData.performanceCoreClock}" />
                          <input type="number" id="edit-cpu-rating" class="form-control mb-2" placeholder="Rating" value="${cpuData.rating}" />
                          <textarea id="edit-cpu-description" class="form-control mb-2" placeholder="Description">${cpuData.description}</textarea>
                          <input type="file" id="edit-cpu-image" class="form-control mb-2" />
                          <button type="submit" class="btn btn-primary">Save Changes</button>
                        </form>
                      </div>
                    </div>
                  <button class="btn btn-danger cpu-delete-btn" data-id="${cpuId}">Delete CPU</button>
              </div>
            </div>
          </li>
        `;
      });
      cpuList.innerHTML += htmls;

      const btnDelete = document.querySelectorAll(".cpu-delete-btn");
      btnDelete.forEach((btn) => {
        btn.addEventListener("click", () => {
          const productId = btn.getAttribute("data-id");
          deleteCPU(productId);
          loadCPU();
        });
      });
      const btnEdit = document.querySelectorAll(".cpu-edit-btn");
      btnEdit.forEach((btn) => {
        btn.addEventListener("click", () => {
          const productId = btn.getAttribute("data-id");
          editCPU(productId);
        });
      });
    })
    .catch((error) => {
      htmls += `<li class="list-group-item">Error fetching CPU data: ${error.message}</li>`;
      cpuList.innerHTML += htmls;
      console.error("Error fetching CPU data:", error);
    });
}

cpuForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const cpuTitle = document.getElementById("cpu-title").value;
  const cpuPrice = document.getElementById("cpu-price").value;
  const cpuImage = document.getElementById("cpu-image").files[0];
  const cpuMicroarchitecture = document.getElementById(
    "cpu-microarchitecture"
  ).value;
  const cpuTPD = document.getElementById("cpu-tpd").value;
  const cpuCoreCount = document.getElementById("cpu-core-count").value;
  const cpuPerformanceCoreClock = document.getElementById(
    "cpu-performance-core-clock"
  ).value;
  const cpuDescription = document.getElementById("cpu-description").value;
  const cpuRating = 0; // Default rating
  const cpuId = await generateNextCpuId();

  let formData = new FormData();
  if (cpuImage) {
    formData.append("image", cpuImage);
  }

  fetch("https://server-file-upload.onrender.com/upload", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((result) => {
      return db
        .collection("cpuData")
        .doc(cpuId)
        .set({
          id: cpuId,
          title: cpuTitle,
          price: parseFloat(cpuPrice),
          imageUrl: result.data.secure_url,
          microarchitecture: cpuMicroarchitecture,
          TPD: cpuTPD,
          coreCount: parseInt(cpuCoreCount),
          performanceCoreClock: cpuPerformanceCoreClock,
          description: cpuDescription,
          rating: cpuRating,
        });
    })
    .then(() => {
      alert("CPU added successfully!");
      cpuForm.reset();
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error adding CPU:", error);
    });
});

function deleteCPU(cpuId) {
  if (confirm("Are you sure you want to delete this CPU?")) {
    db.collection("cpuData")
      .doc(cpuId)
      .delete()
      .then(() => {
        console.log("CPU deleted successfully!");
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error deleting CPU:", error);
      });
  }
}

function editCPU(cpuId) {
  const editForm = document.getElementById("edit-cpu-form");

  editForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const cpuTitle = document.getElementById("edit-cpu-title").value;
    const cpuPrice = document.getElementById("edit-cpu-price").value;
    const cpuImageFile = document.getElementById("edit-cpu-image").files[0];
    const cpuMicroarchitecture = document.getElementById(
      "edit-cpu-microarchitecture"
    ).value;
    const cpuTPD = document.getElementById("edit-cpu-tpd").value;
    const cpuCoreCount = document.getElementById("edit-cpu-core-count").value;
    const cpuPerformanceCoreClock = document.getElementById(
      "edit-cpu-performance-core-clock"
    ).value;
    const cpuRating = document.getElementById("edit-cpu-rating").value;
    const cpuDescription = document.getElementById(
      "edit-cpu-description"
    ).value;

    let updateData = {
      title: cpuTitle,
      price: parseFloat(cpuPrice),
      microarchitecture: cpuMicroarchitecture,
      TPD: cpuTPD,
      coreCount: parseInt(cpuCoreCount),
      performanceCoreClock: cpuPerformanceCoreClock,
      description: cpuDescription,
      rating: parseFloat(cpuRating) || 0,
    };

    // Hàm update vào Firestore
    function updateCPU(imageUrl) {
      if (imageUrl) {
        updateData.imageUrl = imageUrl;
      }

      db.collection("cpuData")
        .doc(cpuId)
        .update(updateData)
        .then(function () {
          alert("CPU updated successfully!");
          console.log("CPU updated successfully!");
          window.location.reload();
        })
        .catch(function (error) {
          console.error("Error updating CPU:", error);
          alert("Có lỗi khi cập nhật CPU, vui lòng thử lại!");
        });
    }

    // Nếu có ảnh thì upload trước, rồi mới update Firestore
    if (cpuImageFile) {
      let formData = new FormData();
      formData.append("image", cpuImageFile);

      fetch("https://server-file-upload.onrender.com/upload", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((result) => {
          if (result && result.data && result.data.secure_url) {
            updateCPU(result.data.secure_url); // update Firestore kèm ảnh
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
      updateCPU();
    }
  });
}

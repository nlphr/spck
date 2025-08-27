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
                  <p>Name: ${mainboardData.name}</p>
                  <p>Price: ${formattedPrice}</p>
                  <p>Memory Slots: ${mainboardData.memorySlots}</p>
                  <p>Memory Max: ${mainboardData.memoryMax}</p>
                  <p>Form Factor: ${mainboardData.formFactor}</p>
                  <p>CPU Socket: ${mainboardData.cpuSocket}</p>
                  <p>Description: ${mainboardData.description}</p>
                  <p>Rating: ${mainboardData.rating}</p>
                  <button class="btn btn-warning mainboard-edit-btn" type="button" data-bs-toggle="collapse" data-bs-target="#collapseEdit" aria-expanded="false" aria-controls="collapseEdit" data-id="${mainboardId}">Edit Mainboard</button>
                    <div class="collapse" id="collapseEdit">
                      <div class="card card-body">
                        <form id="edit-mainboard-form">
                          <input type="text" id="edit-mainboard-title" class="form-control mb-2" placeholder="Title" value="${mainboardData.title}"/>
                          <input type="text" id="edit-mainboard-name" class="form-control mb-2" placeholder="Name" value="${mainboardData.name}"/>
                          <input type="number" id="edit-mainboard-price" class="form-control mb-2" placeholder="Price" value="${mainboardData.price}"/>
                          <input type="number" id="edit-mainboard-memory-slots" class="form-control mb-2" placeholder="Memory Slots" value="${mainboardData.memorySlots}"/>
                          <input type="text" id="edit-mainboard-memory-max" class="form-control mb-2" placeholder="Memory Max" value="${mainboardData.memoryMax}"/>
                          <input type="text" id="edit-mainboard-form-factor" class="form-control mb-2" placeholder="Form Factor" value="${mainboardData.formFactor}"/>
                          <input type="text" id="edit-mainboard-cpu-socket" class="form-control mb-2" placeholder="CPU Socket" value="${mainboardData.cpuSocket}"/>
                          <textarea id="edit-mainboard-description" class="form-control mb-2" placeholder="Description" rows="3">${mainboardData.description}</textarea>
                          <input type="number" id="edit-mainboard-rating" class="form-control mb-2" placeholder="Rating" value="${mainboardData.rating}"/>
                          <input type="file" id="edit-mainboard-image" class="form-control mb-2" placeholder="Image"/>
                          <button type="submit" class="btn btn-primary">Save Changes</button>
                        </form>
                      </div>
                    </div>
                  <button class="btn btn-danger mainboard-delete-btn" data-id="${mainboardId}">Delete Mainboard</button>
              </div>
            </div>
          </li>
        `;
      });
      mainboardList.innerHTML += htmls;

      const btnDelete = document.querySelectorAll(".mainboard-delete-btn");
      btnDelete.forEach((btn) => {
        btn.addEventListener("click", () => {
          const productId = btn.getAttribute("data-id");
          deleteMainboard(productId);
        });
      });
      const btnEdit = document.querySelectorAll(".mainboard-edit-btn");
      btnEdit.forEach((btn) => {
        btn.addEventListener("click", () => {
          const productId = btn.getAttribute("data-id");
          editMainboard(productId);
        });
      });
    })
    .catch((error) => {
      htmls += `<li class="list-group-item">Error fetching mainboard data: ${error.message}</li>`;
      mainboardList.innerHTML += htmls;
      console.error("Error fetching mainboard data:", error);
    });
}

mainboardForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const mainboardTitle = document.getElementById("mainboard-title").value;
  const mainboardName = document.getElementById("mainboard-name").value;
  const mainboardPrice = document.getElementById("mainboard-price").value;
  const mainboardImage = document.getElementById("mainboard-image").files[0];
  const mainboardMemorySlots = document.getElementById(
    "mainboard-memory-slots"
  ).value;
  const mainboardMemoryMax = document.getElementById(
    "mainboard-memory-max"
  ).value;
  const mainboardFormFactor = document.getElementById(
    "mainboard-form-factor"
  ).value;
  const mainboardCPUSocket = document.getElementById(
    "mainboard-cpu-socket"
  ).value;
  const mainboardDescription = document.getElementById(
    "mainboard-description"
  ).value;
  const mainboardRating = 0; // Default rating
  const mainboardId = await generateNextMainboardId();

  let formData = new FormData();
  if (mainboardImage) {
    formData.append("image", mainboardImage);
  }

  fetch("https://server-file-upload.onrender.com/upload", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((result) => {
      return db
        .collection("mainboardData")
        .doc(mainboardId)
        .set({
          id: mainboardId,
          title: mainboardTitle,
          name: mainboardName,
          price: parseFloat(mainboardPrice),
          imageUrl: result.data.secure_url,
          memorySlots: mainboardMemorySlots,
          memoryMax: mainboardMemoryMax,
          formFactor: mainboardFormFactor,
          cpuSocket: mainboardCPUSocket,
          description: mainboardDescription,
          rating: mainboardRating,
        });
    })
    .then(() => {
      alert("Mainboard added successfully!");
      mainboardForm.reset();
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error adding mainboard:", error);
    });
});

function deleteMainboard(mainboardId) {
  if (confirm("Are you sure you want to delete this mainboard?")) {
    db.collection("mainboardData")
      .doc(mainboardId)
      .delete()
      .then(() => {
        console.log("Mainboard deleted successfully!");
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error deleting mainboard:", error);
      });
  }
}

function editMainboard(mainboardId) {
  const editForm = document.getElementById("edit-mainboard-form");

  editForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const mainboardTitle = document.getElementById(
      "edit-mainboard-title"
    ).value;
    const mainboardName = document.getElementById("edit-mainboard-name").value;
    const mainboardPrice = document.getElementById(
      "edit-mainboard-price"
    ).value;
    const mainboardImageFile = document.getElementById("edit-mainboard-image")
      .files[0];
    const mainboardMemorySlots = document.getElementById(
      "edit-mainboard-memory-slots"
    ).value;
    const mainboardMemoryMax = document.getElementById(
      "edit-mainboard-memory-max"
    ).value;
    const mainboardFormFactor = document.getElementById(
      "edit-mainboard-form-factor"
    ).value;
    const mainboardCPUSocket = document.getElementById(
      "edit-mainboard-cpu-socket"
    ).value;
    const mainboardDescription = document.getElementById(
      "edit-mainboard-description"
    ).value;
    const mainboardRating = document.getElementById(
      "edit-mainboard-rating"
    ).value;

    let updateData = {
      title: mainboardTitle,
      name: mainboardName,
      price: parseFloat(mainboardPrice),
      memorySlots: mainboardMemorySlots,
      memoryMax: mainboardMemoryMax,
      formFactor: mainboardFormFactor,
      cpuSocket: mainboardCPUSocket,
      description: mainboardDescription,
      rating: parseFloat(mainboardRating) || 0,
    };

    // Hàm update vào Firestore
    function updateMainboard(imageUrl) {
      if (imageUrl) {
        updateData.imageUrl = imageUrl;
      }

      db.collection("mainboardData")
        .doc(mainboardId)
        .update(updateData)
        .then(function () {
          alert("Mainboard updated successfully!");
          console.log("Mainboard updated successfully!");
          window.location.reload();
        })
        .catch(function (error) {
          console.error("Error updating mainboard:", error);
          alert("Có lỗi khi cập nhật mainboard, vui lòng thử lại!");
        });
    }

    // Nếu có ảnh thì upload trước, rồi mới update Firestore
    if (mainboardImageFile) {
      let formData = new FormData();
      formData.append("image", mainboardImageFile);

      fetch("https://server-file-upload.onrender.com/upload", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((result) => {
          if (result && result.data && result.data.secure_url) {
            updateMainboard(result.data.secure_url); // update Firestore kèm ảnh
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
      updateMainboard();
    }
  });
}

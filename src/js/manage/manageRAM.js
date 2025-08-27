const ramList = document.getElementById("ram-list");
const ramForm = document.getElementById("ram-form");

async function getRAMCount() {
  const snapshot = await db.collection("ramData").get();
  const count = snapshot.size;
  return count;
}

function generateRAMId(number) {
  return "ram" + String(number).padStart(3, "0");
}

async function generateNextRAMId() {
  const count = await getRAMCount();
  const nextId = generateRAMId(count + 1);
  console.log("Mã ID tiếp theo:", nextId);
  return nextId;
}

function loadRAM() {
  let htmls = "";
  db.collection("ramData")
    .orderBy("id", "desc")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const ramData = doc.data();
        const ramId = doc.id;
        const formattedPrice = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(ramData.price);

        htmls += `
          <li class="list-group-item d-flex justify-content-between align-items-center">
            <div class="row">
              <div class="col-md-2">
                  <img src="${ramData.imageUrl}" class="img-fluid">
              </div>
              <div class="col-md-10">
                  <h5>${ramData.title}</h5>
                  <p>ID: ${ramId}</p>
                  <p>Name: ${ramData.name}</p>
                  <p>Price: ${formattedPrice}</p>
                  <p>Speed: ${ramData.speed}</p>
                  <p>CAS Latency: ${ramData.casLatency}</p>
                  <p>First Word Latency: ${ramData.firstWordLatency}</p>
                  <p>Modules: ${ramData.modules}</p>
                  <p>Description: ${ramData.description}</p>
                  <p>Rating: ${ramData.rating}</p>
                  <button class="btn btn-warning ram-edit-btn" type="button" data-bs-toggle="collapse" data-bs-target="#collapseEdit" aria-expanded="false" aria-controls="collapseEdit" data-id="${ramId}">Edit RAM</button>
                    <div class="collapse" id="collapseEdit">
                      <div class="card card-body">
                        <form id="edit-ram-form">
                          <input type="text" id="edit-ram-title" class="form-control mb-2" placeholder="Title" value="${ramData.title}"/>
                          <input type="text" id="edit-ram-name" class="form-control mb-2" placeholder="Name" value="${ramData.name}"/>
                          <input type="number" id="edit-ram-price" class="form-control mb-2" placeholder="Price" value="${ramData.price}"/>
                          <input type="text" id="edit-ram-speed" class="form-control mb-2" placeholder="Speed" value="${ramData.speed}"/>
                          <input type="number" id="edit-ram-cas-latency" class="form-control mb-2" placeholder="CAS Latency" value="${ramData.casLatency}"/>
                          <input type="text" id="edit-ram-first-word-latency" class="form-control mb-2" placeholder="First Word Latency" value="${ramData.firstWordLatency}"/>
                          <input type="text" id="edit-ram-modules" class="form-control mb-2" placeholder="Modules" value="${ramData.modules}"/>
                          <textarea id="edit-ram-description" class="form-control mb-2" placeholder="Description" rows="3">${ramData.description}</textarea>
                          <input type="number" id="edit-ram-rating" class="form-control mb-2" placeholder="Rating" value="${ramData.rating}"/>
                          <input type="file" id="edit-ram-image" class="form-control mb-2" placeholder="Image"/>
                          <button type="submit" class="btn btn-primary">Save Changes</button>
                        </form>
                      </div>
                    </div>
                  <button class="btn btn-danger ram-delete-btn" data-id="${ramId}">Delete RAM</button>
              </div>
            </div>
          </li>
        `;
      });
      ramList.innerHTML += htmls;

      const btnDelete = document.querySelectorAll(".ram-delete-btn");
      btnDelete.forEach((btn) => {
        btn.addEventListener("click", () => {
          const productId = btn.getAttribute("data-id");
          deleteRAM(productId);
        });
      });
      const btnEdit = document.querySelectorAll(".ram-edit-btn");
      btnEdit.forEach((btn) => {
        btn.addEventListener("click", () => {
          const productId = btn.getAttribute("data-id");
          editRAM(productId);
        });
      });
    })
    .catch((error) => {
      htmls += `<li class="list-group-item">Error fetching RAM data: ${error.message}</li>`;
      ramList.innerHTML += htmls;
      console.error("Error fetching RAM data:", error);
    });
}

ramForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const ramTitle = document.getElementById("ram-title").value;
  const ramName = document.getElementById("ram-name").value;
  const ramPrice = document.getElementById("ram-price").value;
  const ramImage = document.getElementById("ram-image").files[0];
  const ramSpeed = document.getElementById("ram-speed").value;
  const ramCasLatency = document.getElementById("ram-cas-latency").value;
  const ramFirstWordLatency = document.getElementById(
    "ram-first-word-latency"
  ).value;
  const ramModules = document.getElementById("ram-modules").value;
  const ramDescription = document.getElementById("ram-description").value;
  const ramId = await generateNextRAMId();
  const ramRating = 0; // Default rating

  let formData = new FormData();
  if (ramImage) {
    formData.append("image", ramImage);
  }

  fetch("https://server-file-upload.onrender.com/upload", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((result) => {
      return db
        .collection("ramData")
        .doc(ramId)
        .set({
          id: ramId,
          title: ramTitle,
          name: ramName,
          price: parseFloat(ramPrice),
          imageUrl: result.data.secure_url,
          speed: ramSpeed,
          casLatency: ramCasLatency,
          firstWordLatency: ramFirstWordLatency,
          modules: ramModules,
          description: ramDescription,
          rating: ramRating,
        });
    })
    .then(() => {
      alert("RAM added successfully!");
      ramForm.reset();
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error adding RAM:", error);
    });
});

function deleteRAM(ramId) {
  if (confirm("Are you sure you want to delete this RAM?")) {
    db.collection("ramData")
      .doc(ramId)
      .delete()
      .then(() => {
        console.log("RAM deleted successfully!");
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error deleting RAM:", error);
      });
  }
}

function editRAM(ramId) {
  const editForm = document.getElementById("edit-ram-form");

  editForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const ramTitle = document.getElementById("edit-ram-title").value;
    const ramName = document.getElementById("edit-ram-name").value;
    const ramPrice = document.getElementById("edit-ram-price").value;
    const ramImageFile = document.getElementById("edit-ram-image").files[0];
    const ramSpeed = document.getElementById("edit-ram-speed").value;
    const ramCasLatency = document.getElementById("edit-ram-cas-latency").value;
    const ramFirstWordLatency = document.getElementById(
      "edit-ram-first-word-latency"
    ).value;
    const ramModules = document.getElementById("edit-ram-modules").value;
    const ramDescription = document.getElementById(
      "edit-ram-description"
    ).value;
    const ramRating = document.getElementById("edit-ram-rating").value;

    let updateData = {
      title: ramTitle,
      name: ramName,
      price: parseFloat(ramPrice),
      speed: ramSpeed,
      casLatency: ramCasLatency,
      firstWordLatency: ramFirstWordLatency,
      modules: ramModules,
      description: ramDescription,
      rating: parseInt(ramRating) || 0,
    };

    // Hàm update vào Firestore
    function updateRAM(imageUrl) {
      if (imageUrl) {
        updateData.imageUrl = imageUrl;
      }

      db.collection("ramData")
        .doc(ramId)
        .update(updateData)
        .then(function () {
          alert("RAM updated successfully!");
          console.log("RAM updated successfully!");
          window.location.reload();
        })
        .catch(function (error) {
          console.error("Error updating RAM:", error);
          alert("Có lỗi khi cập nhật RAM, vui lòng thử lại!");
        });
    }

    // Nếu có ảnh thì upload trước, rồi mới update Firestore
    if (ramImageFile) {
      let formData = new FormData();
      formData.append("image", ramImageFile);

      fetch("https://server-file-upload.onrender.com/upload", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((result) => {
          if (result && result.data && result.data.secure_url) {
            updateRAM(result.data.secure_url); // update Firestore kèm ảnh
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
      updateRAM();
    }
  });
}

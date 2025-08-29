const powerSupplyList = document.getElementById("power-supply-list");
const powerSupplyForm = document.getElementById("power-supply-form");

async function getPowerSupplyCount() {
  const snapshot = await db.collection("powerSupplyData").get();
  const count = snapshot.size;
  return count;
}

function generatePowerSupplyId(number) {
  return "psu" + String(number).padStart(3, "0");
}

async function generateNextPowerSupplyId() {
  const count = await getPowerSupplyCount();
  const nextId = generatePowerSupplyId(count + 1);
  console.log("Mã ID tiếp theo:", nextId);
  return nextId;
}

function loadPowerSupply() {
  let htmls = "";
  db.collection("powerSupplyData")
    .orderBy("id", "desc")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const powerSupplyData = doc.data();
        const powerSupplyId = doc.id;
        const formattedPrice = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(powerSupplyData.price);

        htmls += `
          <li class="list-group-item d-flex justify-content-between align-items-center" data-price="${powerSupplyData.price}">
            <div class="row">
              <div class="col-md-2">
                  <img src="${powerSupplyData.imageUrl}" class="img-fluid">
              </div>
              <div class="col-md-10">
                  <h5>${powerSupplyData.title}</h5>
                  <p>ID: ${powerSupplyId}</p>
                  <p>Name: ${powerSupplyData.name}</p>
                  <p>Price: ${formattedPrice}</p>
                  <p>Type: ${powerSupplyData.type}</p>
                  <p>Wattage: ${powerSupplyData.wattage}</p>
                  <p>Efficiency: ${powerSupplyData.efficiency}</p>
                  <p>Modular: ${powerSupplyData.modular}</p>
                  <p>Description: ${powerSupplyData.description}</p>
                  <p>Rating: ${powerSupplyData.rating}</p>
                  <button class="btn btn-warning power-supply-edit-btn" type="button" data-bs-toggle="collapse" data-bs-target="#collapseEdit" aria-expanded="false" aria-controls="collapseEdit" data-id="${powerSupplyId}">Edit Power Supply</button>
                    <div class="collapse" id="collapseEdit">
                      <div class="card card-body">
                        <form id="edit-power-supply-form">
                          <input type="text" id="edit-power-supply-title" class="form-control mb-2" placeholder="Title" value="${powerSupplyData.title}"/>
                          <input type="text" id="edit-power-supply-name" class="form-control mb-2" placeholder="Name" value="${powerSupplyData.name}"/>
                          <input type="number" id="edit-power-supply-price" class="form-control mb-2" placeholder="Price" value="${powerSupplyData.price}"/>
                          <input type="text" id="edit-power-supply-type" class="form-control mb-2" placeholder="Type" value="${powerSupplyData.type}"/>
                          <input type="text" id="edit-power-supply-wattage" class="form-control mb-2" placeholder="Wattage" value="${powerSupplyData.wattage}"/>
                          <input type="text" id="edit-power-supply-efficiency" class="form-control mb-2" placeholder="Efficiency" value="${powerSupplyData.efficiency}"/>
                          <input type="text" id="edit-power-supply-modular" class="form-control mb-2" placeholder="Modular" value="${powerSupplyData.modular}"/>
                          <textarea id="edit-power-supply-description" class="form-control mb-2" placeholder="Description" rows="3">${powerSupplyData.description}</textarea>
                          <input type="number" id="edit-power-supply-rating" class="form-control mb-2" placeholder="Rating" value="${powerSupplyData.rating}"/>
                          <input type="file" id="edit-power-supply-image" class="form-control mb-2" placeholder="Image"/>
                          <button type="submit" class="btn btn-primary">Save Changes</button>
                        </form>
                      </div>
                    </div>
                  <button class="btn btn-danger power-supply-delete-btn" data-id="${powerSupplyId}">Delete Power Supply</button>
              </div>
            </div>
          </li>
        `;
      });
      powerSupplyList.innerHTML += htmls;

      const btnDelete = document.querySelectorAll(".power-supply-delete-btn");
      btnDelete.forEach((btn) => {
        btn.addEventListener("click", () => {
          const productId = btn.getAttribute("data-id");
          deletePowerSupply(productId);
        });
      });
      const btnEdit = document.querySelectorAll(".power-supply-edit-btn");
      btnEdit.forEach((btn) => {
        btn.addEventListener("click", () => {
          const productId = btn.getAttribute("data-id");
          editPowerSupply(productId);
        });
      });
    })
    .catch((error) => {
      htmls += `<li class="list-group-item">Error fetching power supply data: ${error.message}</li>`;
      powerSupplyList.innerHTML += htmls;
      console.error("Error fetching power supply data:", error);
    });
}

powerSupplyForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const powerSupplyTitle = document.getElementById("power-supply-title").value;
  const powerSupplyName = document.getElementById("power-supply-name").value;
  const powerSupplyPrice = document.getElementById("power-supply-price").value;
  const powerSupplyImage =
    document.getElementById("power-supply-image").files[0];
  const powerSupplyType = document.getElementById("power-supply-type").value;
  const powerSupplyWattage = document.getElementById(
    "power-supply-wattage"
  ).value;
  const powerSupplyEfficiency = document.getElementById(
    "power-supply-efficiency"
  ).value;
  const powerSupplyModular = document.getElementById(
    "power-supply-modular"
  ).value;
  const powerSupplyDescription = document.getElementById(
    "power-supply-description"
  ).value;
  const powerSupplyRating = 0; // Default rating
  const powerSupplyId = await generateNextPowerSupplyId();

  let formData = new FormData();
  if (powerSupplyImage) {
    formData.append("image", powerSupplyImage);
  }

  fetch("https://server-file-upload.onrender.com/upload", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((result) => {
      return db
        .collection("powerSupplyData")
        .doc(powerSupplyId)
        .set({
          id: powerSupplyId,
          title: powerSupplyTitle,
          name: powerSupplyName,
          price: parseFloat(powerSupplyPrice),
          imageUrl: result.data.secure_url,
          type: powerSupplyType,
          wattage: powerSupplyWattage,
          efficiency: powerSupplyEfficiency,
          modular: powerSupplyModular,
          description: powerSupplyDescription,
          rating: powerSupplyRating,
        });
    })
    .then(() => {
      alert("Power supply added successfully!");
      powerSupplyForm.reset();
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error adding power supply:", error);
    });
});

function deletePowerSupply(powerSupplyId) {
  if (confirm("Are you sure you want to delete this power supply?")) {
    db.collection("powerSupplyData")
      .doc(powerSupplyId)
      .delete()
      .then(() => {
        console.log("Power supply deleted successfully!");
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error deleting power supply:", error);
      });
  }
}

function editPowerSupply(powerSupplyId) {
  const editForm = document.getElementById("edit-power-supply-form");

  editForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const powerSupplyTitle = document.getElementById(
      "edit-power-supply-title"
    ).value;
    const powerSupplyName = document.getElementById(
      "edit-power-supply-name"
    ).value;
    const powerSupplyPrice = document.getElementById(
      "edit-power-supply-price"
    ).value;
    const powerSupplyImageFile = document.getElementById(
      "edit-power-supply-image"
    ).files[0];
    const powerSupplyType = document.getElementById(
      "edit-power-supply-type"
    ).value;
    const powerSupplyWattage = document.getElementById(
      "edit-power-supply-wattage"
    ).value;
    const powerSupplyEfficiency = document.getElementById(
      "edit-power-supply-efficiency"
    ).value;
    const powerSupplyModular = document.getElementById(
      "edit-power-supply-modular"
    ).value;
    const powerSupplyDescription = document.getElementById(
      "edit-power-supply-description"
    ).value;
    const powerSupplyRating = document.getElementById(
      "edit-power-supply-rating"
    ).value;

    let updateData = {
      title: powerSupplyTitle,
      name: powerSupplyName,
      price: parseFloat(powerSupplyPrice),
      type: powerSupplyType,
      wattage: powerSupplyWattage,
      efficiency: powerSupplyEfficiency,
      modular: powerSupplyModular,
      description: powerSupplyDescription,
      rating: parseFloat(powerSupplyRating),
    };

    // Hàm update vào Firestore
    function updatePowerSupply(imageUrl) {
      if (imageUrl) {
        updateData.imageUrl = imageUrl;
      }

      db.collection("powerSupplyData")
        .doc(powerSupplyId)
        .update(updateData)
        .then(function () {
          alert("Power supply updated successfully!");
          console.log("Power supply updated successfully!");
          window.location.reload();
        })
        .catch(function (error) {
          console.error("Error updating power supply:", error);
          alert("Có lỗi khi cập nhật power supply, vui lòng thử lại!");
        });
    }

    // Nếu có ảnh thì upload trước, rồi mới update Firestore
    if (powerSupplyImageFile) {
      let formData = new FormData();
      formData.append("image", powerSupplyImageFile);

      fetch("https://server-file-upload.onrender.com/upload", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((result) => {
          if (result && result.data && result.data.secure_url) {
            updatePowerSupply(result.data.secure_url); // update Firestore kèm ảnh
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
      updatePowerSupply();
    }
  });
}

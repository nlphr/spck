const caseList = document.getElementById("case-list");
const caseForm = document.getElementById("case-form");

async function getCaseCount() {
  const snapshot = await db.collection("caseData").get();
  const count = snapshot.size;
  return count;
}

function generateCaseId(number) {
  return "case" + String(number).padStart(3, "0");
}

async function generateNextCaseId() {
  const count = await getCaseCount();
  const nextId = generateCaseId(count + 1);
  console.log("Mã ID tiếp theo:", nextId);
  return nextId;
}

function loadCase() {
  let htmls = "";
  db.collection("caseData")
    .orderBy("id", "desc")
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        const caseData = doc.data();
        const caseId = doc.id;
        const formattedPrice = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(caseData.price);

        htmls += `
          <li class="list-group-item d-flex justify-content-between align-items-center">
            <div class="row">
              <div class="col-md-2">
                  <img src="${caseData.imageUrl}" class="img-fluid">
              </div>
              <div class="col-md-10">
                  <h5>${caseData.title}</h5>
                  <p>ID: ${caseId}</p>
                  <p>Name: ${caseData.name}</p>
                  <p>Price: ${formattedPrice}</p>
                  <p>Type: ${caseData.Type}</p>
                  <p>Side Panel: ${caseData.sidePanel}</p>
                  <p>Color: ${caseData.color}</p>
                  <p>Internal 3.5 Bays: ${caseData.internal35Bays}</p>
                  <p>External Volume: ${caseData.externalVolume}</p>
                  <p>Description: ${caseData.description}</p>
                  <p>Rating: ${caseData.rating}</p>
                  <button class="btn btn-warning case-edit-btn" type="button" data-bs-toggle="collapse" data-bs-target="#collapseEdit" aria-expanded="false" aria-controls="collapseEdit" data-id="${caseId}">Edit case</button>
                    <div class="collapse" id="collapseEdit">
                      <div class="card card-body">
                        <form id="edit-case-form">
                          <input type="hidden" id="edit-case-id" value="${caseId}" />
                          <input type="text" id="edit-case-title" class="form-control mb-2" placeholder="Title" value="${caseData.title}" />
                          <input type="text" id="edit-case-name" class="form-control mb-2" placeholder="Name" value="${caseData.name}" />
                          <input type="number" id="edit-case-price" class="form-control mb-2" placeholder="Price" value="${caseData.price}" />
                          <input type="text" id="edit-case-type" class="form-control mb-2" placeholder="Type" value="${caseData.Type}" />
                          <input type="text" id="edit-case-side-panel" class="form-control mb-2" placeholder="Side Panel" value="${caseData.sidePanel}" />
                          <input type="text" id="edit-case-color" class="form-control mb-2" placeholder="Color" value="${caseData.color}" />
                          <input type="number" id="edit-case-internal-35-bays" class="form-control mb-2" placeholder="Internal 3.5 Bays" value="${caseData.internal35Bays}" />
                          <input type="text" id="edit-case-external-volume" class="form-control mb-2" placeholder="External Volume" value="${caseData.externalVolume}" />
                          <input type="number" id="edit-case-rating" class="form-control mb-2" placeholder="Rating" value="${caseData.rating}" />
                          <textarea id="edit-case-description" class="form-control mb-2" placeholder="Description">${caseData.description}</textarea>
                          <input type="file" id="edit-case-image" class="form-control mb-2" />
                          <button type="submit" class="btn btn-primary">Save Changes</button>
                        </form>
                      </div>
                    </div>
                  <button class="btn btn-danger case-delete-btn" data-id="${caseId}">Delete case</button>
              </div>
            </div>
          </li>
        `;
      });
      caseList.innerHTML += htmls;

      const btnDelete = document.querySelectorAll(".case-delete-btn");
      btnDelete.forEach((btn) => {
        btn.addEventListener("click", () => {
          const productId = btn.getAttribute("data-id");
          deleteCase(productId);
        });
      });
      const btnEdit = document.querySelectorAll(".case-edit-btn");
      btnEdit.forEach((btn) => {
        btn.addEventListener("click", () => {
          const productId = btn.getAttribute("data-id");
          editCase(productId);
        });
      });
    })
    .catch((error) => {
      htmls += `<li class="list-group-item">Error fetching case data: ${error.message}</li>`;
      caseList.innerHTML += htmls;
      console.error("Error fetching case data:", error);
    });
}

caseForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const caseTitle = document.getElementById("case-title").value;
  const caseName = document.getElementById("case-name").value;
  const casePrice = document.getElementById("case-price").value;
  const caseImage = document.getElementById("case-image").files[0];
  const caseType = document.getElementById("case-type").value;
  const caseSidePanel = document.getElementById("case-side-panel").value;
  const caseColor = document.getElementById("case-color").value;
  const caseInternal35Bays = document.getElementById(
    "case-internal-35-bays"
  ).value;
  const caseExternalVolume = document.getElementById(
    "case-external-volume"
  ).value;
  const caseDescription = document.getElementById("case-description").value;
  const caseRating = 0; // Default rating
  const caseId = await generateNextCaseId();

  let formData = new FormData();
  if (caseImage) {
    formData.append("image", caseImage);
  }

  fetch("https://server-file-upload.onrender.com/upload", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((result) => {
      return db
        .collection("caseData")
        .doc(caseId)
        .set({
          id: caseId,
          title: caseTitle,
          name: caseName,
          price: parseFloat(casePrice),
          imageUrl: result.data.secure_url,
          Type: caseType,
          sidePanel: caseSidePanel,
          color: caseColor,
          internal35Bays: parseInt(caseInternal35Bays),
          externalVolume: caseExternalVolume,
          description: caseDescription,
          rating: caseRating,
        });
    })
    .then(() => {
      alert("Case added successfully!");
      caseForm.reset();
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error adding case:", error);
    });
});

function deleteCase(caseId) {
  if (confirm("Are you sure you want to delete this case?")) {
    db.collection("caseData")
      .doc(caseId)
      .delete()
      .then(() => {
        console.log("Case deleted successfully!");
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error deleting case:", error);
      });
  }
}

function editCase(caseId) {
  const editForm = document.getElementById("edit-case-form");

  editForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const caseTitle = document.getElementById("edit-case-title").value;
    const caseName = document.getElementById("edit-case-name").value;
    const casePrice = document.getElementById("edit-case-price").value;
    const caseImageFile = document.getElementById("edit-case-image").files[0];
    const caseType = document.getElementById("edit-case-type").value;
    const caseSidePanel = document.getElementById("edit-case-side-panel").value;
    const caseColor = document.getElementById("edit-case-color").value;
    const caseInternal35Bays = document.getElementById(
      "edit-case-internal-35-bays"
    ).value;
    const caseExternalVolume = document.getElementById(
      "edit-case-external-volume"
    ).value;
    const caseDescription = document.getElementById(
      "edit-case-description"
    ).value;
    const caseRating = document.getElementById("edit-case-rating").value;

    let updateData = {
      title: caseTitle,
      name: caseName,
      price: parseFloat(casePrice),
      Type: caseType,
      sidePanel: caseSidePanel,
      color: caseColor,
      internal35Bays: parseInt(caseInternal35Bays),
      externalVolume: caseExternalVolume,
      description: caseDescription,
      rating: caseRating,
    };

    // Hàm update vào Firestore
    function updateCase(imageUrl) {
      if (imageUrl) {
        updateData.imageUrl = imageUrl;
      }

      db.collection("caseData")
        .doc(caseId)
        .update(updateData)
        .then(function () {
          alert("Case updated successfully!");
          console.log("Case updated successfully!");
          window.location.reload();
        })
        .catch(function (error) {
          console.error("Error updating case:", error);
          alert("Có lỗi khi cập nhật case, vui lòng thử lại!");
        });
    }

    // Nếu có ảnh thì upload trước, rồi mới update Firestore
    if (caseImageFile) {
      let formData = new FormData();
      formData.append("image", caseImageFile);

      fetch("https://server-file-upload.onrender.com/upload", {
        method: "POST",
        body: formData,
      })
        .then((res) => res.json())
        .then((result) => {
          if (result && result.data && result.data.secure_url) {
            updateCase(result.data.secure_url); // update Firestore kèm ảnh
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
      updateCase();
    }
  });
}

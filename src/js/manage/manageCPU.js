const cpuList = document.getElementById("cpu-list");
const cpuForm = document.getElementById("cpu-form");

async function getCpuCount() {
  const snapshot = await db.collection("cpuData").get();
  const count = snapshot.size;
  console.log("Tổng số CPU:", count);
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
                  <button class="btn btn-warning cpu-edit-btn" data-id="${cpuId}">Edit CPU</button>
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
      cpuList.innerHTML = htmls;
      console.error("Error fetching CPU data:", error);
    });
}

cpuForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const cpuTitle = document.getElementById("cpu-title").value;
  const cpuPrice = document.getElementById("cpu-price").value;
  const cpuImageUrl = document.getElementById("cpu-image").files[0];
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
  if (cpuImageUrl) {
    formData.append("file", cpuImageUrl);
  }

  fetch("http://localhost:3000/upload", {
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
  // Functionality to edit CPU details can be implemented here
  alert(`Edit functionality for CPU ID: ${cpuId} is not implemented yet.`);
}

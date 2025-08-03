function getCpu(list) {
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
              </div>
            </div>
          </li>
        `;
      });
      list.innerHTML = htmls;
    })
    .catch((error) => {
      console.error("Error fetching CPU data: ", error);
    });
}


function addCPU(){
  
}
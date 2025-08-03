import { initializeApp } from "firebase/app";
import { getFirestore, collection, setDoc, doc } from "firebase/firestore";
import { db } from "../firebase-config.js"; // Adjust the import path as necessary

const cpuData = [
  {
    id: "cpu001",
    title: "Sample CPU Model 1",
    coreCount: 3,
    performanceCoreClock: "2.7GHz",
    microarchitecture: "Alder Lake",
    TPD: "65W",
    rating: 3.8,
    price: 110,
    description:
      "Sample description for CPU model 1. Great for gaming and productivity.",
    imageUrl: "https://example.com/cpu1.jpg",
  },
  {
    id: "cpu002",
    title: "Sample CPU Model 2",
    coreCount: 4,
    performanceCoreClock: "2.9GHz",
    microarchitecture: "Zen 3",
    TPD: "80W",
    rating: 4.1,
    price: 120,
    description:
      "Sample description for CPU model 2. Great for gaming and productivity.",
    imageUrl: "https://example.com/cpu2.jpg",
  },
  {
    id: "cpu003",
    title: "Sample CPU Model 3",
    coreCount: 5,
    performanceCoreClock: "3.1GHz",
    microarchitecture: "Alder Lake",
    TPD: "95W",
    rating: 4.4,
    price: 130,
    description:
      "Sample description for CPU model 3. Great for gaming and productivity.",
    imageUrl: "https://example.com/cpu3.jpg",
  },
  {
    id: "cpu004",
    title: "Sample CPU Model 4",
    coreCount: 6,
    performanceCoreClock: "3.3GHz",
    microarchitecture: "Zen 3",
    TPD: "110W",
    rating: 4.7,
    price: 140,
    description:
      "Sample description for CPU model 4. Great for gaming and productivity.",
    imageUrl: "https://example.com/cpu4.jpg",
  },
  {
    id: "cpu005",
    title: "Sample CPU Model 5",
    coreCount: 7,
    performanceCoreClock: "3.5GHz",
    microarchitecture: "Alder Lake",
    TPD: "125W",
    rating: 3.5,
    price: 150,
    description:
      "Sample description for CPU model 5. Great for gaming and productivity.",
    imageUrl: "https://example.com/cpu5.jpg",
  },
  {
    id: "cpu006",
    title: "Sample CPU Model 6",
    coreCount: 8,
    performanceCoreClock: "3.7GHz",
    microarchitecture: "Zen 3",
    TPD: "50W",
    rating: 3.8,
    price: 160,
    description:
      "Sample description for CPU model 6. Great for gaming and productivity.",
    imageUrl: "https://example.com/cpu6.jpg",
  },
  {
    id: "cpu007",
    title: "Sample CPU Model 7",
    coreCount: 9,
    performanceCoreClock: "3.9GHz",
    microarchitecture: "Alder Lake",
    TPD: "65W",
    rating: 4.1,
    price: 170,
    description:
      "Sample description for CPU model 7. Great for gaming and productivity.",
    imageUrl: "https://example.com/cpu7.jpg",
  },
  {
    id: "cpu008",
    title: "Sample CPU Model 8",
    coreCount: 10,
    performanceCoreClock: "4.1GHz",
    microarchitecture: "Zen 3",
    TPD: "80W",
    rating: 4.4,
    price: 180,
    description:
      "Sample description for CPU model 8. Great for gaming and productivity.",
    imageUrl: "https://example.com/cpu8.jpg",
  },
  {
    id: "cpu009",
    title: "Sample CPU Model 9",
    coreCount: 11,
    performanceCoreClock: "4.3GHz",
    microarchitecture: "Alder Lake",
    TPD: "95W",
    rating: 4.7,
    price: 190,
    description:
      "Sample description for CPU model 9. Great for gaming and productivity.",
    imageUrl: "https://example.com/cpu9.jpg",
  },
  {
    id: "cpu010",
    title: "Sample CPU Model 10",
    coreCount: 12,
    performanceCoreClock: "2.5GHz",
    microarchitecture: "Zen 3",
    TPD: "110W",
    rating: 3.5,
    price: 200,
    description:
      "Sample description for CPU model 10. Great for gaming and productivity.",
    imageUrl: "https://example.com/cpu10.jpg",
  },
  {
    id: "cpu011",
    title: "Sample CPU Model 11",
    coreCount: 13,
    performanceCoreClock: "2.7GHz",
    microarchitecture: "Alder Lake",
    TPD: "125W",
    rating: 3.8,
    price: 210,
    description:
      "Sample description for CPU model 11. Great for gaming and productivity.",
    imageUrl: "https://example.com/cpu11.jpg",
  },
  {
    id: "cpu012",
    title: "Sample CPU Model 12",
    coreCount: 14,
    performanceCoreClock: "2.9GHz",
    microarchitecture: "Zen 3",
    TPD: "50W",
    rating: 4.1,
    price: 220,
    description:
      "Sample description for CPU model 12. Great for gaming and productivity.",
    imageUrl: "https://example.com/cpu12.jpg",
  },
  {
    id: "cpu013",
    title: "Sample CPU Model 13",
    coreCount: 15,
    performanceCoreClock: "3.1GHz",
    microarchitecture: "Alder Lake",
    TPD: "65W",
    rating: 4.4,
    price: 230,
    description:
      "Sample description for CPU model 13. Great for gaming and productivity.",
    imageUrl: "https://example.com/cpu13.jpg",
  },
  {
    id: "cpu014",
    title: "Sample CPU Model 14",
    coreCount: 16,
    performanceCoreClock: "3.3GHz",
    microarchitecture: "Zen 3",
    TPD: "80W",
    rating: 4.7,
    price: 240,
    description:
      "Sample description for CPU model 14. Great for gaming and productivity.",
    imageUrl: "https://example.com/cpu14.jpg",
  },
  {
    id: "cpu015",
    title: "Sample CPU Model 15",
    coreCount: 17,
    performanceCoreClock: "3.5GHz",
    microarchitecture: "Alder Lake",
    TPD: "95W",
    rating: 3.5,
    price: 250,
    description:
      "Sample description for CPU model 15. Great for gaming and productivity.",
    imageUrl: "https://example.com/cpu15.jpg",
  },
  {
    id: "cpu016",
    title: "Sample CPU Model 16",
    coreCount: 2,
    performanceCoreClock: "3.7GHz",
    microarchitecture: "Zen 3",
    TPD: "110W",
    rating: 3.8,
    price: 260,
    description:
      "Sample description for CPU model 16. Great for gaming and productivity.",
    imageUrl: "https://example.com/cpu16.jpg",
  },
  {
    id: "cpu017",
    title: "Sample CPU Model 17",
    coreCount: 3,
    performanceCoreClock: "3.9GHz",
    microarchitecture: "Alder Lake",
    TPD: "125W",
    rating: 4.1,
    price: 270,
    description:
      "Sample description for CPU model 17. Great for gaming and productivity.",
    imageUrl: "https://example.com/cpu17.jpg",
  },
  {
    id: "cpu018",
    title: "Sample CPU Model 18",
    coreCount: 4,
    performanceCoreClock: "4.1GHz",
    microarchitecture: "Zen 3",
    TPD: "50W",
    rating: 4.4,
    price: 280,
    description:
      "Sample description for CPU model 18. Great for gaming and productivity.",
    imageUrl: "https://example.com/cpu18.jpg",
  },
  {
    id: "cpu019",
    title: "Sample CPU Model 19",
    coreCount: 5,
    performanceCoreClock: "4.3GHz",
    microarchitecture: "Alder Lake",
    TPD: "65W",
    rating: 4.7,
    price: 290,
    description:
      "Sample description for CPU model 19. Great for gaming and productivity.",
    imageUrl: "https://example.com/cpu19.jpg",
  },
  {
    id: "cpu020",
    title: "Sample CPU Model 20",
    coreCount: 6,
    performanceCoreClock: "2.5GHz",
    microarchitecture: "Zen 3",
    TPD: "80W",
    rating: 3.5,
    price: 300,
    description:
      "Sample description for CPU model 20. Great for gaming and productivity.",
    imageUrl: "https://example.com/cpu20.jpg",
  },
  {
    id: "cpu021",
    title: "Sample CPU Model 21",
    coreCount: 7,
    performanceCoreClock: "2.7GHz",
    microarchitecture: "Alder Lake",
    TPD: "95W",
    rating: 3.8,
    price: 310,
    description:
      "Sample description for CPU model 21. Great for gaming and productivity.",
    imageUrl: "https://example.com/cpu21.jpg",
  },
  {
    id: "cpu022",
    title: "Sample CPU Model 22",
    coreCount: 8,
    performanceCoreClock: "2.9GHz",
    microarchitecture: "Zen 3",
    TPD: "110W",
    rating: 4.1,
    price: 320,
    description:
      "Sample description for CPU model 22. Great for gaming and productivity.",
    imageUrl: "https://example.com/cpu22.jpg",
  },
  {
    id: "cpu023",
    title: "Sample CPU Model 23",
    coreCount: 9,
    performanceCoreClock: "3.1GHz",
    microarchitecture: "Alder Lake",
    TPD: "125W",
    rating: 4.4,
    price: 330,
    description:
      "Sample description for CPU model 23. Great for gaming and productivity.",
    imageUrl: "https://example.com/cpu23.jpg",
  },
  {
    id: "cpu024",
    title: "Sample CPU Model 24",
    coreCount: 10,
    performanceCoreClock: "3.3GHz",
    microarchitecture: "Zen 3",
    TPD: "50W",
    rating: 4.7,
    price: 340,
    description:
      "Sample description for CPU model 24. Great for gaming and productivity.",
    imageUrl: "https://example.com/cpu24.jpg",
  },
  {
    id: "cpu025",
    title: "Sample CPU Model 25",
    coreCount: 11,
    performanceCoreClock: "3.5GHz",
    microarchitecture: "Alder Lake",
    TPD: "65W",
    rating: 3.5,
    price: 350,
    description:
      "Sample description for CPU model 25. Great for gaming and productivity.",
    imageUrl: "https://example.com/cpu25.jpg",
  },
  {
    id: "cpu026",
    title: "Sample CPU Model 26",
    coreCount: 12,
    performanceCoreClock: "3.7GHz",
    microarchitecture: "Zen 3",
    TPD: "80W",
    rating: 3.8,
    price: 360,
    description:
      "Sample description for CPU model 26. Great for gaming and productivity.",
    imageUrl: "https://example.com/cpu26.jpg",
  },
  {
    id: "cpu027",
    title: "Sample CPU Model 27",
    coreCount: 13,
    performanceCoreClock: "3.9GHz",
    microarchitecture: "Alder Lake",
    TPD: "95W",
    rating: 4.1,
    price: 370,
    description:
      "Sample description for CPU model 27. Great for gaming and productivity.",
    imageUrl: "https://example.com/cpu27.jpg",
  },
  {
    id: "cpu028",
    title: "Sample CPU Model 28",
    coreCount: 14,
    performanceCoreClock: "4.1GHz",
    microarchitecture: "Zen 3",
    TPD: "110W",
    rating: 4.4,
    price: 380,
    description:
      "Sample description for CPU model 28. Great for gaming and productivity.",
    imageUrl: "https://example.com/cpu28.jpg",
  },
  {
    id: "cpu029",
    title: "Sample CPU Model 29",
    coreCount: 15,
    performanceCoreClock: "4.3GHz",
    microarchitecture: "Alder Lake",
    TPD: "125W",
    rating: 4.7,
    price: 390,
    description:
      "Sample description for CPU model 29. Great for gaming and productivity.",
    imageUrl: "https://example.com/cpu29.jpg",
  },
  {
    id: "cpu030",
    title: "Sample CPU Model 30",
    coreCount: 16,
    performanceCoreClock: "2.5GHz",
    microarchitecture: "Zen 3",
    TPD: "50W",
    rating: 3.5,
    price: 400,
    description:
      "Sample description for CPU model 30. Great for gaming and productivity.",
    imageUrl: "https://example.com/cpu30.jpg",
  },
];

// async function uploadCPUData() {
//   const sparePartsRef = collection(db, "SparePart");

//   for (let cpu of cpuData) {
//     try {
//       await setDoc(doc(sparePartsRef, cpu.id), cpu);
//       console.log(`✅ Uploaded: ${cpu.title}`);
//     } catch (err) {
//       console.error(`❌ Failed to upload ${cpu.title}:`, err);
//     }
//   }

//   console.log("🎉 All CPU data uploaded!");
// }

// uploadCPUData();


for (let cpu of cpuData) {
  try {
    await setDoc(doc(db, "cpuData", cpu.id), cpu);
    console.log(`✅ Uploaded: ${cpu.title}`);
  } catch (err) {
    console.error(`❌ Failed to upload ${cpu.title}:`, err);
  }
}
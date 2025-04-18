const axios = require("axios");
require("dotenv").config();

// API anahtarlarını .env dosyasından alalım
const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const RAPIDAPI_HOST = process.env.RAPIDAPI_HOST;

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

async function getRandomQuiz(req, res) {
  try {
    // API anahtarlarının varlığını kontrol edelim
    if (!RAPIDAPI_KEY || !RAPIDAPI_HOST) {
      console.error("API anahtarları eksik:", { RAPIDAPI_KEY, RAPIDAPI_HOST });
      return res.status(500).json({ error: "API yapılandırması eksik" });
    }

    const brands = [
      "BMW",
      "Audi",
      "Toyota",
      "Hyundai",
      "Chevrolet",
      "Fiat",
      "Mercedes",
      "Porsche",
      "Volkswagen",
      "Ferrari",
      "Bugatti",
      "Lamborghini",
    ];

    const randomBrand = brands[Math.floor(Math.random() * brands.length)];

    const carRes = await axios.get(
      "https://cars-database-with-image.p.rapidapi.com/api/search",
      {
        params: { q: randomBrand },
        headers: {
          "x-rapidapi-key": RAPIDAPI_KEY,
          "x-rapidapi-host": RAPIDAPI_HOST,
        },
      }
    );

    const carList = carRes.data.results;

    if (!carList || carList.length < 3) {
      return res.status(404).json({ error: "Yeterli araç bulunamadı" });
    }

    const correctCar = carList[Math.floor(Math.random() * carList.length)];
    const filteredCars = carList.filter(
      (car) => car.title !== correctCar.title
    );

    const wrongOptions = [];
    while (wrongOptions.length < 2 && filteredCars.length > 0) {
      const wrongCar = filteredCars.splice(
        Math.floor(Math.random() * filteredCars.length),
        1
      )[0];
      if (!wrongOptions.includes(wrongCar.title)) {
        wrongOptions.push(wrongCar.title);
      }
    }

    const options = [correctCar.title, ...wrongOptions];
    const shuffledOptions = shuffle(options);

    res.json({
      image: correctCar.image,
      question: "Bu aracın modeli nedir?",
      options: shuffledOptions,
      answer: correctCar.title,
    });
  } catch (error) {
    console.error("Quiz verisi alınamadı:", error.message);
  }
}

module.exports = { getRandomQuiz };

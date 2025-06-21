// seedAssets.js
const { createClient } = require("edgedb");

const client = createClient();

const brands = ["Dell", "Acer", "HP", "Lenovo", "Asus", "MSI"];
const types = ["Monitor", "System Unit", "Keyboard", "Mouse", "Speaker"];
const locations = ["Office A", "Office B", "Office C", "Office D"];
const users = ["Eric", "Kate", "Liam", "Lou", "John", "Sarah", "Mia"];

function randomFrom(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function randomSerial() {
  return "SN" + Math.floor(100000 + Math.random() * 900000);
}

async function seedData() {
  for (let i = 0; i < 200; i++) {
    const asset = {
      name: randomFrom(brands),
      serial_number: randomSerial(),
      type: randomFrom(types),
      location: randomFrom(locations),
      user: randomFrom(users),
    };

    try {
      await client.query(`
        INSERT Asset {
          name := <str>$name,
          serial_number := <str>$serial_number,
          type := <str>$type,
          location := <str>$location,
          user := <str>$user
        }
      `, asset);
      console.log(`✅ Inserted: ${asset.name} (${asset.serial_number})`);
    } catch (err) {
      console.error("❌ Insert failed:", err.message);
    }
  }

  console.log("✅ Seeding done");
  process.exit();
}

seedData();

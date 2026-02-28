import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/utils/auth";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clear existing data
  await prisma.orderTimeline.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.orderItemVariant.deleteMany({});
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.table.deleteMany({});
  await prisma.menuVariant.deleteMany({});
  await prisma.menuItem.deleteMany({});
  await prisma.menuCategory.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.restaurantSettings.deleteMany({});

  // Create users
  const adminPassword = await hashPassword("admin123");
  const userPassword = await hashPassword("user123");

  const admin = await prisma.user.create({
    data: {
      email: "admin@restaurant.com",
      password: adminPassword,
      name: "Admin User",
      phone: "+1234567890",
      role: "ADMIN",
    },
  });

  const waiter = await prisma.user.create({
    data: {
      email: "waiter@restaurant.com",
      password: userPassword,
      name: "John Waiter",
      phone: "+0987654321",
      role: "WAITER",
    },
  });

  const kitchen = await prisma.user.create({
    data: {
      email: "kitchen@restaurant.com",
      password: userPassword,
      name: "Kitchen Staff",
      phone: "+1122334455",
      role: "KITCHEN",
    },
  });

  const manager = await prisma.user.create({
    data: {
      email: "manager@restaurant.com",
      password: userPassword,
      name: "Restaurant Manager",
      phone: "+5544332211",
      role: "MANAGER",
    },
  });

  console.log("✅ Created users");

  // Create menu categories
  const appetizers = await prisma.menuCategory.create({
    data: {
      name: "Appetizers",
      description: "Start your meal with our delicious starters",
      position: 1,
      isActive: true,
    },
  });

  const mains = await prisma.menuCategory.create({
    data: {
      name: "Main Courses",
      description: "Our signature main dishes",
      position: 2,
      isActive: true,
    },
  });

  const desserts = await prisma.menuCategory.create({
    data: {
      name: "Desserts",
      description: "Sweet treats to end your meal",
      position: 3,
      isActive: true,
    },
  });

  const drinks = await prisma.menuCategory.create({
    data: {
      name: "Beverages",
      description: "Refreshing drinks and cocktails",
      position: 4,
      isActive: true,
    },
  });

  console.log("✅ Created menu categories");

  // Create menu items
  const bruschetta = await prisma.menuItem.create({
    data: {
      name: "Bruschetta",
      description: "Toasted bread with tomato and basil",
      price: 8.99,
      categoryId: appetizers.id,
      preparationTime: 10,
      isAvailable: true,
    },
  });

  const calamari = await prisma.menuItem.create({
    data: {
      name: "Calamari Fritti",
      description: "Fried squid with marinara sauce",
      price: 12.99,
      categoryId: appetizers.id,
      preparationTime: 12,
      isAvailable: true,
    },
  });

  const chickenParmesan = await prisma.menuItem.create({
    data: {
      name: "Chicken Parmesan",
      description: "Breaded chicken with marinara and melted cheese",
      price: 18.99,
      categoryId: mains.id,
      preparationTime: 20,
      isAvailable: true,
    },
  });

  const pasta = await prisma.menuItem.create({
    data: {
      name: "Spaghetti Carbonara",
      description: "Classic Italian pasta with creamy sauce",
      price: 16.99,
      categoryId: mains.id,
      preparationTime: 18,
      isAvailable: true,
    },
  });

  const tiramisu = await prisma.menuItem.create({
    data: {
      name: "Tiramisu",
      description: "Traditional Italian dessert with mascarpone",
      price: 7.99,
      categoryId: desserts.id,
      preparationTime: 5,
      isAvailable: true,
    },
  });

  const panna = await prisma.menuItem.create({
    data: {
      name: "Panna Cotta",
      description: "Silky smooth Italian custard dessert",
      price: 8.99,
      categoryId: desserts.id,
      preparationTime: 5,
      isAvailable: true,
    },
  });

  const water = await prisma.menuItem.create({
    data: {
      name: "Bottled Water",
      description: "Still or sparkling water",
      price: 2.99,
      categoryId: drinks.id,
      preparationTime: 2,
      isAvailable: true,
    },
  });

  const wine = await prisma.menuItem.create({
    data: {
      name: "House Red Wine",
      description: "Glass of our house red wine",
      price: 7.99,
      categoryId: drinks.id,
      preparationTime: 2,
      isAvailable: true,
    },
  });

  console.log("✅ Created menu items");

  // Create variants for menu items
  await prisma.menuVariant.create({
    data: {
      name: "Size",
      value: "Small",
      priceModifier: 0,
      menuItemId: chickenParmesan.id,
    },
  });

  await prisma.menuVariant.create({
    data: {
      name: "Size",
      value: "Large",
      priceModifier: 3.0,
      menuItemId: chickenParmesan.id,
    },
  });

  await prisma.menuVariant.create({
    data: {
      name: "Size",
      value: "Small",
      priceModifier: 0,
      menuItemId: pasta.id,
    },
  });

  await prisma.menuVariant.create({
    data: {
      name: "Size",
      value: "Large",
      priceModifier: 2.5,
      menuItemId: pasta.id,
    },
  });

  await prisma.menuVariant.create({
    data: {
      name: "Temperature",
      value: "Still",
      priceModifier: 0,
      menuItemId: water.id,
    },
  });

  await prisma.menuVariant.create({
    data: {
      name: "Temperature",
      value: "Sparkling",
      priceModifier: 0.5,
      menuItemId: water.id,
    },
  });

  console.log("✅ Created menu variants");

  // Create tables
  for (let i = 1; i <= 10; i++) {
    await prisma.table.create({
      data: {
        tableNumber: i,
        capacity: i <= 4 ? 2 : i <= 7 ? 4 : 6,
        location: i <= 3 ? "Window" : i <= 7 ? "Center" : "Corner",
        status: "AVAILABLE",
      },
    });
  }

  console.log("✅ Created 10 tables");

  // Create restaurant settings
  await prisma.restaurantSettings.create({
    data: {
      restaurantName: "Bella Italia",
      description: "A premium Italian restaurant experience",
      taxPercentage: 10,
      serviceChargePercentage: 15,
      enableDelivery: true,
      enableTakeaway: true,
      enableDineIn: true,
      enableAdvanceOrder: true,
      kitchenSoundAlert: true,
    },
  });

  console.log("✅ Created restaurant settings");

  console.log("🎉 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

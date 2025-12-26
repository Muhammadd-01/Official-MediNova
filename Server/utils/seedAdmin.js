import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const seedSuperAdmin = async () => {
    try {
        const superAdminExists = await User.findOne({ role: "superadmin" });

        if (superAdminExists) {
            console.log("✅ Super Admin already exists.");
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash("admin123", salt);

        const superAdmin = new User({
            fullName: "Super Admin",
            email: "superadmin@medinova.com",
            password: hashedPassword,
            role: "superadmin",
            authProvider: "local",
        });

        await superAdmin.save();
        console.log("🚀 Super Admin created successfully: superadmin@medinova.com / admin123");
    } catch (error) {
        console.error("❌ Error seeding Super Admin:", error);
    }
};

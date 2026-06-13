"use server";

export async function getDeveloperContact() {
  return {
    email: process.env.DEVELOPER_EMAIL || "contact@example.com",
    phone: process.env.DEVELOPER_PHONE || "94719892932",
  };
}

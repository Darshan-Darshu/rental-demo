"use client";

import { useEffect } from "react";

function Provider() {
  const mockData = [
    {
      id: "1",
      type: "PG",
      title: "Modern PG near KIT College",
      location: "Near KIT, Tiptur",
      rent: 5500,
      occupancy: "Single",
      food: "Veg & Non-Veg",
      amenities: ["WiFi", "AC", "Parking", "Laundry"],
      image: "/modern-pg-room.jpg",
      bhk: null,
      distance: "500m from KIT College",
    },
    {
      id: "2",
      type: "Hostel",
      title: "Girls Hostel with Mess",
      location: "Gandhi Nagar, Tiptur",
      rent: 4500,
      occupancy: "Double",
      food: "Veg Only",
      amenities: ["WiFi", "Security", "Mess", "Laundry"],
      image: "/girls-hostel.jpg",
      bhk: null,
      distance: "1km from Industrial Area",
    },
    {
      id: "3",
      type: "House",
      title: "2BHK Independent House",
      location: "MG Road, Tiptur",
      rent: 8000,
      occupancy: "Family",
      food: "No Mess",
      amenities: ["Parking", "Water Supply", "Power Backup"],
      image: "/2bhk-house.jpg",
      bhk: "2BHK",
      distance: "2km from City Center",
    },
    {
      id: "4",
      type: "Room",
      title: "Single Room for Working Professional",
      location: "Industrial Area, Tiptur",
      rent: 3500,
      occupancy: "Single",
      food: "Veg Mess Nearby",
      amenities: ["WiFi", "Attached Bathroom"],
      image: "/single-room-rental.jpg",
      bhk: null,
      distance: "200m from Factory",
    },
  ];

  useEffect(() => {
    const mockProperties = JSON.parse(localStorage.getItem("items") || "[]");
    console.log(mockProperties);
    if (!mockProperties.length) {
      localStorage.setItem("items", JSON.stringify(mockData));
    }
  }, []);

  return <div></div>;
}

export default Provider;

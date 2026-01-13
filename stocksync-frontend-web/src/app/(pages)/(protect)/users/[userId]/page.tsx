"use client";
import React from "react";
import { motion } from "framer-motion";
import { User, Mail, BadgeCheck, Phone, MapPin } from "lucide-react";

const UserDetailPage: React.FC = () => {
    const user = {
        name: "Alex Johnson",
        email: "alex@stocksync.app",
        role: "Admin",
        phone: "+1 (555) 123-4567",
        location: "New York, USA",
        avatarUrl: "https://images.unsplash.com/photo-1502685104226-ee32379fefbe?w=300",
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-4xl mx-auto p-6">
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="bg-linear-to-r from-pink-500 to-purple-600 p-3 rounded-lg">
                            <User className="w-8 h-8 text-white" />
                        </div>
                        <h1 className="text-4xl font-bold text-foreground">User Details</h1>
                    </div>
                    <p className="text-muted-foreground ml-16">Profile and account information</p>
                </motion.div>

                <div className="bg-card rounded-xl p-6 border border-border">
                    <div className="flex items-center gap-6 mb-6">
                        <img src={user.avatarUrl} alt={user.name} className="w-20 h-20 rounded-2xl object-cover border border-border" />
                        <div className="flex-1">
                            <p className="text-2xl font-bold text-foreground">{user.name}</p>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <BadgeCheck className="w-4 h-4" /> {user.role}
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-foreground/80">
                            <Mail className="w-4 h-4" /> {user.email}
                        </div>
                        <div className="flex items-center gap-2 text-foreground/80">
                            <Phone className="w-4 h-4" /> {user.phone}
                        </div>
                        <div className="flex items-center gap-2 text-foreground/80">
                            <MapPin className="w-4 h-4" /> {user.location}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDetailPage;

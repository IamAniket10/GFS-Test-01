"use client";

import { useState } from "react";
import { MessageSquarePlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import RegistrationForm from "./RegistrationForm";

export default function RegistrationWidget() {
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            {/* Floating Chatbot-Style Trigger Button */}
            <DialogTrigger asChild>
                <Button
                    size="icon"
                    className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-indigo-600 text-white shadow-xl hover:bg-indigo-700 hover:scale-105 transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    aria-label="Open Registration Form"
                >
                    <MessageSquarePlus className="h-6 w-6" />
                </Button>
            </DialogTrigger>

            {/* Registration Dialog */}
            <DialogContent className="fixed sm:max-w-md max-h-[90vh] overflow-y-auto sm:rounded-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-2xl">
                <DialogHeader className="space-y-1">
                    <DialogTitle className="text-xl font-bold text-slate-900 dark:text-slate-100">
                        Register Interest
                    </DialogTitle>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        Fill out the form below and our team will get in touch with you shortly.
                    </p>
                </DialogHeader>

                <div className="mt-4">
                    <RegistrationForm />
                </div>
            </DialogContent>
        </Dialog>
    );
}
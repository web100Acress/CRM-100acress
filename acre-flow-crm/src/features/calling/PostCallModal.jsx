import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/layout/dialog';
import { Button } from '@/layout/button';
import { Phone, ThumbsUp, ThumbsDown, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiUrl } from "@/config/apiConfig";

const PostCallModal = ({ lead, isOpen, onClose, onInterested, onNotInterested }) => {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();

    if (!isOpen || !lead) return null;

    const handleNotInterested = async () => {
        if (window.confirm("Are you sure? This lead will be closed and moved to the 'Not Interested' section.")) {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                const response = await fetch(`${apiUrl}/api/leads/${lead._id}`, {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ status: 'Not Interested' }),
                });

                if (response.ok) {
                    toast({
                        title: "Lead Updated",
                        description: "Lead marked as Not Interested and closed.",
                        status: "success",
                    });
                    onNotInterested(lead._id);
                    onClose();
                } else {
                    const data = await response.json();
                    throw new Error(data.message || "Failed to update lead");
                }
            } catch (error) {
                console.error("Error updating lead status:", error);
                toast({
                    title: "Error",
                    description: "Failed to update lead status.",
                    status: "error",
                });
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md bg-white rounded-xl shadow-2xl border-0 p-0 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white text-center">
                    <div className="mx-auto bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mb-4 backdrop-blur-sm">
                        <Phone size={32} className="text-white" />
                    </div>
                    <DialogTitle className="text-2xl font-bold text-white mb-2">Call Ended?</DialogTitle>
                    <p className="text-blue-100">How did the call with <span className="font-semibold text-white">{lead.name}</span> go?</p>
                </div>

                <div className="p-6 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={handleNotInterested}
                            disabled={loading}
                            className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-red-100 bg-red-50 hover:bg-red-100 hover:border-red-200 transition-all group"
                        >
                            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <ThumbsDown size={24} />
                            </div>
                            <span className="font-semibold text-red-900">Not Interested</span>
                            <span className="text-xs text-red-600 mt-1">Close Lead</span>
                        </button>

                        <button
                            onClick={() => {
                                onInterested(lead);
                                onClose();
                            }}
                            className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-green-100 bg-green-50 hover:bg-green-100 hover:border-green-200 transition-all group"
                        >
                            <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                <ThumbsUp size={24} />
                            </div>
                            <span className="font-semibold text-green-900">Interested</span>
                            <span className="text-xs text-green-600 mt-1">Add Follow-up</span>
                        </button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default PostCallModal;

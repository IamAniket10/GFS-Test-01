"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  UserPlus,
  User,
  Mail,
  Phone,
  Briefcase,
  AlertCircle,
  FileText,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Sparkles,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  CreateReferralInput,
  Referral,
  ServiceInterest,
  UrgencyLevel,
} from "@/types";
import {
  referralStage1Schema,
  referralStage2Schema,
} from "@/lib/validations/referrals";

interface ReferralModalDialogProps {
  onSuccess?: (referral: Referral) => void;
  triggerButton?: React.ReactNode;
}

const SERVICE_OPTIONS: {
  id: ServiceInterest;
  title: string;
  desc: string;
}[] = [
  {
    id: "1-on-1 Coaching Track",
    title: "1-on-1 Coaching Track",
    desc: "Personalized mentorship sessions with expert coaches",
  },
  {
    id: "Course Subscription",
    title: "Course Subscription",
    desc: "Full access to our technical masterclasses and learning catalog",
  },
  {
    id: "Enterprise Support",
    title: "Enterprise Support",
    desc: "Custom team upskilling and dedicated organizational support",
  },
];

const URGENCY_OPTIONS: {
  id: UrgencyLevel;
  label: string;
  color: string;
  badgeClass: string;
}[] = [
  {
    id: "Low",
    label: "Low Priority",
    color: "text-slate-600 dark:text-slate-400",
    badgeClass: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200",
  },
  {
    id: "Medium",
    label: "Medium Priority",
    color: "text-amber-600 dark:text-amber-400",
    badgeClass: "bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400 border-amber-200",
  },
  {
    id: "High",
    label: "High Priority",
    color: "text-rose-600 dark:text-rose-400",
    badgeClass: "bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400 border-rose-200",
  },
];

export function ReferralModalDialog({
  onSuccess,
  triggerButton,
}: ReferralModalDialogProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState<CreateReferralInput>({
    client_name: "",
    client_email: "",
    client_phone: "",
    service_interest: "1-on-1 Coaching Track",
    urgency_level: "Medium",
    referral_reason: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const resetForm = () => {
    setFormData({
      client_name: "",
      client_email: "",
      client_phone: "",
      service_interest: "1-on-1 Coaching Track",
      urgency_level: "Medium",
      referral_reason: "",
    });
    setErrors({});
    setStep(1);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) {
      resetForm();
    }
  };

  // Step 1 Validation & Next
  const handleNextToStep2 = () => {
    const res = referralStage1Schema.safeParse({
      client_name: formData.client_name,
      client_email: formData.client_email,
      client_phone: formData.client_phone,
    });

    if (!res.success) {
      const fieldErrors: Record<string, string> = {};
      res.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setStep(2);
  };

  // Step 2 Validation & Next
  const handleNextToStep3 = () => {
    const res = referralStage2Schema.safeParse({
      service_interest: formData.service_interest,
      urgency_level: formData.urgency_level,
      referral_reason: formData.referral_reason,
    });

    if (!res.success) {
      const fieldErrors: Record<string, string> = {};
      res.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0].toString()] = issue.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setStep(3);
  };

  // Final Submission
  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      const res = await fetch("/api/referrals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit referral");
      }

      toast.success("Referral Submitted!", {
        description: `${formData.client_name} has been added to our review queue.`,
      });

      if (onSuccess) {
        onSuccess(data.referral);
      }

      setOpen(false);
      resetForm();
    } catch (err: any) {
      toast.error("Submission Failed", {
        description: err.message || "Please check your details and try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button className="gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-md shadow-indigo-500/20 transition-all cursor-pointer">
            <UserPlus className="h-4 w-4" />
            Refer a Client
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-xl p-0 overflow-hidden rounded-2xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-2xl">
        {/* Header with Step Indicator */}
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15 backdrop-blur-md">
                <Sparkles className="h-5 w-5 text-indigo-100" />
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-white">
                  Refer a Client
                </DialogTitle>
                <DialogDescription className="text-xs text-indigo-100/80">
                  Connect someone to CoachTrack’s coaching programs
                </DialogDescription>
              </div>
            </div>
            <span className="text-[11px] font-mono font-bold bg-white/20 px-2.5 py-1 rounded-full text-white">
              Step {step} of 3
            </span>
          </div>

          {/* Progress Bar */}
          <div className="grid grid-cols-3 gap-2">
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step >= 1 ? "bg-white" : "bg-white/30"
              }`}
            />
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step >= 2 ? "bg-white" : "bg-white/30"
              }`}
            />
            <div
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step >= 3 ? "bg-white" : "bg-white/30"
              }`}
            />
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
          {/* ================================================================= */}
          {/* STAGE 1: CONTACT INFORMATION */}
          {/* ================================================================= */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="pb-1">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Stage 1: Client Contact Information
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Provide primary contact details so our team can reach out.
                </p>
              </div>

              {/* Client Name */}
              <div className="space-y-1.5">
                <Label htmlFor="client_name" className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-indigo-500" />
                  Client Full Name <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="client_name"
                  placeholder="e.g. Jane Doe"
                  value={formData.client_name}
                  onChange={(e) => {
                    setFormData({ ...formData, client_name: e.target.value });
                    if (errors.client_name) setErrors({ ...errors, client_name: "" });
                  }}
                  className="rounded-xl text-xs"
                />
                {errors.client_name && (
                  <p className="text-[11px] font-medium text-rose-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.client_name}
                  </p>
                )}
              </div>

              {/* Client Email */}
              <div className="space-y-1.5">
                <Label htmlFor="client_email" className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-indigo-500" />
                  Client Email Address <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="client_email"
                  type="email"
                  placeholder="e.g. jane.doe@example.com"
                  value={formData.client_email}
                  onChange={(e) => {
                    setFormData({ ...formData, client_email: e.target.value });
                    if (errors.client_email) setErrors({ ...errors, client_email: "" });
                  }}
                  className="rounded-xl text-xs"
                />
                {errors.client_email && (
                  <p className="text-[11px] font-medium text-rose-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.client_email}
                  </p>
                )}
              </div>

              {/* Client Phone */}
              <div className="space-y-1.5">
                <Label htmlFor="client_phone" className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  Phone Number <span className="text-[10px] text-slate-400 font-normal">(Optional)</span>
                </Label>
                <Input
                  id="client_phone"
                  placeholder="e.g. +1 (555) 019-2834"
                  value={formData.client_phone || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, client_phone: e.target.value })
                  }
                  className="rounded-xl text-xs"
                />
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* STAGE 2: INTEREST & PRIORITY (RADIO BUTTONS) */}
          {/* ================================================================= */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="pb-1">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Stage 2: Interest & Priority
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Select the suitable coaching track and urgency level.
                </p>
              </div>

              {/* Service Interest Radio Buttons */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5 text-indigo-500" />
                  Service Interest <span className="text-rose-500">*</span>
                </Label>
                <div className="grid gap-2.5">
                  {SERVICE_OPTIONS.map((opt) => {
                    const isSelected = formData.service_interest === opt.id;
                    return (
                      <label
                        key={opt.id}
                        className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 ring-1 ring-indigo-600"
                            : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="service_interest"
                          value={opt.id}
                          checked={isSelected}
                          onChange={() =>
                            setFormData({ ...formData, service_interest: opt.id })
                          }
                          className="mt-0.5 text-indigo-600 focus:ring-indigo-500"
                        />
                        <div className="space-y-0.5">
                          <p className="text-xs font-bold text-slate-900 dark:text-slate-100">
                            {opt.title}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            {opt.desc}
                          </p>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Urgency Level Radio Buttons */}
              <div className="space-y-2">
                <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <AlertCircle className="h-3.5 w-3.5 text-indigo-500" />
                  Urgency Level <span className="text-rose-500">*</span>
                </Label>
                <div className="grid grid-cols-3 gap-2.5">
                  {URGENCY_OPTIONS.map((urg) => {
                    const isSelected = formData.urgency_level === urg.id;
                    return (
                      <label
                        key={urg.id}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border cursor-pointer transition-all text-center ${
                          isSelected
                            ? "border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30 ring-1 ring-indigo-600"
                            : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="urgency_level"
                          value={urg.id}
                          checked={isSelected}
                          onChange={() =>
                            setFormData({ ...formData, urgency_level: urg.id })
                          }
                          className="sr-only"
                        />
                        <span className={`text-xs font-bold ${urg.color}`}>
                          {urg.id}
                        </span>
                        <span className="text-[10px] text-slate-400 mt-0.5">
                          {urg.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Referral Reason Textarea */}
              <div className="space-y-1.5">
                <Label htmlFor="referral_reason" className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-slate-400" />
                  Referral Reason & Context <span className="text-[10px] text-slate-400 font-normal">(Optional)</span>
                </Label>
                <Textarea
                  id="referral_reason"
                  placeholder="Share any additional details about the client's goals, background, or timelines..."
                  value={formData.referral_reason || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, referral_reason: e.target.value })
                  }
                  rows={3}
                  className="rounded-xl text-xs resize-none"
                />
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* STAGE 3: REVIEW & FINAL SUBMISSION */}
          {/* ================================================================= */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="pb-1">
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Stage 3: Review & Final Submission
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Please confirm the referral details before submitting to the review queue.
                </p>
              </div>

              {/* Read-Only Summary Card */}
              <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 p-4 space-y-3.5">
                {/* Contact Preview */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Contact Details
                  </span>
                  <div className="mt-1.5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px]">Client Name</p>
                      <p className="font-bold text-slate-900 dark:text-slate-100">{formData.client_name}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 dark:text-slate-400 text-[11px]">Client Email</p>
                      <p className="font-bold text-slate-900 dark:text-slate-100 truncate">{formData.client_email}</p>
                    </div>
                    {formData.client_phone && (
                      <div className="sm:col-span-2">
                        <p className="text-slate-500 dark:text-slate-400 text-[11px]">Phone</p>
                        <p className="font-semibold text-slate-800 dark:text-slate-200">{formData.client_phone}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-slate-200 dark:border-slate-700/60 pt-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Program & Urgency
                  </span>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800 font-semibold text-xs">
                      {formData.service_interest}
                    </Badge>
                    <Badge variant="outline" className={`font-semibold text-xs ${
                      formData.urgency_level === "High"
                        ? "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-400"
                        : formData.urgency_level === "Medium"
                        ? "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400"
                        : "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300"
                    }`}>
                      {formData.urgency_level} Priority
                    </Badge>
                  </div>
                </div>

                {formData.referral_reason && (
                  <div className="border-t border-slate-200 dark:border-slate-700/60 pt-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Reason / Notes
                    </span>
                    <p className="mt-1 text-xs text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-2.5 rounded-lg border border-slate-200/60 dark:border-slate-800">
                      {formData.referral_reason}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Navigation Buttons */}
        <div className="border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 p-4 px-6 flex items-center justify-between">
          {step > 1 ? (
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep((prev) => (prev - 1) as any)}
              disabled={submitting}
              className="gap-1.5 rounded-xl text-xs font-semibold cursor-pointer"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </Button>
          ) : (
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
              className="text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400 cursor-pointer"
            >
              Cancel
            </Button>
          )}

          {step === 1 && (
            <Button
              type="button"
              onClick={handleNextToStep2}
              className="gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 cursor-pointer"
            >
              Next: Interest & Urgency
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          )}

          {step === 2 && (
            <Button
              type="button"
              onClick={handleNextToStep3}
              className="gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 cursor-pointer"
            >
              Next: Review
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          )}

          {step === 3 && (
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className="gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              {submitting ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Submitting Referral...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Submit Referral
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

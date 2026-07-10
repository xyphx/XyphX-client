import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

interface TechInterestFormPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  name: string;
  org_name: string;
  tech_interest: string;
  phone: string;
  email: string;
  portfolio?: string;
}

const fieldVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08 },
  }),
};

export default function TechInterestFormPopup({ isOpen, onClose }: TechInterestFormPopupProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: FormData) => {
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/apply/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Application submitted",
          description: "🎉 We'll get back to you soon.",
          className: "border border-primary/30 bg-card text-card-foreground",
          duration: 5000,
        });
        reset();
        onClose();
      } else {
        toast({
          variant: "destructive",
          title: "Submission failed",
          description: result.error || "Something went wrong. Try again.",
          className: "border border-primary/30 bg-card text-card-foreground",
        });
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast({
        variant: "destructive",
        title: "Network error",
        description: "Please check your connection and try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ------------------------- field config ------------------------- */
  const formFields = [
    {
      label: "Name*",
      name: "name",
      type: "text",
      error: errors.name,
      validation: { required: "Required" },
    },
    {
      label: "Organization / Club / College Name*",
      name: "org_name",
      type: "text",
      error: errors.org_name,
      validation: { required: "Required" },
    },
    {
      label: "Interested Technology*",
      name: "tech_interest",
      type: "text",
      error: errors.tech_interest,
      validation: { required: "Required" },
    },
    {
      label: "Phone Number*",
      name: "phone",
      type: "tel",
      error: errors.phone,
      validation: {
        required: "Required",
        pattern: {
          value: /^[+0-9\s-]{7,15}$/,
          message: "Invalid phone number",
        },
      },
    },
    {
      label: "Email*",
      name: "email",
      type: "email",
      error: errors.email,
      validation: {
        required: "Required",
        pattern: {
          value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
          message: "Invalid email address",
        },
      },
    },
    {
      label: "Portfolio URL (optional)",
      name: "portfolio",
      type: "url",
      error: errors.portfolio,
      validation: {
        pattern: {
          value: /^(https?:\/\/)?([\w\d-]+\.)+\w{2,}(\/[\w\d-./?%&=]*)?$/,
          message: "Invalid URL",
        },
      },
    },
  ] as const;
  /* --------------------------------------------------------------- */

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#10002B]/40 backdrop-blur-sm p-4"
          aria-modal="true"
          role="dialog"
        >
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.35, ease: [0.21, 0.6, 0.35, 1] }}
            className="w-full max-w-lg"
          >
            <div className="relative w-full overflow-hidden rounded-[2rem] glass-strong shadow-depth">
              {/* Spot removed */}

              <div className="relative p-6 sm:p-8 max-h-[85vh] overflow-y-auto">
                <button
                  type="button"
                  onClick={() => {
                    reset();
                    onClose();
                  }}
                  disabled={loading}
                  aria-label="Close"
                  className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full text-black/50 transition-colors hover:bg-purple-100 hover:text-primary"
                >
                  <X className="h-4 w-4" />
                </button>

                <h3 className="mb-1 text-center font-display text-2xl font-bold tracking-tight text-black">
                  Apply to join <span className="text-gradient">XyphX</span>
                </h3>
                <p className="mb-6 text-center text-sm text-black/55">
                  Tell us a bit about yourself — we read every application.
                </p>

                {loading ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <p className="mb-4 text-black/60">Submitting your application...</p>
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-foreground">
                    {formFields.map((field, i) => (
                      <motion.div
                        key={field.name}
                        custom={i}
                        initial="hidden"
                        animate="visible"
                        variants={fieldVariants}
                      >
                        <label className="mb-1.5 block text-sm font-medium text-black/70">{field.label}</label>
                        <input
                          {...register(field.name as keyof FormData, field.validation)}
                          type={field.type}
                          disabled={loading}
                          className={`w-full rounded-2xl border bg-white/80 p-3 text-black shadow-sm transition-all duration-300 placeholder:text-black/30 focus:outline-none focus:ring-2 focus:ring-primary/60 focus:border-primary/40 focus:shadow-glow ${
                            field.error ? "border-red-400" : "border-primary/15"
                          }`}
                        />
                        {field.error && <p className="mt-1 text-sm text-red-500">{field.error.message}</p>}
                      </motion.div>
                    ))}

                    <div className="flex items-center justify-between pt-2">
                      <Button
                        type="button"
                        variant="secondary"
                        disabled={loading}
                        onClick={() => {
                          reset();
                          onClose();
                        }}
                        className="rounded-full border border-primary/25 bg-white px-6 py-2 text-black/70 transition-all duration-300 hover:bg-purple-50 hover:text-primary"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={loading}
                        className="rounded-full bg-[linear-gradient(120deg,#5F00B7,#9B30FF)] px-8 py-2 font-semibold text-white shadow-glow transition-all duration-300 hover:scale-105 hover:shadow-[0_0_50px_-6px_rgba(95,0,183,0.6)]"
                      >
                        Submit
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

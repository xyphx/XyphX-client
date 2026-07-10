import React, { useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Background from "@/components/landing/Background";
import Footer from "@/components/landing/Footer";
import Reveal from "@/components/motion/Reveal";
import { Check } from "lucide-react";

interface Plan {
  name: string;
  priceMonthly: number;
  priceAnnually: number;
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
  disabled?: boolean;
  selected?: boolean;
}

export default function Pricing() {
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annually">("monthly");

  const plans: Plan[] = [
    {
      name: "Developer",
      priceMonthly: 0,
      priceAnnually: 0,
      description: "For creators, experimenters, and hackers building early-stage software.",
      features: [
        "Full access to all XyphX features",
        "Unlimited API requests (Beta)",
        "Community support & discord access",
        "Advanced telemetry & analytics Dashboard"
      ],
      cta: "Selected",
      disabled: false,
      selected: true
    },
    {
      name: "Professional",
      priceMonthly: 49,
      priceAnnually: 39,
      description: "For teams and startups building production-grade autonomous agent systems.",
      features: [
        "Full access to DotX production agents",
        "50,000 API requests per month",
        "Priority discord & email support (24h)",
        "Advanced diagnostics & telemetry",
        "Custom agent system prompts"
      ],
      cta: "Coming Soon",
      popular: true,
      disabled: true
    },
    {
      name: "Enterprise",
      priceMonthly: 299,
      priceAnnually: 239,
      description: "For scaled enterprises demanding custom compliance, speed, and support.",
      features: [
        "Unlimited API requests & execution",
        "Dedicated agent container deployment",
        "SLA guaranteed 24/7/365 phone support",
        "Custom LLM integrations & fine-tuning",
        "SOC2 compliance & audit logs",
        "Dedicated Solutions Engineer"
      ],
      cta: "Coming Soon",
      disabled: true
    }
  ];

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-clip">
      <Background />
      <Navbar />

      <main className="relative z-10 pt-32 pb-24 px-6 md:px-10">
        <div className="mx-auto max-w-[96rem]">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Reveal blur={false}>
              <p className="label-mono mb-4 text-ink uppercase tracking-wider">04 — Billing Options</p>
              <h1 className="font-display text-4xl md:text-6xl font-bold uppercase leading-none tracking-tight text-carbon mb-6">
                Flexible Plans for <span className="text-ink">Future Scale.</span>
              </h1>
              <p className="text-carbon/60 text-lg leading-relaxed">
                Choose a plan tailored to your execution scale. Upgrade, downgrade, or cancel anytime.
              </p>
            </Reveal>

            {/* Toggle */}
            <Reveal blur={false} delay={0.1}>
              <div className="mt-8 inline-flex items-center gap-4 bg-paper/60 backdrop-blur-md border border-line-soft p-1 rounded-full">
                <button
                  onClick={() => setBillingPeriod("monthly")}
                  className={`label-mono px-6 py-2 rounded-full text-xs transition-all duration-300 ${
                    billingPeriod === "monthly"
                      ? "bg-ink text-white font-bold"
                      : "text-foreground/60 hover:text-foreground"
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setBillingPeriod("annually")}
                  className={`label-mono px-6 py-2 rounded-full text-xs transition-all duration-300 ${
                    billingPeriod === "annually"
                      ? "bg-ink text-white font-bold"
                      : "text-foreground/60 hover:text-foreground"
                  }`}
                >
                  Annually <span className="text-ink/80 font-bold ml-1">(-20%)</span>
                </button>
              </div>
            </Reveal>
          </div>

          {/* Pricing Grid */}
          <div className="grid gap-8 md:grid-cols-3 items-stretch max-w-6xl mx-auto">
            {plans.map((plan, i) => {
              const price = billingPeriod === "monthly" ? plan.priceMonthly : plan.priceAnnually;
              return (
                <Reveal key={plan.name} blur={false} delay={0.15 + i * 0.08}>
                  <div
                    className={`relative flex flex-col h-full bg-paper/40 backdrop-blur-md border rounded-2xl p-8 transition-all duration-500 ${
                      plan.disabled
                        ? "opacity-40 grayscale-[50%]"
                        : "hover:scale-[1.02] hover:bg-paper/70"
                    } ${
                      plan.popular && !plan.disabled
                        ? "border-ink shadow-[0_0_30px_-5px_rgba(95,0,183,0.15)]"
                        : plan.selected
                        ? "border-ink/50 bg-paper/60 shadow-sm"
                        : "border-line-soft"
                    }`}
                  >
                    {plan.popular && !plan.disabled && (
                      <span className="absolute top-0 right-8 -translate-y-1/2 bg-ink text-white text-[10px] font-bold tracking-widest uppercase py-1 px-3 rounded-full">
                        Popular
                      </span>
                    )}

                    <div className="mb-8">
                      <span className="label-mono text-xs text-carbon/40 uppercase tracking-widest block mb-2">
                        {plan.name}
                      </span>
                      <p className="text-carbon/70 text-sm min-h-[48px] leading-relaxed mb-6">{plan.description}</p>
                      <div className="flex items-baseline gap-1">
                        <span className="font-display text-4xl md:text-5xl font-bold text-carbon">
                          ${price}
                        </span>
                        <span className="label-mono text-carbon/40 text-xs">/month</span>
                      </div>
                      {billingPeriod === "annually" && price > 0 && (
                        <span className="text-[10px] label-mono text-ink mt-1 block">Billed annually (${price * 12}/yr)</span>
                      )}
                    </div>

                    <ul className="space-y-4 mb-10 flex-grow border-t border-line-soft pt-6">
                      {plan.features.map((feat) => (
                        <li key={feat} className="flex gap-3 items-start text-sm text-carbon/75 leading-relaxed">
                          <Check className={`h-4 w-4 shrink-0 mt-0.5 ${plan.disabled ? "text-carbon/40" : "text-ink"}`} />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      disabled={plan.disabled || plan.selected}
                      className={`w-full py-4 rounded-xl font-display font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                        plan.disabled
                          ? "bg-paper border border-line-soft text-carbon/50 cursor-not-allowed"
                          : plan.selected
                          ? "bg-ink text-white shadow-md cursor-default"
                          : plan.popular
                          ? "bg-ink text-white hover:bg-ink-dark shadow-md"
                          : "border border-carbon/25 text-carbon hover:bg-carbon hover:text-white"
                      }`}
                    >
                      {plan.selected && <Check className="w-5 h-5" />}
                      {plan.cta}
                    </button>
                  </div>
                </Reveal>
              );
            })}
          </div>

          {/* Additional Info / Trust Section */}
          <div className="mt-24 border-t border-line pt-16 max-w-4xl mx-auto">
            <Reveal blur={false}>
              <div className="grid md:grid-cols-2 gap-10">
                <div>
                  <h3 className="font-display text-lg font-bold text-carbon mb-2">Frequently Asked Questions</h3>
                  <p className="text-sm text-carbon/60 leading-relaxed mb-6">
                    Looking for custom compute limits, local network installations, or HIPAA-compliant storage options? Contact our sales desk at <a href="mailto:info@xyphx.com" className="text-ink hover:underline">info@xyphx.com</a>.
                  </p>
                </div>
                <div>
                  <h3 className="font-display text-lg font-bold text-carbon mb-2">Support Terms</h3>
                  <p className="text-sm text-carbon/60 leading-relaxed">
                    Developer tier users are supported via our open community discord. Pro plans have guaranteed 24-hour SLAs, while Enterprise accounts run on designated customer-success slack channels with instant response.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

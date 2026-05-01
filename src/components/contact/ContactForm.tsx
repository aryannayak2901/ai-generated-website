"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Send, ShieldCheck, Clock, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    console.log(values);
    setIsSubmitting(false);
    toast.success("Message sent successfully! We will get back to you soon.");
    form.reset();
  }

  return (
    <section className="py-24 md:py-40 bg-background dark:bg-navy transition-colors duration-500 relative overflow-hidden">
      {/* Background Decorative patterns */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gold/5 -skew-x-12 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/2 bg-gold/5 skew-x-12 -translate-x-1/4 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 space-y-12"
          >
            <div>
              <span className="text-gold font-bold tracking-[0.4em] uppercase text-[10px] mb-6 block">
                Direct Inquiry
              </span>
              <h2 className="font-serif text-5xl md:text-7xl font-bold text-navy dark:text-white mb-8 leading-tight">
                Send Us an <br />
                <span className="text-gold italic font-medium">Inquiry</span>
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-xl leading-relaxed max-w-md font-light">
                Have a complex legal question? Fill
                out the form and our specialist team will reach out with a 
                strategic roadmap.
              </p>
            </div>

            <div className="space-y-10">
              {[
                {
                  icon: ShieldCheck,
                  title: "Strict Confidentiality",
                  desc: "Your legal inquiries are handled with absolute discretion."
                },
                {
                  icon: Clock,
                  title: "24-Hour Response",
                  desc: "Our senior strategists review all submissions within one business day."
                },
                {
                  icon: Users,
                  title: "Expert Allocation",
                  desc: "Your matter is assigned to the specialist most qualified for your case."
                }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-6 group">
                  <div className="w-14 h-14 rounded-2xl bg-gold/10 flex items-center justify-center shrink-0 group-hover:bg-gold group-hover:text-navy transition-all duration-500 shadow-xl shadow-gold/5">
                    <item.icon className="h-6 w-6 text-gold group-hover:text-navy transition-colors duration-500" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h4 className="font-serif text-xl font-bold text-navy dark:text-white mb-2">{item.title}</h4>
                    <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Form Container */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            className="lg:col-span-7"
          >
            <div className="bg-white/80 dark:bg-white/5 backdrop-blur-2xl p-8 md:p-16 rounded-3xl border border-navy/5 dark:border-white/10 shadow-2xl transition-colors duration-500">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-navy dark:text-slate-300 font-bold uppercase tracking-widest text-[10px]">Full Name</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="John Doe"
                              className="h-14 bg-slate-50 dark:bg-navy/30 border-navy/10 dark:border-white/10 focus:border-gold dark:focus:border-gold focus:ring-0 rounded-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs font-bold text-red-500" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-navy dark:text-slate-300 font-bold uppercase tracking-widest text-[10px]">Email Address</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="john@example.com"
                              className="h-14 bg-slate-50 dark:bg-navy/30 border-navy/10 dark:border-white/10 focus:border-gold dark:focus:border-gold focus:ring-0 rounded-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs font-bold text-red-500" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-navy dark:text-slate-300 font-bold uppercase tracking-widest text-[10px]">Phone Number</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="+91 00000 00000"
                              className="h-14 bg-slate-50 dark:bg-navy/30 border-navy/10 dark:border-white/10 focus:border-gold dark:focus:border-gold focus:ring-0 rounded-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs font-bold text-red-500" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-navy dark:text-slate-300 font-bold uppercase tracking-widest text-[10px]">Subject</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Legal Matter"
                              className="h-14 bg-slate-50 dark:bg-navy/30 border-navy/10 dark:border-white/10 focus:border-gold dark:focus:border-gold focus:ring-0 rounded-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-xs font-bold text-red-500" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-navy dark:text-slate-300 font-bold uppercase tracking-widest text-[10px]">Your Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe your legal requirements..."
                            className="min-h-[180px] bg-slate-50 dark:bg-navy/30 border-navy/10 dark:border-white/10 focus:border-gold dark:focus:border-gold focus:ring-0 rounded-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-xs font-bold text-red-500" />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gold hover:bg-navy hover:text-white dark:hover:bg-white dark:hover:text-navy text-navy h-18 rounded-none font-bold uppercase tracking-[0.3em] transition-all duration-500 text-xs shadow-2xl shadow-gold/20 group overflow-hidden relative"
                  >
                    <div className="flex items-center justify-center gap-3 relative z-10">
                      {isSubmitting ? (
                        <>
                          <div className="w-5 h-5 border-2 border-navy/30 border-t-navy dark:border-white/30 dark:border-t-white rounded-full animate-spin" />
                          <span>Processing...</span>
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                          <span>Send Inquiry</span>
                        </>
                      )}
                    </div>
                  </Button>
                </form>
              </Form>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

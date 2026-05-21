"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
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
import { motion } from "framer-motion";
import { Send } from "lucide-react";

import { trackEvent } from "@/components/GoogleAnalyticsTracker";

const formSchema = zod.object({
  name: zod.string().min(2, "Name must be at least 2 characters"),
  email: zod.string().email("Invalid email address"),
  phone: zod.string().optional(),
  subject: zod.string().min(5, "Subject must be at least 5 characters"),
  message: zod.string().min(10, "Message must be at least 10 characters"),
});

export default function ContactForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: zod.infer<typeof formSchema>) => {
    trackEvent("contact_form_submit_attempt", {
      subject: data.subject,
      has_phone: !!data.phone,
    });

    try {
      // Simulate form submission
      console.log(data);
      alert("Message sent successfully! We'll get back to you within 24 hours.");
      
      trackEvent("contact_form_submit_success", {
        subject: data.subject,
      });
      form.reset();
    } catch (err: any) {
      trackEvent("contact_form_submit_error", {
        error_message: err?.message || "Submission failure",
      });
      alert("An error occurred. Please try again.");
    }
  };

  return (
    <section className="py-16 md:py-24 px-6 bg-white">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="max-w-[1280px] mx-auto"
      >
        <div className="max-w-2xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4 text-center">
            Send Us a Message
          </h2>
          <div className="w-24 h-0.5 bg-accent/50 mx-auto mb-8" />
          <p className="text-muted-foreground text-center mb-12 leading-relaxed">
            Fill out the form below and our team will get back to you within 24 hours.
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-semibold text-sm uppercase tracking-wider">
                        Full Name *
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="John Doe" 
                          {...field} 
                          className="border-slate-200 focus:border-accent focus:ring-accent/20"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-foreground font-semibold text-sm uppercase tracking-wider">
                        Email Address *
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="john@example.com" 
                          {...field} 
                          className="border-slate-200 focus:border-accent focus:ring-accent/20"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-semibold text-sm uppercase tracking-wider">
                      Phone Number (Optional)
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="tel" 
                        placeholder="+91 1234567890" 
                        {...field} 
                        className="border-slate-200 focus:border-accent focus:ring-accent/20"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-semibold text-sm uppercase tracking-wider">
                      Subject *
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Legal Consultation Request" 
                        {...field} 
                        className="border-slate-200 focus:border-accent focus:ring-accent/20"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-foreground font-semibold text-sm uppercase tracking-wider">
                      Message *
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Tell us about your legal matter..." 
                        rows={6}
                        {...field} 
                        className="border-slate-200 focus:border-accent focus:ring-accent/20 resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                size="lg"
                className="w-full bg-accent hover:bg-accent/85 text-white font-semibold tracking-wider uppercase rounded-sm h-12 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
              >
                Send Message
                <Send className="ml-2 w-4 h-4" />
              </Button>
            </form>
          </Form>
        </div>
      </motion.div>
    </section>
  );
}

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const { mutate, isPending } = useMutation({
    mutationFn: async (email: string) => {
      const res = await apiRequest("POST", "/api/newsletter", { email });
      return res.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "You've been subscribed to our newsletter.",
        variant: "default",
      });
      setEmail("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      mutate(email);
    }
  };

  return (
    <section className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">Stay Updated</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get notified about new harvests, seasonal highlights, and special offers from local farms.
          </p>
        </div>

        <div className="max-w-xl mx-auto">
          <form className="flex flex-col sm:flex-row gap-3" onSubmit={handleSubmit}>
            <Input
              type="email"
              placeholder="Your email address"
              className="flex-grow px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Button
              type="submit"
              disabled={isPending}
              className="px-6 py-3 bg-secondary-500 text-white font-medium rounded-lg hover:bg-secondary-600 focus:outline-none focus:ring-2 focus:ring-white shadow-md transition"
            >
              {isPending ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
          <p className="text-primary-200 text-sm mt-3 text-center">
            We respect your privacy and will never share your information.
          </p>
        </div>
      </div>
    </section>
  );
}

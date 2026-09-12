import { Link } from "wouter";

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">How It Works</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Connecting farmers and customers directly for the freshest seasonal produce.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                <i className="fas fa-calendar-alt text-2xl"></i>
              </div>
            </div>
            <h3 className="text-xl font-medium mb-2">Check Harvest Calendar</h3>
            <p className="text-gray-600">
              Browse our seasonal calendar to see what's growing now and what's coming soon from local farms.
            </p>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                <i className="fas fa-shopping-basket text-2xl"></i>
              </div>
            </div>
            <h3 className="text-xl font-medium mb-2">Pre-order or Buy Now</h3>
            <p className="text-gray-600">
              Place orders for available produce or pre-order upcoming harvests directly from farmers.
            </p>
          </div>
          
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                <i className="fas fa-truck text-2xl"></i>
              </div>
            </div>
            <h3 className="text-xl font-medium mb-2">Pickup or Delivery</h3>
            <p className="text-gray-600">
              Get your farm-fresh produce via convenient pickup locations or direct delivery options.
            </p>
          </div>
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
          <h3 className="text-xl font-medium mb-4 text-center">Join Our Growing Community</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-gray-200 rounded-lg p-5 text-center hover:shadow-md transition">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                  <i className="fas fa-tractor text-xl"></i>
                </div>
              </div>
              <h4 className="text-lg font-medium mb-2">I'm a Farmer</h4>
              <p className="text-gray-600 mb-4 text-sm">
                List your produce, manage inventory, and connect directly with customers.
              </p>
              <Link href="/register?role=farmer" className="inline-block px-5 py-2 rounded-lg bg-primary-500 text-white font-medium hover:bg-primary-600 transition">
                Register as Farmer
              </Link>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-5 text-center hover:shadow-md transition">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-secondary-100 flex items-center justify-center text-secondary-600">
                  <i className="fas fa-user text-xl"></i>
                </div>
              </div>
              <h4 className="text-lg font-medium mb-2">I'm a Customer</h4>
              <p className="text-gray-600 mb-4 text-sm">
                Discover local farms, pre-order seasonal produce, and eat fresher.
              </p>
              <Link href="/register?role=customer" className="inline-block px-5 py-2 rounded-lg bg-secondary-500 text-white font-medium hover:bg-secondary-600 transition">
                Sign Up as Customer
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

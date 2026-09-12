import { Helmet } from "react-helmet";
import {
  MapPin,
  Calendar,
  ShoppingCart,
  Users,
  Brain,
  CreditCard,
  CheckCircle,
  Truck,
  Leaf,
  Package,
  TreePine,
  BookOpen,
  Apple,
  Home,
  Ticket,
  Star,
  Building2,
  Crown,
  ShoppingBag,
  Shield,
  Store,
  ArrowRight,
  Heart,
  Sprout,
  BadgeCheck,
  Video,
  Mic,
  Palette,
  Sparkles,
  Play,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function HowItWorks() {
  return (
    <>
      <Helmet>
        <title>How FarmerSanthe Works | Farm-to-Table Agricultural Marketplace</title>
        <meta
          name="description"
          content="Learn how FarmerSanthe connects farmers directly with families and businesses. Discover FPO stores, retail shopping, wholesale ordering, farm events, and AI-powered NF recommendations."
        />
      </Helmet>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            How FarmerSanthe Works
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            FarmerSanthe is India's trusted agricultural marketplace connecting Farmer Producer Organizations (FPOs), individual farmers, families, and businesses — all on one platform.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/fpo-stores">
              <Button size="lg" className="bg-teal-600 hover:bg-teal-700">
                <Store className="mr-2 h-5 w-5" /> Browse FPO Stores
              </Button>
            </Link>
            <Link href="/products">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                <Home className="mr-2 h-5 w-5" /> Shop for Family
              </Button>
            </Link>
            <Link href="/wholesale">
              <Button size="lg" className="bg-orange-600 hover:bg-orange-700">
                <Building2 className="mr-2 h-5 w-5" /> Buy for Business
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 mb-12">
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
            What is FarmerSanthe?
          </h2>
          <div className="grid md:grid-cols-5 gap-6">
            <div className="text-center">
              <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <Store className="h-10 w-10 text-teal-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">FPO Stores</h3>
              <p className="text-gray-600">
                Official branded stores for Farmer Producer Organizations with curated products.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <Home className="h-10 w-10 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Retail for Families</h3>
              <p className="text-gray-600">
                Fresh fruits, vegetables, and farm produce delivered to your doorstep per unit or kg.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <Building2 className="h-10 w-10 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Wholesale for Business</h3>
              <p className="text-gray-600">
                Volume-based slab pricing for restaurants, hotels, caterers, and retail chains.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <Ticket className="h-10 w-10 text-amber-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Farm Events</h3>
              <p className="text-gray-600">
                Book fruit picking, farm tours, workshops, and seasonal festivals at real farms.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-md">
                <Brain className="h-10 w-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI-Powered NF</h3>
              <p className="text-gray-600">
                Free AI recommendations for Natural Farming tailored to your soil and region.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border border-gray-200">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Understanding Badges & Labels
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded">FPO</span>
                <h3 className="font-semibold text-blue-800">FPO Approved</h3>
              </div>
              <p className="text-gray-600 text-sm">
                <strong>Farmer Producer Organisation Approved</strong> — Products verified and approved by a trusted FPO (District Manager) for quality and authenticity.
              </p>
            </div>

            <div className="bg-green-50 rounded-xl p-5 border border-green-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-2 py-1 rounded">🌿 Organic</span>
                <h3 className="font-semibold text-green-800">Organic Certified</h3>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                <strong>Certified Organic Farming</strong> — This farm has been verified to grow produce entirely without chemical pesticides, synthetic fertilizers, herbicides, or GMOs.
              </p>
              <ul className="text-gray-600 text-sm space-y-1">
                <li className="flex items-start gap-1.5"><span className="text-green-500 font-bold mt-0.5">✓</span> No chemical pesticides or herbicides</li>
                <li className="flex items-start gap-1.5"><span className="text-green-500 font-bold mt-0.5">✓</span> No synthetic fertilizers or GMOs</li>
                <li className="flex items-start gap-1.5"><span className="text-green-500 font-bold mt-0.5">✓</span> Soil health and biodiversity preserved</li>
                <li className="flex items-start gap-1.5"><span className="text-green-500 font-bold mt-0.5">✓</span> Verified and certified by FPO's</li>
              </ul>
            </div>

            <div className="bg-teal-50 rounded-xl p-5 border border-teal-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white text-xs font-bold px-2 py-1 rounded">🍃 Natural</span>
                <h3 className="font-semibold text-teal-800">Natural Certified</h3>
              </div>
              <p className="text-gray-600 text-sm mb-3">
                <strong>Natural Farming Practices</strong> — This farm follows nature-based farming in harmony with local ecosystems, using traditional and sustainable methods without external chemical inputs.
              </p>
              <ul className="text-gray-600 text-sm space-y-1">
                <li className="flex items-start gap-1.5"><span className="text-teal-500 font-bold mt-0.5">✓</span> Grown using traditional, time-tested methods</li>
                <li className="flex items-start gap-1.5"><span className="text-teal-500 font-bold mt-0.5">✓</span> No external chemical inputs used</li>
                <li className="flex items-start gap-1.5"><span className="text-teal-500 font-bold mt-0.5">✓</span> Supports local ecology and biodiversity</li>
                <li className="flex items-start gap-1.5"><span className="text-teal-500 font-bold mt-0.5">✓</span> Verified and certified by FPO's</li>
              </ul>
            </div>

            <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-emerald-600 text-white text-xs font-bold px-2 py-1 rounded">Available</span>
                <h3 className="font-semibold text-emerald-800">Available Now</h3>
              </div>
              <p className="text-gray-600 text-sm">
                <strong>Ready to Ship</strong> — Product is currently in stock and will be freshly harvested and shipped immediately after your order.
              </p>
            </div>

            <div className="bg-amber-50 rounded-xl p-5 border border-amber-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-amber-600 text-white text-xs font-bold px-2 py-1 rounded">Preorder</span>
                <h3 className="font-semibold text-amber-800">Preorder</h3>
              </div>
              <p className="text-gray-600 text-sm">
                <strong>Coming Soon</strong> — Seasonal product not yet harvested. Reserve yours now and receive it fresh when the harvest begins.
              </p>
            </div>

            <div className="bg-purple-50 rounded-xl p-5 border border-purple-200">
              <div className="flex items-center gap-2 mb-3">
                <span className="bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded">Organic vs Natural</span>
              </div>
              <h3 className="font-semibold text-purple-800 mb-2">What's the Difference?</h3>
              <p className="text-gray-600 text-sm mb-2">
                Both certifications mean <strong>no harmful chemicals</strong>, but there is a distinction:
              </p>
              <p className="text-gray-600 text-sm mb-1">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-green-500 mr-1.5"></span>
                <strong>Organic</strong> — Formally certified, strictly regulated, uses documented organic inputs only.
              </p>
              <p className="text-gray-600 text-sm">
                <span className="inline-block w-2.5 h-2.5 rounded-full bg-teal-500 mr-1.5"></span>
                <strong>Natural</strong> — Follows nature's principles; no external inputs; traditional and ecological approach.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl shadow-lg p-8 mb-12 border border-teal-200">
          <div className="flex items-center mb-6">
            <div className="bg-teal-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
              <Store className="h-6 w-6 text-teal-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              FPO Stores — Shop from Farmer Producer Organizations
            </h2>
          </div>

          <p className="text-gray-600 mb-8 text-lg">
            Every Farmer Producer Organization on FarmerSanthe has its own branded storefront. FPO stores are managed by District Managers who onboard local farmers, verify product quality, and ensure fair pricing. When you shop from an FPO store, you're supporting an entire community of farmers.
          </p>

          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="border-teal-200 bg-white">
              <CardContent className="pt-6">
                <div className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                  1
                </div>
                <h3 className="text-lg font-semibold text-center mb-2">
                  Browse FPO Stores
                </h3>
                <p className="text-gray-600 text-center text-sm">
                  Visit the FPO Stores page to discover Farmer Producer Organizations across Karnataka and India. Each store displays its district and product range.
                </p>
              </CardContent>
            </Card>
            <Card className="border-teal-200 bg-white">
              <CardContent className="pt-6">
                <div className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                  2
                </div>
                <h3 className="text-lg font-semibold text-center mb-2">
                  Visit an FPO Store
                </h3>
                <p className="text-gray-600 text-center text-sm">
                  Click on any FPO to visit their branded store page at /org/store-name. See all products from farmers linked to that FPO with verified quality.
                </p>
              </CardContent>
            </Card>
            <Card className="border-teal-200 bg-white">
              <CardContent className="pt-6">
                <div className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                  3
                </div>
                <h3 className="text-lg font-semibold text-center mb-2">
                  Shop & Add to Cart
                </h3>
                <p className="text-gray-600 text-center text-sm">
                  Browse FPO-approved products, select quantities (per unit or per kg), and add to your cart. All products are quality-checked by the FPO.
                </p>
              </CardContent>
            </Card>
            <Card className="border-teal-200 bg-white">
              <CardContent className="pt-6">
                <div className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                  4
                </div>
                <h3 className="text-lg font-semibold text-center mb-2">
                  Checkout & Receive
                </h3>
                <p className="text-gray-600 text-center text-sm">
                  Pay securely via Cashfree payment gateway. The FPO coordinates with farmers for fresh harvesting and delivery to your doorstep.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-white rounded-lg p-6 border border-teal-200 mb-6">
            <h4 className="font-semibold text-teal-800 mb-3">Why Shop from FPO Stores?</h4>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-teal-600 mr-2 flex-shrink-0" />
                <span>Quality verified by District Managers</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-teal-600 mr-2 flex-shrink-0" />
                <span>Support entire farming communities, not just one farm</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-teal-600 mr-2 flex-shrink-0" />
                <span>Fair pricing set transparently by the FPO</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-teal-600 mr-2 flex-shrink-0" />
                <span>Traceable produce from verified local farmers</span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link href="/fpo-stores">
              <Button className="bg-teal-600 hover:bg-teal-700">
                <Store className="mr-2 h-5 w-5" /> Explore FPO Stores
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border border-green-200">
          <div className="flex items-center mb-6">
            <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
              <Home className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Retail Shopping for Families
            </h2>
          </div>

          <p className="text-gray-600 mb-8 text-lg">
            Shop farm-fresh fruits, vegetables, grains, and specialty produce directly from local farmers. Every product is priced per unit or per kg, just like your neighbourhood market — but fresher, and delivered to your home.
          </p>

          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-green-500 text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
                1
              </div>
              <h4 className="font-semibold mb-2">Browse Products</h4>
              <p className="text-gray-500 text-sm">
                Explore seasonal fruits, vegetables, and farm goods. Filter by category, district, or organic certification.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-500 text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
                2
              </div>
              <h4 className="font-semibold mb-2">Add to Cart</h4>
              <p className="text-gray-500 text-sm">
                Select your desired quantity in units or kilograms. Mix products from multiple farmers in one order.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-500 text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
                3
              </div>
              <h4 className="font-semibold mb-2">Secure Checkout</h4>
              <p className="text-gray-500 text-sm">
                Pay securely using the Cashfree payment gateway. Your payment details are never stored on our servers.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-500 text-white w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 font-bold">
                4
              </div>
              <h4 className="font-semibold mb-2">Doorstep Delivery</h4>
              <p className="text-gray-500 text-sm">
                Receive freshly harvested produce at your doorstep. Track your order status from confirmation to delivery.
              </p>
            </div>
          </div>

          <div className="mt-8 bg-green-50 rounded-lg p-6">
            <h4 className="font-semibold text-green-800 mb-3">
              Benefits for Families
            </h4>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                <span>Farm-fresh produce harvested after you order</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                <span>No middlemen — fair prices for you and farmers</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                <span>Know your farmer — see profiles, reviews, and certifications</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-600 mr-2 flex-shrink-0" />
                <span>Preorder seasonal products before they sell out</span>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link href="/products">
              <Button className="bg-green-600 hover:bg-green-700">
                <ShoppingCart className="mr-2 h-5 w-5" /> Start Shopping
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl shadow-lg p-8 mb-12 border border-orange-200">
          <div className="flex items-center mb-6">
            <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
              <Building2 className="h-6 w-6 text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Wholesale for Businesses
            </h2>
          </div>

          <p className="text-gray-600 mb-8 text-lg">
            Buy fresh produce in bulk directly from farmers at competitive volume-based prices. Our slab pricing system automatically applies the best rate based on your order quantity — the more you buy, the more you save.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="border-orange-200 bg-white">
              <CardContent className="pt-6">
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                  1
                </div>
                <h3 className="text-lg font-semibold text-center mb-2">
                  Browse Wholesale Products
                </h3>
                <p className="text-gray-600 text-center text-sm">
                  Explore wholesale listings with volume-based slab pricing. Select your desired quantity and the best price tier is automatically applied.
                </p>
              </CardContent>
            </Card>
            <Card className="border-orange-200 bg-white">
              <CardContent className="pt-6">
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                  2
                </div>
                <h3 className="text-lg font-semibold text-center mb-2">
                  Add to Cart & Review
                </h3>
                <p className="text-gray-600 text-center text-sm">
                  Add wholesale products to your cart with the quantity you need. Review your order summary with volume discounts before proceeding to payment.
                </p>
              </CardContent>
            </Card>
            <Card className="border-orange-200 bg-white">
              <CardContent className="pt-6">
                <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 font-bold text-xl">
                  3
                </div>
                <h3 className="text-lg font-semibold text-center mb-2">
                  Checkout & Delivery
                </h3>
                <p className="text-gray-600 text-center text-sm">
                  Complete your order with secure online payment via Cashfree. The farmer is notified instantly and coordinates bulk delivery to your business.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-white rounded-lg p-6 border border-orange-200">
            <h4 className="font-semibold text-orange-800 mb-3">Benefits for Businesses</h4>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-orange-600 mr-2 flex-shrink-0" />
                <span>Volume-based slab pricing — lower cost per kg at higher quantities</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-orange-600 mr-2 flex-shrink-0" />
                <span>Direct from farm — no commission agents or middlemen</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-orange-600 mr-2 flex-shrink-0" />
                <span>Consistent supply with preorder and seasonal planning</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-orange-600 mr-2 flex-shrink-0" />
                <span>Ideal for restaurants, caterers, hotels, and retail stores</span>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link href="/wholesale">
              <Button className="bg-orange-600 hover:bg-orange-700">
                <Package className="mr-2 h-5 w-5" /> Browse Wholesale Products
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl shadow-lg p-8 mb-12 border border-amber-200">
          <div className="flex items-center mb-6">
            <div className="bg-amber-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
              <Ticket className="h-6 w-6 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Farm Events & Experiences
            </h2>
          </div>

          <p className="text-gray-600 mb-8 text-lg">
            Experience the joy of farm life! Book unique agricultural experiences hosted by real farmers — from fruit picking and farm tours to seasonal festivals and organic farming workshops.
          </p>

          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="border-amber-200 bg-white text-center">
              <CardContent className="pt-6">
                <div className="bg-red-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Apple className="h-7 w-7 text-red-600" />
                </div>
                <h3 className="font-semibold mb-2">Fruit Picking</h3>
                <p className="text-gray-500 text-sm">
                  Pick your own mangoes, guavas, pomegranates, and seasonal fruits right from the orchard.
                </p>
              </CardContent>
            </Card>
            <Card className="border-amber-200 bg-white text-center">
              <CardContent className="pt-6">
                <div className="bg-green-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-7 w-7 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Farm Tours</h3>
                <p className="text-gray-500 text-sm">
                  Walk through real working farms, learn about crop cycles, and see how your food is grown.
                </p>
              </CardContent>
            </Card>
            <Card className="border-amber-200 bg-white text-center">
              <CardContent className="pt-6">
                <div className="bg-purple-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-7 w-7 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Seasonal Festivals</h3>
                <p className="text-gray-500 text-sm">
                  Celebrate harvest festivals, mango melas, and agricultural fairs with local farming communities.
                </p>
              </CardContent>
            </Card>
            <Card className="border-amber-200 bg-white text-center">
              <CardContent className="pt-6">
                <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-7 w-7 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Workshops</h3>
                <p className="text-gray-500 text-sm">
                  Learn organic farming, composting, Natural Farming techniques, and sustainable agriculture practices.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-white rounded-lg p-6 border border-amber-200 mb-6">
            <h4 className="font-semibold mb-4">How to Book an Event</h4>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="flex items-center">
                <span className="bg-amber-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3 flex-shrink-0">
                  1
                </span>
                <span>Browse upcoming events</span>
              </div>
              <div className="flex items-center">
                <span className="bg-amber-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3 flex-shrink-0">
                  2
                </span>
                <span>Select date & tickets</span>
              </div>
              <div className="flex items-center">
                <span className="bg-amber-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3 flex-shrink-0">
                  3
                </span>
                <span>Pay securely online</span>
              </div>
              <div className="flex items-center">
                <span className="bg-amber-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3 flex-shrink-0">
                  4
                </span>
                <span>Visit & enjoy the farm!</span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link href="/events">
              <Button className="bg-amber-600 hover:bg-amber-700">
                <Ticket className="mr-2 h-5 w-5" /> Explore Farm Events
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl shadow-lg p-8 mb-12 border border-purple-200">
          <div className="flex items-center mb-6">
            <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
              <Crown className="h-6 w-6 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              Subscription Plans — Unlock Premium Benefits
            </h2>
          </div>

          <p className="text-gray-600 mb-8 text-lg">
            Get the most out of FarmerSanthe with a subscription plan. Subscribers enjoy exclusive benefits like preorder access to seasonal products before they sell out, wholesale ordering privileges, and zero platform fees on every order. Choose a plan that fits your needs — whether you're a family looking for the freshest farm produce or a business buying in bulk.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl p-6 border border-purple-200">
              <h4 className="font-semibold text-purple-800 mb-4 flex items-center">
                <Home className="h-5 w-5 mr-2 text-purple-600" />
                Family Plans
              </h4>
              <div className="space-y-3">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium">FAMILY BASIC</span>
                    <p className="text-gray-500 text-sm">Preorder retail products before they sell out. Starting at just ₹199/month.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium">FAMILY FARM DIRECT</span>
                    <p className="text-gray-500 text-sm">Everything in Basic plus preorder wholesale products and zero platform fees. Starting at ₹299/month.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 border border-purple-200">
              <h4 className="font-semibold text-purple-800 mb-4 flex items-center">
                <Building2 className="h-5 w-5 mr-2 text-purple-600" />
                Business Plans
              </h4>
              <div className="space-y-3">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium">BUSINESS BASIC</span>
                    <p className="text-gray-500 text-sm">Preorder retail and wholesale products for your business needs. Starting at ₹1,999/month.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-purple-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium">BUSINESS FARM DIRECT PRO</span>
                    <p className="text-gray-500 text-sm">Full access with zero platform fees on all orders. Starting at ₹2,999/month.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-purple-200 mb-6">
            <h4 className="font-semibold text-purple-800 mb-3">Why Subscribe?</h4>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0" />
                <span>Preorder seasonal products before they sell out</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0" />
                <span>Zero platform fees on qualifying plans</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0" />
                <span>Save more with 6-month and yearly billing options</span>
              </div>
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-purple-600 mr-2 flex-shrink-0" />
                <span>Access both retail and wholesale ordering</span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link href="/subscription">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Crown className="mr-2 h-5 w-5" /> View Subscription Plans
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12 border border-gray-100">
          <div className="flex items-center mb-6">
            <div className="bg-emerald-100 w-12 h-12 rounded-full flex items-center justify-center mr-4">
              <Users className="h-6 w-6 text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">
              For Farmers — Grow Your Business
            </h2>
          </div>

          <p className="text-gray-600 mb-8 text-lg">
            Join FarmerSanthe to sell your produce directly to customers and businesses. List your products, manage orders, host farm events, and get free AI-powered NF recommendations — all from your farmer dashboard.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-lg mb-4 text-emerald-700">
                What Farmers Can Do
              </h4>
              <div className="space-y-3">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium">Retail Sales</span>
                    <p className="text-gray-500 text-sm">
                      List products for retail customers at per-unit or per-kg pricing with photos and descriptions.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium">Wholesale Listings</span>
                    <p className="text-gray-500 text-sm">
                      Create wholesale listings with slab-based volume pricing for business buyers.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium">Host Farm Events</span>
                    <p className="text-gray-500 text-sm">
                      Create and manage farm experiences like fruit picking, tours, workshops, and festivals.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium">Manage Orders</span>
                    <p className="text-gray-500 text-sm">
                      Track incoming orders, update delivery status, and manage your product inventory.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="font-medium">Free AI NF Recommendations</span>
                    <p className="text-gray-500 text-sm">
                      Get personalised Natural Farming advice powered by AI, tailored to your soil, region, and crops.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-emerald-50 rounded-lg p-6">
              <h4 className="font-semibold text-lg mb-4 text-emerald-700">
                Why Join FarmerSanthe?
              </h4>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
                  <span>Sell directly to customers — no middlemen</span>
                </li>
                <li className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
                  <span>Get FPO support through District Manager guidance</span>
                </li>
                <li className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
                  <span>Build your own farmer profile with reviews and ratings</span>
                </li>
                <li className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
                  <span>Access both retail and wholesale markets from one dashboard</span>
                </li>
                <li className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
                  <span>Free AI-powered NF recommendations for better yields</span>
                </li>
                <li className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" />
                  <span>Earn additional income by hosting farm events</span>
                </li>
              </ul>

              <div className="mt-6">
                <Link href="/register">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 w-full">
                    <Users className="mr-2 h-5 w-5" /> Join as a Farmer
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Marketing Video section */}
        <div className="rounded-2xl shadow-lg p-8 mb-12 border border-violet-200 overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 45%, #1e3a5f 100%)' }}>
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #818cf8, transparent)' }} />
          <div className="relative z-10 flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
              <Video className="h-7 w-7 text-white" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Marketing Videos for FPOs
              </h2>
              <p className="text-indigo-200 text-lg">
                FPO Managers can make simple videos to share their farmers, products, and events.
              </p>
              <p className="text-indigo-300 text-sm mt-3">
                Choose what you want to show, create the video from the dashboard, and share it with customers.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 mb-8 text-white">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield className="h-8 w-8 text-green-400" />
              <h2 className="text-2xl font-bold">Powered by Santhe</h2>
            </div>
            <p className="text-gray-300 max-w-2xl mx-auto">
              FarmerSanthe is built and operated by Santhe Technologies — committed to empowering Indian agriculture through technology, transparency, and trust.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-gray-700 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
                <CreditCard className="h-7 w-7 text-green-400" />
              </div>
              <h4 className="font-semibold mb-1">Secure Payments</h4>
              <p className="text-gray-400 text-sm">Powered by Cashfree payment gateway with bank-grade security</p>
            </div>
            <div className="text-center">
              <div className="bg-gray-700 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
                <BadgeCheck className="h-7 w-7 text-green-400" />
              </div>
              <h4 className="font-semibold mb-1">FPO Verified</h4>
              <p className="text-gray-400 text-sm">Products verified through Farmer Producer Organizations</p>
            </div>
            <div className="text-center">
              <div className="bg-gray-700 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
                <Sprout className="h-7 w-7 text-green-400" />
              </div>
              <h4 className="font-semibold mb-1">Natural Farming Promoted</h4>
              <p className="text-gray-400 text-sm">Supporting Natural Farming across India</p>
            </div>
            <div className="text-center">
              <div className="bg-gray-700 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3">
                <Heart className="h-7 w-7 text-green-400" />
              </div>
              <h4 className="font-semibold mb-1">Farmer First</h4>
              <p className="text-gray-400 text-sm">Fair pricing with direct farmer-to-consumer connections</p>
            </div>
          </div>
          <div className="text-center mt-8">
            <p className="text-gray-400 text-sm">
              Have questions? Reach us at{" "}
              <a href="mailto:support@farmersanthe.com" className="text-green-400 hover:underline">
                support@farmersanthe.com
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Official Buyers callout */}
      <div className="bg-gradient-to-r from-green-700 to-emerald-600 py-12 px-4">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-white text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl font-bold mb-1">Trusted by Hotels, Traders & Retailers</h2>
            <p className="text-green-100 text-sm">
              Leading businesses across Karnataka source their fresh produce through Santhe.
            </p>
          </div>
          <Link
            href="/official-buyers"
            className="flex-shrink-0 inline-flex items-center gap-2 bg-white text-green-700 hover:bg-green-50 font-semibold text-sm px-6 py-3 rounded-full transition-colors"
          >
            <Building2 className="h-4 w-4" />
            Meet Our Official Buyers
          </Link>
        </div>
      </div>
    </>
  );
}

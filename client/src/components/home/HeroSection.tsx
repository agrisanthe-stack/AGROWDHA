import { Link } from "wouter";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight, Users, Sprout, Brain, Sparkles, BarChart3, Layers, Award, ShoppingCart, MapPin } from "lucide-react";

const bannerUrls = [
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=800",
  "https://images.unsplash.com/photo-1574943320219-553eb213f72d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=800",
  "https://images.unsplash.com/photo-1592982633695-9c8dc4e4eb51?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=800",
  "https://images.unsplash.com/photo-1464226184884-fa280b87c399?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=800",
  "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=800",
  "https://images.unsplash.com/photo-1560493676-04071c5f467b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=800",
  "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=800",
  "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=800",
];

export default function HeroSection() {
  const { t } = useTranslation();
  const [currentImage, setCurrentImage] = useState(0);

  const bannerImages = [
    {
      url: bannerUrls[0],
      title: t('home.banners.freshFromFarm'),
      subtitle: t('home.banners.freshFromFarmSub'),
      type: "default"
    },
    {
      url: bannerUrls[1],
      title: t('home.banners.aiZbnf'),
      subtitle: t('home.banners.aiZbnfSub'),
      type: "ai-zbnf",
      description: t('home.banners.aiZbnfDesc')
    },
    {
      url: bannerUrls[2],
      title: t('home.banners.zbnfLayers'),
      subtitle: t('home.banners.zbnfLayersSub'),
      type: "zbnf-layers",
      description: t('home.banners.zbnfLayersDesc')
    },
    {
      url: bannerUrls[3],
      title: t('home.banners.harvestFreshest'),
      subtitle: t('home.banners.harvestFreshestSub'),
      type: "marketplace"
    },
    {
      url: bannerUrls[4],
      title: t('home.banners.directConnection'),
      subtitle: t('home.banners.directConnectionSub'),
      type: "marketplace",
      description: t('home.banners.directConnectionDesc')
    },
    {
      url: bannerUrls[5],
      title: t('home.banners.smartAnalytics'),
      subtitle: t('home.banners.smartAnalyticsSub'),
      type: "ai-analytics",
      description: t('home.banners.smartAnalyticsDesc')
    },
    {
      url: bannerUrls[6],
      title: t('home.banners.zbnfMethod'),
      subtitle: t('home.banners.zbnfMethodSub'),
      type: "zbnf-method",
      description: t('home.banners.zbnfMethodDesc')
    },
    {
      url: bannerUrls[7],
      title: t('home.banners.farmerMarketplace'),
      subtitle: t('home.banners.farmerMarketplaceSub'),
      type: "farmer-tools",
      description: t('home.banners.farmerMarketplaceDesc')
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % bannerImages.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % bannerImages.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + bannerImages.length) % bannerImages.length);
  };

  return (
    <section className="relative h-[500px] sm:h-[600px] overflow-hidden">
      {/* Background Images */}
      {bannerImages.map((image, index) => (
        <div
          key={index}
          className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
            index === currentImage ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ backgroundImage: `url('${image.url}')` }}
        />
      ))}
      
      {/* Overlay */}
      <div className={`absolute inset-0 ${
        bannerImages[currentImage].type === 'ai-zbnf' 
          ? 'bg-gradient-to-r from-black/80 via-blue-900/40 to-purple-900/40'
        : bannerImages[currentImage].type === 'zbnf-layers'
          ? 'bg-gradient-to-r from-black/80 via-green-900/40 to-blue-900/40'
        : bannerImages[currentImage].type === 'ai-analytics'
          ? 'bg-gradient-to-r from-black/80 via-indigo-900/40 to-cyan-900/40'
        : bannerImages[currentImage].type === 'zbnf-method'
          ? 'bg-gradient-to-r from-black/80 via-emerald-900/40 to-teal-900/40'
        : bannerImages[currentImage].type === 'marketplace'
          ? 'bg-gradient-to-r from-black/80 via-orange-900/40 to-red-900/40'
        : bannerImages[currentImage].type === 'farmer-tools'
          ? 'bg-gradient-to-r from-black/80 via-purple-900/40 to-pink-900/40'
          : 'bg-gradient-to-r from-black/70 via-black/50 to-black/30'
      }`}></div>
      
      {/* Navigation Arrows */}
      <button
        onClick={prevImage}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={nextImage}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full transition-all duration-200 backdrop-blur-sm"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
              {t('home.banners.welcomeTo')} <span className="text-green-400">Santhe</span>
            </h1>
            <div className="h-16 flex items-center justify-center">
              {bannerImages[currentImage].type === 'ai-zbnf' ? (
                <div className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto transition-all duration-500">
                  <div className="flex items-center justify-center space-x-3 mb-2">
                    <Brain className="h-8 w-8 text-blue-400 animate-pulse" />
                    <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-bold">
                      {bannerImages[currentImage].title}
                    </span>
                    <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
                  </div>
                  <p className="text-lg text-white/80">
                    {bannerImages[currentImage].subtitle}
                  </p>
                </div>
              ) : bannerImages[currentImage].type === 'zbnf-layers' ? (
                <div className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto transition-all duration-500">
                  <div className="flex items-center justify-center space-x-3 mb-2">
                    <Layers className="h-8 w-8 text-green-400 animate-pulse" />
                    <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent font-bold">
                      {bannerImages[currentImage].title}
                    </span>
                  </div>
                  <p className="text-lg text-white/80">
                    {bannerImages[currentImage].subtitle}
                  </p>
                </div>
              ) : bannerImages[currentImage].type === 'ai-analytics' ? (
                <div className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto transition-all duration-500">
                  <div className="flex items-center justify-center space-x-3 mb-2">
                    <BarChart3 className="h-8 w-8 text-cyan-400 animate-pulse" />
                    <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent font-bold">
                      {bannerImages[currentImage].title}
                    </span>
                  </div>
                  <p className="text-lg text-white/80">
                    {bannerImages[currentImage].subtitle}
                  </p>
                </div>
              ) : bannerImages[currentImage].type === 'zbnf-method' ? (
                <div className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto transition-all duration-500">
                  <div className="flex items-center justify-center space-x-3 mb-2">
                    <Award className="h-8 w-8 text-emerald-400 animate-pulse" />
                    <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent font-bold">
                      {bannerImages[currentImage].title}
                    </span>
                  </div>
                  <p className="text-lg text-white/80">
                    {bannerImages[currentImage].subtitle}
                  </p>
                </div>
              ) : bannerImages[currentImage].type === 'marketplace' ? (
                <div className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto transition-all duration-500">
                  <div className="flex items-center justify-center space-x-3 mb-2">
                    <ShoppingCart className="h-8 w-8 text-orange-400 animate-pulse" />
                    <span className="bg-gradient-to-r from-orange-400 to-red-400 bg-clip-text text-transparent font-bold">
                      {bannerImages[currentImage].title}
                    </span>
                  </div>
                  <p className="text-lg text-white/80">
                    {bannerImages[currentImage].subtitle}
                  </p>
                </div>
              ) : bannerImages[currentImage].type === 'farmer-tools' ? (
                <div className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto transition-all duration-500">
                  <div className="flex items-center justify-center space-x-3 mb-2">
                    <Sprout className="h-8 w-8 text-purple-400 animate-pulse" />
                    <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-bold">
                      {bannerImages[currentImage].title}
                    </span>
                  </div>
                  <p className="text-lg text-white/80">
                    {bannerImages[currentImage].subtitle}
                  </p>
                </div>
              ) : (
                <p className="text-xl sm:text-2xl text-white/90 max-w-3xl mx-auto transition-all duration-500">
                  {bannerImages[currentImage].title} - {bannerImages[currentImage].subtitle}
                </p>
              )}
            </div>
          </div>
          
          <div className="mb-8">
            {bannerImages[currentImage].type === 'ai-zbnf' ? (
              <div className="text-lg text-white/80 max-w-2xl mx-auto mb-6">
                <p className="mb-3">
                  {bannerImages[currentImage].description}
                </p>
                <div className="flex items-center justify-center space-x-6 text-sm">
                  <span className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>{t('home.banners.smartCropAnalysis')}</span>
                  </span>
                  <span className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>{t('home.banners.layerPlanning')}</span>
                  </span>
                  <span className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span>{t('home.banners.roiOptimization')}</span>
                  </span>
                </div>
              </div>
            ) : bannerImages[currentImage].type === 'zbnf-layers' ? (
              <div className="text-lg text-white/80 max-w-2xl mx-auto mb-6">
                <p className="mb-3">
                  {bannerImages[currentImage].description}
                </p>
                <div className="flex items-center justify-center space-x-4 text-sm">
                  <span className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>{t('home.banners.layerPlanning')}</span>
                  </span>
                  <span className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>{t('home.banners.cropCompatibility')}</span>
                  </span>
                  <span className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span>{t('home.banners.ecosystemDesign')}</span>
                  </span>
                </div>
              </div>
            ) : bannerImages[currentImage].type === 'ai-analytics' ? (
              <div className="text-lg text-white/80 max-w-2xl mx-auto mb-6">
                <p className="mb-3">
                  {bannerImages[currentImage].description}
                </p>
                <div className="flex items-center justify-center space-x-4 text-sm">
                  <span className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                    <span>{t('home.banners.locationAnalysis')}</span>
                  </span>
                  <span className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                    <span>{t('home.banners.soilInsights')}</span>
                  </span>
                  <span className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span>{t('home.banners.marketTrends')}</span>
                  </span>
                </div>
              </div>
            ) : bannerImages[currentImage].type === 'marketplace' ? (
              <div className="text-lg text-white/80 max-w-2xl mx-auto mb-6">
                <p className="mb-3">
                  {bannerImages[currentImage].description || t('home.banners.joinEcosystem')}
                </p>
                <div className="flex items-center justify-center space-x-6 text-sm">
                  <span className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                    <span>{t('home.banners.directSales')}</span>
                  </span>
                  <span className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                    <span>{t('home.banners.fairPricing')}</span>
                  </span>
                  <span className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span>{t('home.banners.freshQuality')}</span>
                  </span>
                </div>
              </div>
            ) : bannerImages[currentImage].type === 'zbnf-method' || bannerImages[currentImage].type === 'farmer-tools' ? (
              <div className="text-lg text-white/80 max-w-2xl mx-auto mb-6">
                <p className="mb-3">
                  {bannerImages[currentImage].description}
                </p>
                <div className="flex items-center justify-center space-x-4 text-sm">
                  <span className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span>{t('home.banners.costReduction')}</span>
                  </span>
                  <span className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                    <span>{t('home.banners.naturalMethods')}</span>
                  </span>
                  <span className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span>{t('home.banners.higherYields')}</span>
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-lg text-white/80 max-w-2xl mx-auto mb-6">
                {t('home.banners.joinEcosystem')}
              </p>
            )}
          </div>

          {/* Call to Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            {bannerImages[currentImage].type === 'ai-zbnf' ? (
              <>
                <Link href="/zbnf-recommendations" className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105">
                  <div className="flex items-center space-x-2">
                    <Brain className="h-5 w-5" />
                    <span>{t('home.banners.exploreAiRecommendations')}</span>
                    <Sparkles className="h-4 w-4" />
                  </div>
                </Link>
                <Link href="/products" className="group px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105">
                  <div className="flex items-center space-x-2">
                    <ShoppingCart className="h-5 w-5" />
                    <span>{t('home.banners.shopFreshProduce')}</span>
                  </div>
                </Link>
              </>
            ) : bannerImages[currentImage].type === 'zbnf-layers' ? (
              <>
                <Link href="/zbnf-recommendations" className="group px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105">
                  <div className="flex items-center space-x-2">
                    <Layers className="h-5 w-5" />
                    <span>{t('home.banners.planYourFarm')}</span>
                  </div>
                </Link>
                <Link href="/how-it-works" className="group px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105">
                  <div className="flex items-center space-x-2">
                    <Award className="h-5 w-5" />
                    <span>{t('home.banners.learnZbnf')}</span>
                  </div>
                </Link>
              </>
            ) : bannerImages[currentImage].type === 'ai-analytics' ? (
              <>
                <Link href="/zbnf-recommendations" className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-700 hover:to-cyan-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>{t('home.banners.getSmartAnalytics')}</span>
                  </div>
                </Link>
                <Link href="/farmers" className="group px-8 py-4 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>{t('home.banners.viewFarmers')}</span>
                  </div>
                </Link>
              </>
            ) : bannerImages[currentImage].type === 'zbnf-method' ? (
              <>
                <Link href="/how-it-works" className="group px-8 py-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105">
                  <div className="flex items-center space-x-2">
                    <Award className="h-5 w-5" />
                    <span>{t('home.banners.learnZbnfMethod')}</span>
                  </div>
                </Link>
                <Link href="/register?type=farmer" className="group px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105">
                  <div className="flex items-center space-x-2">
                    <Sprout className="h-5 w-5" />
                    <span>{t('home.banners.startFarming')}</span>
                  </div>
                </Link>
              </>
            ) : bannerImages[currentImage].type === 'marketplace' ? (
              <>
                <Link href="/products" className="group px-8 py-4 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105">
                  <div className="flex items-center space-x-2">
                    <ShoppingCart className="h-5 w-5" />
                    <span>{t('home.banners.shopNow')}</span>
                  </div>
                </Link>
                <Link href="/farmers" className="group px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5" />
                    <span>{t('home.banners.meetFarmers')}</span>
                  </div>
                </Link>
              </>
            ) : bannerImages[currentImage].type === 'farmer-tools' ? (
              <>
                <Link href="/register?type=farmer" className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105">
                  <div className="flex items-center space-x-2">
                    <Sprout className="h-5 w-5" />
                    <span>{t('home.banners.joinMarketplace')}</span>
                  </div>
                </Link>
                <Link href="/how-it-works" className="group px-8 py-4 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105">
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>{t('home.learnMore')}</span>
                  </div>
                </Link>
              </>
            ) : (
              <>
                <Link href="/products" className="group px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105">
                  <div className="flex items-center space-x-2">
                    <ShoppingCart className="h-5 w-5" />
                    <span>{t('home.banners.shopFreshProduce')}</span>
                  </div>
                </Link>
                <Link href="/register?type=farmer" className="group px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105">
                  <div className="flex items-center space-x-2">
                    <Sprout className="h-5 w-5" />
                    <span>{t('home.banners.becomeAFarmer')}</span>
                  </div>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Dots Indicator */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {bannerImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImage(index)}
            className={`w-3 h-3 rounded-full transition-all duration-200 ${
              index === currentImage ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
}

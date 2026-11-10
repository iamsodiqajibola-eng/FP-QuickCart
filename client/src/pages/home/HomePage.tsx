import BestSellers from "../../components/home/BestSellers";
import CategoryGrid from "../../components/home/CategoryGrid";
import FeaturedProducts from "../../components/home/FeaturedProducts";
import FlashSale from "../../components/home/FlashSale";
import HeroSection from "../../components/home/HeroSection";
import NewArrivals from "../../components/home/NewArrivals";
import NewsLetterBanner from "../../components/home/NewsLetterBanner";
import RecommededForYou from "../../components/home/RecommededForYou";
import Testimonials from "../../components/home/Testimonials";
import TodaysDeal from "../../components/home/TodaysDeal";
import TrustBar from "../../components/home/TrustBar";

const HomePage = () => {
  return (
    <div className="mx-auto flex max-w-360 flex-col gap-10 px-4 pt-10 pb-20 md:px-12">
      <HeroSection />
      <TrustBar />
      <CategoryGrid />
      <FlashSale />
      <FeaturedProducts />
      <TodaysDeal />
      <BestSellers />
      <NewArrivals />
      <RecommededForYou />
      <Testimonials />
      <NewsLetterBanner />
    </div>
  );
};

export default HomePage;

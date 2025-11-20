import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import ProductsSection from "@/components/ProductsSection";
import AboutSection from "@/components/AboutSection";
import Footer from "@/components/Footer";

const Index = () => {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isAdmin) {
      navigate('/admin/dashboard');
    }
  }, [isAdmin, loading, navigate]);

  if (loading || isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <ProductsSection />
      <AboutSection />
      <Footer />
    </div>
  );
};

export default Index;

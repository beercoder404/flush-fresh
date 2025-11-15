import { Leaf, Sparkles, Heart } from "lucide-react";

const AboutSection = () => {
  const values = [
    {
      icon: Leaf,
      title: "100% Natural",
      description: "Only pure essential oils and natural ingredients. No synthetic fragrances or harsh chemicals."
    },
    {
      icon: Sparkles,
      title: "Premium Quality",
      description: "Luxury formulations that deliver exceptional performance with every use."
    },
    {
      icon: Heart,
      title: "Gentle & Safe",
      description: "Hypoallergenic and safe for all skin types. Perfect for sensitive individuals."
    }
  ];

  return (
    <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="container mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-display font-bold text-foreground mb-6">
            Nature Meets Luxury
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            At Flush Fresh, we believe that every aspect of your daily routine 
            deserves to be elevated. Our pre-flush toilet sprays are crafted with 
            premium natural ingredients, bringing spa-like luxury to your bathroom.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {values.map((value) => (
            <div 
              key={value.title}
              className="p-8 rounded-2xl bg-card border border-border text-center group hover:shadow-md transition-all duration-300"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6 group-hover:bg-primary/20 transition-colors">
                <value.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-display font-semibold text-foreground mb-3">
                {value.title}
              </h3>
              <p className="text-muted-foreground">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

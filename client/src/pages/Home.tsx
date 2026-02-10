import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Briefcase, Home as HomeIcon, ShoppingBag, BookOpen, Search, ArrowRight, Plane, Globe, Coffee } from "lucide-react";
import { motion } from "framer-motion";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 right-0 w-2/3 h-full opacity-10 pointer-events-none">
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-primary rounded-full blur-3xl mix-blend-multiply animate-blob" />
          <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-accent rounded-full blur-3xl mix-blend-multiply animate-blob animation-delay-2000" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                The #1 Community for Expats in Korea
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.1] tracking-tight mb-6">
                Make Korea Feel <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">Like Home</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-lg leading-relaxed">
                Find your dream job, perfect apartment, and everything you need to thrive in South Korea. All in one place.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="rounded-full px-8 text-base shadow-lg shadow-primary/25" asChild>
                  <Link href="/jobs">Find a Job</Link>
                </Button>
                <Button size="lg" variant="outline" className="rounded-full px-8 text-base bg-white/50 backdrop-blur-sm" asChild>
                  <Link href="/guides">Read Guides</Link>
                </Button>
              </div>
            </motion.div>

            {/* Hero Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 translate-y-8">
                  <CardVisual 
                    icon={Briefcase} 
                    title="English Teaching" 
                    subtitle="2.8M - 3.2M KRW" 
                    color="bg-blue-50 text-blue-600"
                  />
                  <CardVisual 
                    icon={HomeIcon} 
                    title="Officetel in Gangnam" 
                    subtitle="1000/90" 
                    color="bg-indigo-50 text-indigo-600"
                  />
                </div>
                <div className="space-y-4">
                  <CardVisual 
                    icon={BookOpen} 
                    title="F-Series Visa Guide" 
                    subtitle="Updated 2024" 
                    color="bg-rose-50 text-rose-600"
                  />
                  <CardVisual 
                    icon={ShoppingBag} 
                    title="Moving Sale" 
                    subtitle="Furniture & Electronics" 
                    color="bg-emerald-50 text-emerald-600"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader 
            title="Everything You Need" 
            description="Navigating life in a foreign country is hard. We make it easier by bringing all essential resources together."
          />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard 
              to="/jobs"
              icon={Briefcase}
              title="Job Board"
              description="Find visa-sponsored roles in teaching, tech, and marketing."
              color="text-blue-600"
              bg="bg-blue-50"
            />
            <FeatureCard 
              to="/housing"
              icon={HomeIcon}
              title="Housing Search"
              description="Discover apartments, villas, and officetels foreigner-friendly."
              color="text-indigo-600"
              bg="bg-indigo-50"
            />
            <FeatureCard 
              to="/marketplace"
              icon={ShoppingBag}
              title="Marketplace"
              description="Buy and sell used furniture, electronics, and household items."
              color="text-emerald-600"
              bg="bg-emerald-50"
            />
            <FeatureCard 
              to="/guides"
              icon={BookOpen}
              title="Expats Guides"
              description="Step-by-step guides for visas, taxes, banking, and more."
              color="text-rose-600"
              bg="bg-rose-50"
            />
          </div>
        </div>
      </section>

      {/* Guide Categories */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-display font-bold">Essential Guides</h2>
            <Button variant="ghost" asChild className="group">
              <Link href="/guides">
                View all guides <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <GuideCategory icon={Plane} title="Visa & Immigration" count="12 Articles" />
            <GuideCategory icon={Globe} title="Learning Korean" count="8 Articles" />
            <GuideCategory icon={Coffee} title="Daily Life" count="15 Articles" />
          </div>
        </div>
      </section>
    </div>
  );
}

function CardVisual({ icon: Icon, title, subtitle, color }: any) {
  return (
    <div className="p-4 rounded-2xl bg-white shadow-xl shadow-black/5 border border-black/5 flex items-center gap-4 hover:-translate-y-1 transition-transform duration-300">
      <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center shrink-0`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <h3 className="font-bold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
}

function FeatureCard({ to, icon: Icon, title, description, color, bg }: any) {
  return (
    <Link href={to} className="group block h-full">
      <div className="bg-card h-full p-8 rounded-3xl border border-border shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 transition-all duration-300">
        <div className={`w-14 h-14 rounded-2xl ${bg} ${color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
          <Icon className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </Link>
  );
}

function GuideCategory({ icon: Icon, title, count }: any) {
  return (
    <div className="flex items-center gap-4 p-6 rounded-2xl bg-secondary/50 border border-border/50 hover:bg-secondary transition-colors cursor-pointer group">
      <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="text-sm text-muted-foreground">{count}</p>
      </div>
    </div>
  );
}

function SectionHeader({ title, description }: any) {
  return (
    <div className="text-center max-w-3xl mx-auto mb-16">
      <h2 className="text-3xl font-display font-bold mb-4">{title}</h2>
      <p className="text-xl text-muted-foreground">{description}</p>
    </div>
  );
}

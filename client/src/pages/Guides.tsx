import { useGuides } from "@/hooks/use-guides";
import { SectionHeader } from "@/components/SectionHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plane, Gavel, FileText, Landmark, Car, Globe } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";

const categories = [
  { id: "visa", label: "Visa", icon: Plane },
  { id: "legal", label: "Legal", icon: Gavel },
  { id: "tax", label: "Tax", icon: FileText },
  { id: "bank", label: "Bank", icon: Landmark },
  { id: "car", label: "Car", icon: Car },
  { id: "korean_language", label: "Korean", icon: Globe },
];

export default function GuidesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SectionHeader 
        title="Guides & Resources" 
        description="Everything you need to know about living in Korea."
      />
      
      <Tabs defaultValue="visa" className="space-y-8">
        <TabsList className="bg-transparent p-0 flex flex-wrap gap-2 h-auto justify-start">
          {categories.map(cat => (
            <TabsTrigger 
              key={cat.id} 
              value={cat.id}
              className="px-6 py-3 rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground border border-border data-[state=active]:border-primary transition-all"
            >
              <cat.icon className="w-4 h-4 mr-2" />
              {cat.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map(cat => (
          <TabsContent key={cat.id} value={cat.id} className="mt-8">
            <GuideList category={cat.id} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function GuideList({ category }: { category: string }) {
  const { data: guides, isLoading } = useGuides(category);

  if (isLoading) return <div className="text-center py-10">Loading guides...</div>;

  if (!guides || guides.length === 0) {
    return (
      <div className="text-center py-20 bg-secondary/30 rounded-3xl">
        <p className="text-muted-foreground">No guides found for this category yet.</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {guides.map((guide, idx) => (
        <motion.div
          key={guide.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
        >
          <Card className="h-full hover:shadow-lg transition-shadow border-l-4 border-l-primary overflow-hidden">
            <CardHeader>
              <CardTitle className="font-display text-2xl">{guide.title}</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-sm prose-slate dark:prose-invert max-w-none">
              <ReactMarkdown>{guide.content}</ReactMarkdown>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}

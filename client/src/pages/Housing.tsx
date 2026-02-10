import { useState } from "react";
import { useHousingList, useCreateHousing } from "@/hooks/use-housing";
import { useAuth } from "@/hooks/use-auth";
import { SectionHeader } from "@/components/SectionHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Home, MapPin, DollarSign, Search, Plus, Bed, Image as ImageIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertHousingSchema, type CreateHousingRequest } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { motion } from "framer-motion";

export default function HousingPage() {
  const { data: housing, isLoading } = useHousingList();
  const { isAuthenticated } = useAuth();
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredHousing = housing?.filter(item => 
    item.location.toLowerCase().includes(search.toLowerCase()) || 
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SectionHeader 
        title="Housing Search" 
        description="Find apartments, villas, and officetels."
        action={
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search by location..." 
                className="pl-9 w-64 rounded-full bg-background"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {isAuthenticated && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="rounded-full shadow-lg shadow-primary/20">
                    <Plus className="w-4 h-4 mr-2" /> List Property
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>List a Property</DialogTitle>
                  </DialogHeader>
                  <CreateHousingForm onSuccess={() => setIsDialogOpen(false)} />
                </DialogContent>
              </Dialog>
            )}
          </div>
        }
      />

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-80 bg-secondary/50 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHousing?.map((item) => (
            <HousingCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

function HousingCard({ item }: { item: any }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
    >
      <div className="aspect-[4/3] bg-muted relative overflow-hidden">
        {item.images && item.images.length > 0 ? (
          <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <ImageIcon className="w-12 h-12 opacity-20" />
          </div>
        )}
        <div className="absolute top-4 left-4 bg-background/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
          {item.type}
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-lg mb-2 truncate">{item.title}</h3>
        <div className="flex items-center text-muted-foreground text-sm mb-4">
          <MapPin className="w-4 h-4 mr-1" /> {item.location}
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            <span className="text-xs text-muted-foreground block uppercase font-bold tracking-wider">Rent / Deposit</span>
            <span className="font-bold text-primary">{item.rent} / {item.deposit}</span>
          </div>
          <Button size="sm" variant="outline">Details</Button>
        </div>
      </div>
    </motion.div>
  );
}

function CreateHousingForm({ onSuccess }: { onSuccess: () => void }) {
  const { toast } = useToast();
  const { mutate, isPending } = useCreateHousing();
  const { user } = useAuth();

  const form = useForm<CreateHousingRequest>({
    resolver: zodResolver(insertHousingSchema),
    defaultValues: {
      userId: user?.id || "",
      title: "",
      type: "Apartment",
      rent: 0,
      deposit: 0,
      location: "",
      description: "",
      contactInfo: "",
      images: [],
    }
  });

  function onSubmit(data: CreateHousingRequest) {
    mutate(data, {
      onSuccess: () => {
        toast({ title: "Property Listed", description: "Your listing is now live!" });
        onSuccess();
      },
      onError: (error) => {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl><Input placeholder="e.g. Cozy 1BR in Hongdae" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Apartment">Apartment</SelectItem>
                    <SelectItem value="Officetel">Officetel</SelectItem>
                    <SelectItem value="Villa">Villa</SelectItem>
                    <SelectItem value="Sharehouse">Sharehouse</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl><Input placeholder="e.g. Mapo-gu" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="rent"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Monthly Rent (10k KRW)</FormLabel>
                <FormControl><Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="deposit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Deposit (10k KRW)</FormLabel>
                <FormControl><Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl><Textarea placeholder="Details about the place..." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contactInfo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Info</FormLabel>
              <FormControl><Input placeholder="Kakao ID or Phone" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Listing..." : "List Property"}
        </Button>
      </form>
    </Form>
  );
}

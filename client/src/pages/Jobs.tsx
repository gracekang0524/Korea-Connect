import { useState } from "react";
import { useJobs, useCreateJob } from "@/hooks/use-jobs";
import { useAuth } from "@/hooks/use-auth";
import { SectionHeader } from "@/components/SectionHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Briefcase, MapPin, DollarSign, Search, Plus, Building2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertJobSchema, type CreateJobRequest } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { format } from "date-fns";
import { motion } from "framer-motion";

export default function JobsPage() {
  const { data: jobs, isLoading } = useJobs();
  const { isAuthenticated } = useAuth();
  const [search, setSearch] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const filteredJobs = jobs?.filter(job => 
    job.title.toLowerCase().includes(search.toLowerCase()) || 
    job.company.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SectionHeader 
        title="Job Opportunities" 
        description="Find visa-sponsored roles in teaching, tech, marketing and more."
        action={
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input 
                placeholder="Search jobs..." 
                className="pl-9 w-64 rounded-full bg-background"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            {isAuthenticated && (
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="rounded-full shadow-lg shadow-primary/20">
                    <Plus className="w-4 h-4 mr-2" /> Post Job
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Post a Job Opportunity</DialogTitle>
                  </DialogHeader>
                  <CreateJobForm onSuccess={() => setIsDialogOpen(false)} />
                </DialogContent>
              </Dialog>
            )}
          </div>
        }
      />

      {isLoading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-secondary/50 animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredJobs?.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              <Briefcase className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="text-lg font-medium">No jobs found matching your search.</p>
            </div>
          ) : (
            filteredJobs?.map((job) => (
              <JobCard key={job.id} job={job} />
            ))
          )}
        </div>
      )}
    </div>
  );
}

function JobCard({ job }: { job: any }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-card rounded-2xl p-6 border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300 group"
    >
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-primary font-bold text-lg">
            {job.company[0]}
          </div>
          <div>
            <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{job.title}</h3>
            <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Building2 className="w-4 h-4" /> {job.company}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" /> {job.location}
              </span>
              <span className="flex items-center gap-1">
                <DollarSign className="w-4 h-4" /> {job.salary}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground font-medium px-3 py-1 bg-secondary rounded-full">
            {format(new Date(job.createdAt), "MMM d")}
          </span>
          <Button>Apply Now</Button>
        </div>
      </div>
      <div className="mt-6 pt-6 border-t border-border">
        <p className="text-muted-foreground line-clamp-2">{job.description}</p>
      </div>
    </motion.div>
  );
}

function CreateJobForm({ onSuccess }: { onSuccess: () => void }) {
  const { toast } = useToast();
  const { mutate, isPending } = useCreateJob();
  const { user } = useAuth();
  
  const form = useForm<CreateJobRequest>({
    resolver: zodResolver(insertJobSchema),
    defaultValues: {
      userId: user?.id || "",
      title: "",
      company: "",
      description: "",
      location: "",
      salary: "",
      contactInfo: "",
    }
  });

  function onSubmit(data: CreateJobRequest) {
    mutate(data, {
      onSuccess: () => {
        toast({ title: "Job Posted", description: "Your job listing is now live!" });
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
              <FormLabel>Job Title</FormLabel>
              <FormControl><Input placeholder="e.g. English Teacher" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <FormControl><Input placeholder="e.g. Samsung" {...field} /></FormControl>
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
                <FormControl><Input placeholder="e.g. Gangnam, Seoul" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="salary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Salary</FormLabel>
              <FormControl><Input placeholder="e.g. 2.5M - 3.0M KRW" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="contactInfo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contact Info / Link</FormLabel>
              <FormControl><Input placeholder="Email or URL to apply" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl><Textarea placeholder="Job details..." className="h-32" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Posting..." : "Post Job"}
        </Button>
      </form>
    </Form>
  );
}

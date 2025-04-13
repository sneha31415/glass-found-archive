
import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PageTitle from "@/components/PageTitle";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="container max-w-4xl">
        <div className="glass rounded-lg p-8 md:p-12 text-center">
          <div className="mb-10">
            <div className="h-20 w-20 rounded-full bg-gradient-to-br from-primary to-accent mx-auto flex items-center justify-center mb-6">
              <span className="text-white text-2xl font-bold">VJ</span>
            </div>
            <PageTitle 
              title="VJTI Lost & Found Portal"
              subtitle="A secure platform to report and reclaim lost items"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2 mb-10">
            <div className="glass p-6 rounded-lg bg-gradient-primary bg-opacity-10 hover:bg-opacity-20 transition-all duration-300">
              <h3 className="text-xl font-semibold mb-3 text-glow">Report Found Items</h3>
              <p className="text-muted-foreground mb-4">Found something on campus? Report it here to help it find its way back to its owner.</p>
              <Button asChild className="w-full">
                <Link to="/report-found">Report Found Item</Link>
              </Button>
            </div>
            
            <div className="glass p-6 rounded-lg bg-gradient-accent bg-opacity-10 hover:bg-opacity-20 transition-all duration-300">
              <h3 className="text-xl font-semibold mb-3 text-glow">Lost Something?</h3>
              <p className="text-muted-foreground mb-4">Looking for something you lost? Check our database or report your lost item.</p>
              <Button asChild variant="secondary" className="w-full">
                <Link to="/report-lost">Report Lost Item</Link>
              </Button>
            </div>
          </div>
          
          <div className="glass p-6 rounded-lg bg-gradient-secondary bg-opacity-5 hover:bg-opacity-10 transition-all duration-300">
            <h3 className="text-xl font-semibold mb-3">Browse All Items</h3>
            <p className="text-muted-foreground mb-4">View all reported items in our system.</p>
            <Button asChild variant="outline" className="w-full">
              <Link to="/items">Browse Items</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;

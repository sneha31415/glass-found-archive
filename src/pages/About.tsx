
import PageTitle from "@/components/PageTitle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  MapPin, 
  Clock, 
  Mail, 
  Phone, 
  Info, 
  AlertTriangle 
} from "lucide-react";

const About = () => {
  return (
    <div className="container py-20">
      <PageTitle 
        title="About VJTI Lost & Found" 
        subtitle="Helping reunite students with their lost belongings" 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              VJTI Lost & Found aims to create an efficient system to help students recover their lost items on campus, reducing waste and stress associated with losing personal belongings.
            </p>
          </CardContent>
        </Card>
        
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Operating Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              <span className="block font-medium text-foreground">Lost & Found Office</span>
              Monday - Friday: 9:00 AM - 5:00 PM<br />
              Saturday: 10:00 AM - 2:00 PM<br />
              Sunday: Closed
            </p>
          </CardContent>
        </Card>
        
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              <span className="block font-medium text-foreground">Main Office</span>
              Student Services Building<br />
              Room 103, Ground Floor<br />
              VJTI Campus
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="glass rounded-lg p-8 mb-12">
        <h2 className="text-2xl font-bold mb-6">How It Works</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <span className="text-xl font-bold">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Reporting Found Items</h3>
            <p className="text-muted-foreground">
              When you find an item, report it through our system with details and photos. Create verification questions that only the true owner would know.
            </p>
          </div>
          
          <div>
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <span className="text-xl font-bold">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Claiming Lost Items</h3>
            <p className="text-muted-foreground">
              Browse through reported items. If you find yours, submit a claim by answering the verification questions correctly to prove ownership.
            </p>
          </div>
          
          <div>
            <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
              <span className="text-xl font-bold">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Returning Items</h3>
            <p className="text-muted-foreground">
              Once verified, pick up your item from the Lost & Found office during operating hours. Both parties will receive confirmation.
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <Card className="glass">
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Email</p>
                <p className="text-muted-foreground">lostandfound@vjti.ac.in</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Phone</p>
                <p className="text-muted-foreground">+91 123-456-7890</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Address</p>
                <p className="text-muted-foreground">
                  Veermata Jijabai Technological Institute<br />
                  Matunga, Mumbai - 400019<br />
                  Maharashtra, India
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              Guidelines & Policies
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium">Item Retention Period</h3>
              <p className="text-muted-foreground">
                Unclaimed items will be held for 90 days. After this period, they may be donated to charity or disposed of appropriately.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium">Valuable Items</h3>
              <p className="text-muted-foreground">
                High-value items like electronics, wallets, or IDs require additional verification steps for claiming to ensure they reach their rightful owners.
              </p>
            </div>
            
            <div>
              <h3 className="font-medium">Privacy Policy</h3>
              <p className="text-muted-foreground">
                We respect your privacy. Personal information provided during the reporting or claiming process is used solely for the purpose of returning lost items.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="glass rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Have Questions?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-6">
          If you have any questions or need assistance with the Lost & Found system, 
          please don't hesitate to contact our office during operating hours.
        </p>
        <div className="flex justify-center gap-4">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            <span>lostandfound@vjti.ac.in</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-primary" />
            <span>+91 123-456-7890</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;

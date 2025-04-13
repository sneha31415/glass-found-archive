import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useItems } from "@/contexts/ItemsContext";
import { useAuth } from "@/contexts/AuthContext";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Question } from "@/types";
import { X, Plus, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

const ReportFound = () => {
  const { addItem } = useItems();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [dateFound, setDateFound] = useState(new Date().toISOString().split("T")[0]);
  const [reporterName, setReporterName] = useState(user ? user.name : "");
  const [reporterContact, setReporterContact] = useState(user ? user.email : "");
  const [imageUrl, setImageUrl] = useState("");
  
  const [questions, setQuestions] = useState<{ question: string; answer: string }[]>([
    { question: "", answer: "" },
    { question: "", answer: "" }
  ]);
  
  const handleAddQuestion = () => {
    setQuestions([...questions, { question: "", answer: "" }]);
  };
  
  const handleRemoveQuestion = (index: number) => {
    if (questions.length <= 2) {
      toast.error("At least two verification questions are required");
      return;
    }
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };
  
  const handleQuestionChange = (index: number, field: "question" | "answer", value: string) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };
  
  const validateForm = () => {
    if (!name) return "Item name is required";
    if (!description) return "Description is required";
    if (!category) return "Category is required";
    if (!location) return "Location is required";
    if (!dateFound) return "Date found is required";
    if (!reporterName) return "Your name is required";
    if (!reporterContact) return "Contact information is required";
    
    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].question) return `Question ${i + 1} is missing`;
      if (!questions[i].answer) return `Answer ${i + 1} is missing`;
    }
    
    return null;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }
    
    // Format questions with IDs
    const formattedQuestions: Question[] = questions.map((q, index) => ({
      id: `q${Date.now()}-${index}`,
      question: q.question,
      answer: q.answer
    }));
    
    addItem({
      name,
      description,
      category,
      location,
      dateFound: new Date(dateFound).toISOString(),
      reportedBy: user ? user.id : "anonymous",
      reporterName,
      reporterContact,
      questions: formattedQuestions,
      imageUrl: imageUrl || undefined
    });
    
    navigate("/items");
  };
  
  return (
    <div className="container py-20">
      <PageTitle 
        title="Report a Found Item" 
        subtitle="Help return lost items to their owners" 
      />
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="glass rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Item Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Item Name</Label>
              <Input
                id="name"
                placeholder="e.g., Laptop, Wallet, Water Bottle"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="glass-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                placeholder="e.g., Electronics, Personal Items, Academic"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="glass-input"
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Detailed description of the item..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="glass-input min-h-[100px]"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Where Found</Label>
              <Input
                id="location"
                placeholder="e.g., Library, Canteen, Room 202"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="glass-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dateFound">Date Found</Label>
              <Input
                id="dateFound"
                type="date"
                value={dateFound}
                onChange={(e) => setDateFound(e.target.value)}
                className="glass-input"
                max={new Date().toISOString().split("T")[0]}
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="imageUrl">Image URL (Optional)</Label>
              <Input
                id="imageUrl"
                placeholder="URL to an image of the item"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="glass-input"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Please provide a URL to an image if available
              </p>
            </div>
          </div>
        </div>
        
        <div className="glass rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Verification Questions</h2>
          <p className="text-muted-foreground mb-6">
            Add questions that only the true owner would know the answers to
          </p>
          
          {questions.map((q, index) => (
            <div key={index} className="glass p-4 rounded-lg mb-4 relative">
              <div className="absolute top-4 right-4">
                <Button 
                  type="button"
                  variant="ghost" 
                  size="icon"
                  onClick={() => handleRemoveQuestion(index)}
                  disabled={questions.length <= 2}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <h3 className="font-medium mb-4">Question {index + 1}</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor={`question-${index}`}>Question</Label>
                  <Input
                    id={`question-${index}`}
                    placeholder="e.g., What is the wallpaper on the laptop?"
                    value={q.question}
                    onChange={(e) => handleQuestionChange(index, "question", e.target.value)}
                    className="glass-input"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor={`answer-${index}`}>Answer</Label>
                  <Input
                    id={`answer-${index}`}
                    placeholder="e.g., Mountain landscape"
                    value={q.answer}
                    onChange={(e) => handleQuestionChange(index, "answer", e.target.value)}
                    className="glass-input"
                  />
                </div>
              </div>
            </div>
          ))}
          
          <Button
            type="button"
            variant="outline"
            onClick={handleAddQuestion}
            className="mt-2"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Question
          </Button>
        </div>
        
        <div className="glass rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-6">Your Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="reporterName">Your Name</Label>
              <Input
                id="reporterName"
                placeholder="Your full name"
                value={reporterName}
                onChange={(e) => setReporterName(e.target.value)}
                className="glass-input"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reporterContact">Contact Information</Label>
              <Input
                id="reporterContact"
                placeholder="Your email or phone number"
                value={reporterContact}
                onChange={(e) => setReporterContact(e.target.value)}
                className="glass-input"
              />
            </div>
          </div>
          
          <div className="flex items-start mt-6 p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
            <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-yellow-500">Important Note</h4>
              <p className="text-sm text-muted-foreground">
                By submitting this form, you confirm that you've found this item and are turning it in to the Lost & Found system. The item will be available for claiming by its rightful owner.
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
          <Button type="submit">
            Submit Report
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ReportFound;

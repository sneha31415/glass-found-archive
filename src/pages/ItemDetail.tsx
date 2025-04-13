import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useItems } from "@/contexts/ItemsContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ItemStatus, UserRole } from "@/types";
import { 
  Calendar, 
  MapPin, 
  User, 
  Mail, 
  ArrowLeft, 
  HelpCircle, 
  Tag,
  ClipboardList
} from "lucide-react";
import { toast } from "sonner";

const ItemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { getItem, claimItem, returnItem } = useItems();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<{ questionId: string; answer: string }[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (!id) {
    navigate("/items");
    return null;
  }

  const item = getItem(id);

  if (!item) {
    return (
      <div className="container py-20">
        <div className="glass p-8 rounded-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Item Not Found</h2>
          <p className="text-muted-foreground mb-6">The item you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate("/items")}>
            View All Items
          </Button>
        </div>
      </div>
    );
  }

  const handleAnswerChange = (questionId: string, value: string) => {
    const newAnswers = [...answers];
    const existingIndex = newAnswers.findIndex(a => a.questionId === questionId);
    
    if (existingIndex >= 0) {
      newAnswers[existingIndex].answer = value;
    } else {
      newAnswers.push({ questionId, answer: value });
    }
    
    setAnswers(newAnswers);
  };

  const handleClaimSubmit = () => {
    if (!user) {
      toast.error("You must be logged in to claim an item");
      navigate("/login");
      return;
    }
    
    // Check if all questions have answers
    if (answers.length !== item.questions.length) {
      toast.error("Please answer all questions");
      return;
    }
    
    const success = claimItem(item.id, answers);
    if (success) {
      setIsDialogOpen(false);
    }
  };

  const handleReturnItem = () => {
    returnItem(item.id);
  };

  const getStatusBadge = (status: ItemStatus) => {
    switch (status) {
      case ItemStatus.FOUND:
        return <Badge className="bg-green-500 hover:bg-green-600">Found</Badge>;
      case ItemStatus.CLAIMED:
        return <Badge className="bg-blue-500 hover:bg-blue-600">Claimed</Badge>;
      case ItemStatus.RETURNED:
        return <Badge className="bg-gray-500 hover:bg-gray-600">Returned</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="container py-20">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6"
      >
        <ArrowLeft size={16} />
        Back
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Item Image */}
        <div className="glass rounded-lg overflow-hidden">
          <img
            src={item.imageUrl || "https://via.placeholder.com/600x400?text=No+Image"}
            alt={item.name}
            className="w-full h-auto object-cover"
          />
        </div>

        {/* Item Details */}
        <div className="glass rounded-lg p-6 lg:col-span-2">
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold">{item.name}</h1>
            {getStatusBadge(item.status)}
          </div>

          <p className="text-muted-foreground mb-6">{item.description}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Date Found</p>
                <p>{new Date(item.dateFound).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p>{item.location}</p>
              </div>
            </div>

            <div className="flex items-center">
              <Tag className="h-5 w-5 mr-2 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <p>{item.category}</p>
              </div>
            </div>

            <div className="flex items-center">
              <User className="h-5 w-5 mr-2 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Reported By</p>
                <p>{item.reporterName}</p>
              </div>
            </div>

            <div className="flex items-center">
              <Mail className="h-5 w-5 mr-2 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Contact</p>
                <p>{item.reporterContact}</p>
              </div>
            </div>

            {item.status === ItemStatus.CLAIMED && (
              <div className="flex items-center">
                <User className="h-5 w-5 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Claimed By</p>
                  <p>{user?.id === item.claimedBy ? "You" : "Another User"}</p>
                </div>
              </div>
            )}

            {item.status === ItemStatus.RETURNED && item.returnedDate && (
              <div className="flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Returned Date</p>
                  <p>{new Date(item.returnedDate).toLocaleDateString()}</p>
                </div>
              </div>
            )}
          </div>

          {item.status === ItemStatus.FOUND && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full">Claim This Item</Button>
              </DialogTrigger>
              <DialogContent className="glass sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Claim Item: {item.name}</DialogTitle>
                  <DialogDescription>
                    To verify you're the owner, please answer these questions about the item.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  {item.questions.map((question, index) => (
                    <div key={question.id} className="space-y-2">
                      <Label htmlFor={`question-${index}`}>
                        {index + 1}. {question.question}
                      </Label>
                      <Input
                        id={`question-${index}`}
                        placeholder="Your answer..."
                        className="glass-input"
                        onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      />
                    </div>
                  ))}
                </div>

                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleClaimSubmit}>Submit Claim</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}

          {item.status === ItemStatus.CLAIMED && user?.id === item.claimedBy && (
            <Button 
              onClick={handleReturnItem}
              className="w-full"
            >
              Mark as Returned
            </Button>
          )}
        </div>
      </div>

      {/* Questions Section (Admin or reporter only) */}
      {(user?.id === item.reportedBy || user?.role === UserRole.ADMIN) && (
        <div className="glass rounded-lg p-6 mt-8">
          <div className="flex items-center gap-2 mb-4">
            <ClipboardList className="h-5 w-5" />
            <h2 className="text-xl font-bold">Verification Questions</h2>
          </div>
          <p className="text-muted-foreground mb-4">
            These questions will be used to verify the rightful owner when someone tries to claim this item.
          </p>
          <div className="space-y-4">
            {item.questions.map((question, index) => (
              <div key={question.id} className="glass p-4 rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">Question {index + 1}</h3>
                    <p className="my-2">{question.question}</p>
                  </div>
                </div>
                <div className="mt-2 pt-2 border-t border-white/5">
                  <p className="text-sm text-muted-foreground">Answer:</p>
                  <p>{question.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ItemDetail;

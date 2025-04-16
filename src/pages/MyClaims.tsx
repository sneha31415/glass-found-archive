import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useItems } from "@/contexts/ItemsContext";
import { useAuth } from "@/contexts/AuthContext";
import PageTitle from "@/components/PageTitle";
import { Button } from "@/components/ui/button";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ItemStatus, ClaimStatus } from "@/types";
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Mail,
  Phone,
  ArrowLeft,
  User
} from "lucide-react";
import { toast } from "sonner";

const MyClaims = () => {
  const { items, getClaimAttempts, returnItem } = useItems();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState<{
    id: string;
    showContact: boolean;
  } | null>(null);

  // Get all claims made by the current user
  const allClaims = items.flatMap(item => {
    const claims = getClaimAttempts(item.id);
    return claims
      .filter(claim => claim.userId === user?.id)
      .map(claim => ({
        ...claim,
        item: items.find(i => i.id === claim.itemId)
      }));
  });

  // Filter claims by status
  const pendingClaims = allClaims.filter(claim => claim.status === ClaimStatus.PENDING);
  const approvedClaims = allClaims.filter(claim => claim.status === ClaimStatus.APPROVED);
  const rejectedClaims = allClaims.filter(claim => claim.status === ClaimStatus.REJECTED);

  const handleReturnItem = (itemId: string) => {
    returnItem(itemId);
    toast.success("Item marked as returned");
  };

  return (
    <div className="container py-20">
      <div className="flex items-center gap-2 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <PageTitle 
          title="My Claims" 
          subtitle="View the status of your item claims" 
        />
      </div>

      {/* Pending Claims */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-yellow-500" />
          <h2 className="text-xl font-semibold">Pending Claims</h2>
          <span className="text-sm text-muted-foreground">
            ({pendingClaims.length})
          </span>
        </div>

        {pendingClaims.length === 0 ? (
          <div className="glass rounded-lg p-6 text-center">
            <p className="text-muted-foreground">No pending claims</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {pendingClaims.map(claim => (
              <div key={claim.id} className="glass rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium">{claim.item?.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Status: Pending Review
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {claim.item?.questions.map(question => {
                    const answer = claim.answers.find(a => a.questionId === question.id);
                    return (
                      <div key={question.id} className="space-y-1">
                        <p className="text-sm font-medium">{question.question}</p>
                        <p className="text-sm text-muted-foreground">{answer?.answer}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Approved Claims */}
      <div className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          <h2 className="text-xl font-semibold">Approved Claims</h2>
          <span className="text-sm text-muted-foreground">
            ({approvedClaims.length})
          </span>
        </div>

        {approvedClaims.length === 0 ? (
          <div className="glass rounded-lg p-6 text-center">
            <p className="text-muted-foreground">No approved claims</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {approvedClaims.map(claim => (
              <div key={claim.id} className="glass rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium">{claim.item?.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Status: Approved
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedItem({
                        id: claim.itemId,
                        showContact: true
                      })}
                    >
                      View Contact Details
                    </Button>
                    {claim.item?.status === ItemStatus.CLAIMED && (
                      <Button
                        onClick={() => handleReturnItem(claim.itemId)}
                      >
                        Mark as Returned
                      </Button>
                    )}
                  </div>
                </div>

                {claim.reporterResponse && (
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <p className="text-sm font-medium mb-2">Reporter's Response:</p>
                    <p className="text-sm text-muted-foreground">
                      {claim.reporterResponse}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rejected Claims */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <XCircle className="h-5 w-5 text-red-500" />
          <h2 className="text-xl font-semibold">Rejected Claims</h2>
          <span className="text-sm text-muted-foreground">
            ({rejectedClaims.length})
          </span>
        </div>

        {rejectedClaims.length === 0 ? (
          <div className="glass rounded-lg p-6 text-center">
            <p className="text-muted-foreground">No rejected claims</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {rejectedClaims.map(claim => (
              <div key={claim.id} className="glass rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-medium">{claim.item?.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Status: Rejected
                    </p>
                  </div>
                </div>

                {claim.reporterResponse && (
                  <div className="mt-4 pt-4 border-t border-white/5">
                    <p className="text-sm font-medium mb-2">Reporter's Response:</p>
                    <p className="text-sm text-muted-foreground">
                      {claim.reporterResponse}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Contact Details Dialog */}
      <Dialog 
        open={!!selectedItem} 
        onOpenChange={() => setSelectedItem(null)}
      >
        <DialogContent className="glass sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Contact Details</DialogTitle>
            <DialogDescription>
              Contact information for the item reporter
            </DialogDescription>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-2">
                <User className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Name</p>
                  <p className="text-sm text-muted-foreground">
                    {items.find(i => i.id === selectedItem.id)?.reporterName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Email</p>
                  <p className="text-sm text-muted-foreground">
                    {items.find(i => i.id === selectedItem.id)?.reporterContact}
                  </p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setSelectedItem(null)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MyClaims; 
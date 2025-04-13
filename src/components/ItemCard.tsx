
import { Item, ItemStatus } from "@/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, User, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

interface ItemCardProps {
  item: Item;
}

const ItemCard: React.FC<ItemCardProps> = ({ item }) => {
  const getStatusBadge = (status: ItemStatus) => {
    switch (status) {
      case ItemStatus.FOUND:
        return <Badge className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700">Found</Badge>;
      case ItemStatus.CLAIMED:
        return <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700">Claimed</Badge>;
      case ItemStatus.RETURNED:
        return <Badge className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700">Returned</Badge>;
      case ItemStatus.LOST:
        return <Badge className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700">Lost</Badge>;
      case ItemStatus.MATCHED:
        return <Badge className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700">Matched</Badge>;
      default:
        return null;
    }
  };

  const gradientClass = item.isLostItem ? "card-gradient-pink" : "card-gradient-blue";

  return (
    <Card className={`glass overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:shadow-primary/10 ${gradientClass}`}>
      <CardHeader className="p-0">
        <div className="relative h-48 w-full overflow-hidden">
          <img
            src={item.imageUrl || "https://via.placeholder.com/300x200?text=No+Image"}
            alt={item.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute top-2 right-2">
            {getStatusBadge(item.status)}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 flex-grow">
        <h3 className="text-xl font-semibold mb-2 text-glow">{item.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {item.description}
        </p>

        <div className="space-y-2">
          <div className="flex items-center text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 mr-1" />
            <span>{item.location}</span>
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 mr-1" />
            <span>{new Date(item.dateFound || item.dateLost || item.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <User className="h-3.5 w-3.5 mr-1" />
            <span>Reported by {item.reporterName}</span>
          </div>
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3.5 w-3.5 mr-1" />
            <span>{formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="px-4 py-3 border-t border-white/5">
        <Button asChild variant="secondary" className="w-full bg-gradient-to-r from-secondary to-secondary/80 hover:from-secondary/90 hover:to-secondary/70">
          <Link to={`/items/${item.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ItemCard;

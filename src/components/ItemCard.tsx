
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
    <Card className="glass overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
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
        <h3 className="text-xl font-semibold mb-2">{item.name}</h3>
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
            <span>{new Date(item.dateFound).toLocaleDateString()}</span>
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
        <Button asChild variant="secondary" className="w-full">
          <Link to={`/items/${item.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ItemCard;

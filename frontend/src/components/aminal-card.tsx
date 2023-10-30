import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardMedia,
  CardSection,
  CardTitle,
} from "@/components/ui/card";
import type { Aminal } from "@/hooks/resources/aminals";

export default function AminalCard({ aminal }: { aminal: Aminal }) {
  return (
    <Card>
      <CardMedia>
        <span className="text-gray-400">Here be aminal image</span>
      </CardMedia>
      <CardSection>
        <CardHeader>
          <CardTitle>Aminal #{aminal.id}</CardTitle>
          <CardDescription>{aminal.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Card Content</p>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </CardSection>
    </Card>
  );
}
